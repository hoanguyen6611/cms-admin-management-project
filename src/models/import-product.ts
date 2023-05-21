export interface ImportProduct {
    id: number
    createdBy: string
    date: string
    storeDto: StoreDto
    total: number
    state: number
  }
  
  export interface StoreDto {
    id: number
    name: string
    latitude: number
    longitude: number
    addressDetails: string
    phone: string
    shopId: number
    provinceCode: number
    districtCode: number
    wardCode: string
    status: number
  }