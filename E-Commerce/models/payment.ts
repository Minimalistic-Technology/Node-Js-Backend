export interface PaymentMethod {
  id: string;
  type: 'CreditDebitCard' | 'PayPal' | 'ApplePay' | 'GooglePay' | 'BankTransfer' | 'CashOnDelivery';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
  processingFee?: number;
}

export interface Order {
  id: string;
  items: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethodId: string;
}