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
  isEditFormCategory: boolean;
  isEditFormProduct: boolean;
  isEditFormPromotion: boolean;
  isEditFormAccount: boolean;
  isEditFormCustomer: boolean;
  isEditFormStore: boolean;
  idCategory: number;
  idProduct: number;
  idOrder: number;
  idCustomer: number;
  idAccount: number;
  idPromotion: number;
  idStore: number;
  idGroupPermission: number;
  variant: {};
  category: Category[];
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
    isEditFormCategory: false,
    isEditFormProduct: false,
    isEditFormPromotion: false,
    isEditFormAccount: false,
    isEditFormCustomer: false,
    isEditFormStore: false,
    idCategory: 0,
    idProduct: 0,
    idOrder: 0,
    idCustomer: 0,
    idAccount: 0,
    idPromotion: 0,
    idStore: 0,
    idGroupPermission: 0,
    variant: {},
    category: [],
  };