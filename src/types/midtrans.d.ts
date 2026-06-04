interface SnapOptions {
  onSuccess?: (result: any) => void;
  onPending?: (result: any) => void;
  onError?: (result: any) => void;
  onClose?: () => void;
}

interface Window {
  snap: {
    pay: (token: string, options?: SnapOptions) => void;
  };
}
