import { eventBus } from "./event-bus";
import { awardTransactionXP } from "./gamification";
// import { distributeAffiliateCommission } from "./affiliate";
// import { distributeCashback } from "./wallet";
import { logger } from "../telemetry";

let isSubscribed = false;

/**
 * Bootstraps the Event Subscribers. 
 * This wires up the decoupled microservice domains.
 */
export function registerSystemSubscribers() {
  if (isSubscribed) return;
  isSubscribed = true;

  logger.info("[Subscribers] Bootstrapping background workers...");

  // 1. Transaction Completed -> Execute multiple background domains
  eventBus.subscribe("TRANSACTION_COMPLETED", async ({ transaction }) => {
    logger.debug(`[Worker] Processing TRANSACTION_COMPLETED for ${transaction.invoiceId}`);
    
    // Fire off independent tasks in parallel
    await Promise.allSettled([
      // distributeCashback(transaction).catch(err => 
      //   logger.error(`[Worker] Cashback failed for ${transaction.invoiceId}`, err)
      // ),
      
      awardTransactionXP(transaction.userId, transaction.total).catch(err => 
        logger.error(`[Worker] XP awarding failed for ${transaction.invoiceId}`, err)
      ),
      
      // distributeAffiliateCommission(transaction).catch(err => 
      //   logger.error(`[Worker] Affiliate payout failed for ${transaction.invoiceId}`, err)
      // )
    ]);
    
    logger.info(`[Worker] Finished background jobs for ${transaction.invoiceId}`);
  });
}
