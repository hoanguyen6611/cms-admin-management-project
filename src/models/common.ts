export interface ListResponse<T> {
  data: T[];
  page: number;
  totalPage: number;
  totalElements: number;
}
export interface ListParams {
  page: number;
  totalPage: number;
  totalElements: number;
  [key: string]: any;
}
