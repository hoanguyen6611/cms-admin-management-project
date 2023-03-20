export interface Product {
  id?: number;
  status: number;
  modifiedDate?: string;
  createdDate?: string;
  modifiedBy?: string;
  createdBy?: string;
  description: string;
  name: string;
  price: number;
  isSoldOut: boolean;
  isSaleOff: boolean;
}



