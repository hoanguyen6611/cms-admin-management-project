import axiosClient from "./axiosClient";

export const authApi = {
  async login(payload: any) {
    const data: any = await axiosClient.post<any>("account/login", payload);
    if (data && data.data && "token" in data.data) {
      localStorage.setItem("token", data.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: data.data.username,
          fullName: data.data.fullName,
          id: data.data.id,
          customerId: data.data.customerId,
          kind: data.data.kind,
        })
      );
      return { result: data.result, message: data.message };
    } else {
      return { result: data.result, message: data.message };
    }
  },
};

