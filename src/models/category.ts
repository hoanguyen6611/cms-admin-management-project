export interface CategoryResponse {
  result: boolean
  data: Category[]
  message: string
}

export interface Category {
  id?: number
  name: string
  orderSort?: number
  note: string
  status?: number
  icon?: string
}
export interface Variant  {
  description:string,
  image:string,
  name:string,
  orderSort: number,
  price: number,
  status: number,
};
