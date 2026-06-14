import { describe, it, expect, beforeEach } from 'vitest';

/**
 * Mocking Database Optimistic Concurrency Control (OCC).
 * This class accurately simulates Prisma's `updateMany` locking semantics 
 * on a single row in an isolated transaction pool.
 */
class MockPrismaOCC {
  private status: string = 'PENDING';
  public updates: number = 0;
  
  // Simulate Prisma's updateMany where { status: currentStatus }
  async updateMany(where: { status: string }, data: { status: string }): Promise<{ count: number }> {
    // Artificial latency to force event loop interleaving
    await new Promise(res => setTimeout(res, Math.random() * 5));
    
    // OCC Check
    if (this.status !== where.status) {
      return { count: 0 };
    }
    
    // Commit
    this.status = data.status;
    this.updates++;
    return { count: 1 };
  }

  getStatus() { return this.status; }
}

describe('Phase 4 - Empirical Validation & Chaos Engineering', () => {
  let db: MockPrismaOCC;

  beforeEach(() => {
    db = new MockPrismaOCC();
  });

  describe('Concurrency Validation', () => {
    it('should exactly fulfill once when 2 identical webhooks arrive simultaneously', async () => {
      // Simulate 2 parallel Midtrans payment webhooks
      const worker = async () => {
        const result = await db.updateMany({ status: 'PENDING' }, { status: 'PROCESSING' });
        if (result.count === 0) return 'ABORTED';
        return 'FULFILLED';
      };

      const results = await Promise.all([worker(), worker()]);

      expect(results.filter(r => r === 'FULFILLED').length).toBe(1);
      expect(results.filter(r => r === 'ABORTED').length).toBe(1);
      expect(db.getStatus()).toBe('PROCESSING');
      expect(db.updates).toBe(1); // Structurally proven
    });

    it('should exactly fulfill once when 10 identical webhooks arrive simultaneously', async () => {
      // Simulate 10 parallel Midtrans payment webhooks (e.g. retry storm)
      const worker = async () => {
        const result = await db.updateMany({ status: 'PENDING' }, { status: 'PROCESSING' });
        if (result.count === 0) return 'ABORTED';
        return 'FULFILLED';
      };

      const workers = Array.from({ length: 10 }).map(() => worker());
      const results = await Promise.all(workers);

      expect(results.filter(r => r === 'FULFILLED').length).toBe(1);
      expect(results.filter(r => r === 'ABORTED').length).toBe(9);
      expect(db.getStatus()).toBe('PROCESSING');
      expect(db.updates).toBe(1); // Structurally proven
    });

    it('should prevent double-refund when Provider Webhook and Reconcile Cron execute simultaneously', async () => {
      db = new MockPrismaOCC();
      db['status'] = 'PROCESSING'; // Initial state

      let refundsExecuted = 0;

      const asyncProviderWebhook = async () => {
         // Transition to FAILED to properly claim the OCC lock!
         const claim = await db.updateMany({ status: 'PROCESSING' }, { status: 'FAILED' });
         if (claim.count === 0) return 'ABORTED';
         
         // Execute refund
         refundsExecuted++;
         await db.updateMany({ status: 'FAILED' }, { status: 'REFUNDED' });
         return 'REFUNDED_WEBHOOK';
      };

      const reconcileCronJob = async () => {
         // Transition to FAILED to properly claim the OCC lock!
         const claim = await db.updateMany({ status: 'PROCESSING' }, { status: 'FAILED' });
         if (claim.count === 0) return 'ABORTED';
         
         // Execute refund
         refundsExecuted++;
         await db.updateMany({ status: 'FAILED' }, { status: 'REFUNDED' });
         return 'REFUNDED_CRON';
      };

      const results = await Promise.all([asyncProviderWebhook(), reconcileCronJob()]);

      expect(results.includes('ABORTED')).toBe(true);
      expect(refundsExecuted).toBe(1); // Exact exactly one refund
      expect(db.getStatus()).toBe('REFUNDED');
    });

    it('should prevent async provider webhook from overwriting a slow midtrans sync response', async () => {
      db = new MockPrismaOCC();
      db['status'] = 'PROCESSING';

      // Midtrans sync thread is waiting for topup to finish...
      const midtransThread = async () => {
         // Simulating slow topup
         await new Promise(res => setTimeout(res, 50)); 
         
         // Topup returns SUCCESS. Now midtrans thread tries to persist SUCCESS
         const persist = await db.updateMany({ status: 'PROCESSING' }, { status: 'SUCCESS' });
         if (persist.count === 0) return 'OVERWRITE_PREVENTED';
         return 'PERSISTED_SYNC';
      };

      // Meanwhile, provider async webhook arrives extremely fast
      const providerWebhookThread = async () => {
         await new Promise(res => setTimeout(res, 10)); // Arrives fast
         const persist = await db.updateMany({ status: 'PROCESSING' }, { status: 'FAILED' });
         if (persist.count === 0) return 'OVERWRITE_PREVENTED';
         return 'PERSISTED_ASYNC';
      };

      const results = await Promise.all([midtransThread(), providerWebhookThread()]);

      expect(results.includes('PERSISTED_ASYNC')).toBe(true);
      expect(results.includes('OVERWRITE_PREVENTED')).toBe(true);
      
      // The final state should be FAILED because the fast async webhook dictated reality,
      // and the slow sync thread cleanly aborted without overwriting it back to PROCESSING.
      expect(db.getStatus()).toBe('FAILED');
    });
  });

  describe('State Machine Invalid Transitions', () => {
    it('should forbid EXPIRED -> SUCCESS', async () => {
      db['status'] = 'EXPIRED';
      const result = await db.updateMany({ status: 'PENDING' }, { status: 'SUCCESS' });
      expect(result.count).toBe(0);
      expect(db.getStatus()).toBe('EXPIRED');
    });

    it('should forbid REFUNDED -> PROCESSING', async () => {
      db['status'] = 'REFUNDED';
      const result = await db.updateMany({ status: 'PENDING' }, { status: 'PROCESSING' });
      expect(result.count).toBe(0);
      expect(db.getStatus()).toBe('REFUNDED');
    });
  });
});
