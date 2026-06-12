interface SnapResult {
  order_id: string;
  transaction_id?: string;
  gross_amount?: string;
  payment_type?: string;
  transaction_status?: string;
  status_code?: string;
  status_message?: string;
  fraud_status?: string;
}

interface SnapOptions {
  onSuccess?: (result: SnapResult) => void;
  onPending?: (result: SnapResult) => void;
  onError?: (result: SnapResult) => void;
  onClose?: () => void;
  skipOrderSummary?: boolean;
  selectedPaymentType?: string;
}

interface SnapInstance {
  pay: (token: string, options?: SnapOptions) => void;
  show: (token: string, options?: SnapOptions) => void;
}

interface Window {
  snap?: SnapInstance;
}
