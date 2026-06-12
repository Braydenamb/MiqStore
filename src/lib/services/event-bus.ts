import { EventEmitter } from "events";
import { logger, metrics, tracing } from "../telemetry";

// Core system event types mapping topic -> payload
export interface EventPayloads {
  "TRANSACTION_COMPLETED": {
    transaction: import("./transaction").TransactionRecord;
  };
  "TRANSACTION_UPDATED": {
    invoiceId: string;
    status: import("./midtrans").MidtransTransactionStatus;
  };
  "USER_REGISTERED": {
    userId: string;
    email: string;
  };
  "RISK_DETECTED": {
    userId: string;
    score: number;
    reasons: string[];
  };
}

export type EventTopic = keyof EventPayloads;

class AppEventBus extends EventEmitter {
  constructor() {
    super();
    // Increase max listeners if we have many decoupled services
    this.setMaxListeners(20);
  }

  /**
   * Publish an event to the bus. Subscribers will process asynchronously.
   */
  public async publish<T extends EventTopic>(topic: T, payload: EventPayloads[T]): Promise<void> {
    const span = tracing.startSpan(`publish_event_${topic}`);
    try {
      // We emit asynchronously to ensure we don't block the caller
      setImmediate(() => {
        logger.debug(`[EventBus] Publishing ${topic}`, { payload });
        this.emit(topic, payload);
        metrics.increment(`event_published_${topic}`);
      });
      span.end("success");
    } catch (err) {
      logger.error(`[EventBus] Failed to publish ${topic}`, err);
      span.end("error");
      throw err;
    }
  }

  /**
   * Subscribe to an event on the bus.
   */
  public subscribe<T extends EventTopic>(
    topic: T,
    handler: (payload: EventPayloads[T]) => Promise<void> | void
  ): void {
    logger.info(`[EventBus] Registered listener for ${topic}`);
    
    this.on(topic, async (payload: EventPayloads[T]) => {
      const span = tracing.startSpan(`handle_event_${topic}`);
      try {
        await handler(payload);
        metrics.increment(`event_handled_${topic}_success`);
        span.end("success");
      } catch (err) {
        logger.error(`[EventBus] Error handling ${topic}`, err);
        metrics.increment(`event_handled_${topic}_error`);
        span.end("error");
      }
    });
  }
}

// Export singleton instance
export const eventBus = new AppEventBus();
