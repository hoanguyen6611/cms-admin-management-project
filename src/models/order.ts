export interface Order {
    id: number
    createdDate: string
    amount: number
    saleOff: number
    totalMoney: number
    state: number
    code: string
    paymentMethod: number
    deliveryFee: number
    storeId: number
    expectedReceiveDate: string
    saleOffMoney: number
    customerAddressDto: CustomerAddressDto
    ordersDetailDtoList: OrdersDetailDtoList[]
  }
  
  export interface CustomerAddressDto {
    id: number
    status: number
    modifiedDate: string
    createdDate: string
    modifiedBy: string
    createdBy: string
    addressDetails: string
    receiverFullName: string
    phone: string
    isDefault: boolean
    typeAddress: number
  }
  
  export interface OrdersDetailDtoList {
    id: number
    productDto: ProductDto
    productVariantDto: ProductVariantDto
    price: number
    amount: number
    isReviewed: boolean
  }
  
  export interface ProductDto {
    id: number
    saleOff: number
    isSaleOff: boolean
    isLike: boolean
    productCategoryId: number
    totalReview: number
    name: string
    price: number
    image: string
    isSoldOut: boolean
    avgStar: number
    soldAmount: number
  }
  
  export interface ProductVariantDto {
    id: number
    name: string
    price: number
  }
  