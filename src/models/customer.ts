export interface Customer {
    id: number
    account: Account
    gender: number
  }
  
  export interface Account {
    id: number
    status: number
    createdDate: string
    modifiedBy: string
    createdBy: string
    kind: number
    username: string
    email: string
    fullName: string
    group: Group
    lastLogin: string
  }
  
  export interface Group {
    id: number
    name: string
    description: string
    kind: number
    permissions: Permission[]
  }
  
  export interface Permission {
    id: number
    name: string
    action: string
    showMenu: boolean
    description: string
    nameGroup: string
    status: number
  }