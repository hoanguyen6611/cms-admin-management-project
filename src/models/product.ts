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
export interface ProductCreate {
  categoryId: number
  description: string
  image: string
  isSaleOff: boolean
  isSoldOut: boolean
  kind: number
  name: string
  parentProductId: number
  price: number
  productConfigs: ProductConfig[]
  saleOff: number
  status: number
  tags: string
}

export interface ProductConfig {
  choiceKind: number
  isRequired: boolean
  name: string
  status: number
  variants: Variant[]
}

export interface Variant {
  description: string
  image: string
  name: string
  orderSort: number
  price: number
  status: number
}
