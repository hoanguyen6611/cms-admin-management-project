export interface Permission {
  id: number;
  status: number;
  modifiedDate: string;
  createdDate: string;
  modifiedBy: string;
  createdBy: string;
  name: string;
  action: string;
  showMenu: boolean;
  description: string;
  nameGroup: string;
}
