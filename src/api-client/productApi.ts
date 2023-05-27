import axiosClient from "./axiosClient";

export const productApi = {
  async getAllProduct() {
    const data = await axiosClient.get("product/list");
    console.log(data.data.data);
    return { data: data.data.data };
  },
};
