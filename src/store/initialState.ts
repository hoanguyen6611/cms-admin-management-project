import { Category } from "@/models";

export interface StateGlobal {
  isVisibleFormCategory: boolean;
  isVisibleFormOrder: boolean;
  isVisibleFormProduct: boolean;
  isVisibleFormCustomer: boolean;
  isVisibleFormAccount: boolean;
  isVisibleFormPromotion: boolean;
  isVisibleFormStore: boolean;
  isVisibleFormGroupPermission: boolean;
  isVisibleFormImportProduct: boolean;
  isEditFormCategory: boolean;
  isEditFormProduct: boolean;
  isEditFormPromotion: boolean;
  isEditFormAccount: boolean;
  isEditFormCustomer: boolean;
  isEditFormStore: boolean;
  idCategory?: number;
  idProduct?: number;
  idOrder?: number;
  idCustomer?: number;
  idAccount?: number;
  idPromotion?: number;
  idStore?: number;
  idGroupPermission?: number;
  idImportProduct?: number;
  variant: {};
  category: Category[];
  fromDate?:any;
  toDate?:any;
}
export const initialState: StateGlobal = {
    isVisibleFormCategory: false,
    isVisibleFormOrder: false,
    isVisibleFormProduct: false,
    isVisibleFormCustomer: false,
    isVisibleFormAccount: false,
    isVisibleFormPromotion: false,
    isVisibleFormStore: false,
    isVisibleFormGroupPermission: false,
    isVisibleFormImportProduct: false,
    isEditFormCategory: false,
    isEditFormProduct: false,
    isEditFormPromotion: false,
    isEditFormAccount: false,
    isEditFormCustomer: false,
    isEditFormStore: false,
    variant: {},
    category: [],
  };