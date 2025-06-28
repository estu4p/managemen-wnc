export interface Note {
  id: string;
  incomingOrder: Date;
  estimatedCompletion: Date;
  customer: Customer;
  items: Item[];
  paymentStatus: string;
  notes: string;
  totalPrice: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  totalNotes: number;
  totalItems: number;
}

export interface Item {
  id: string;
  name: string;
  category: string;
  material: string;
  size: string;
  color: string;
  service: string;
  notes: string;
  status: number; // 0 = new, 1 = in progress, 2 = done, 3 = picked up
  images: string[];
  price: number;
}
