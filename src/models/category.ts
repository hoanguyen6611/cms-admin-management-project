export interface CategoryResponse {
  result: boolean
  data: Category[]
  message: string
}

export interface Category {
  id: number
  name: string
  orderSort?: number
  note: string
  status?: number
  icon?: string
}
