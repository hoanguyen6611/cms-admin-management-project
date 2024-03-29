import { useStoreContext } from "@/store";
import { VND } from "@/utils/formatVNĐ";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import axios from "axios";
import React from "react";
import useSWR from "swr";

const fetcher = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(
    "https://tech-api.herokuapp.com/v1/orders/revenue?from=210&to=1",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data.data;
};
const fetchers = async (url: string) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};
const fetcherCustomer = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(
    "https://tech-api.herokuapp.com/v1/customer/list",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  res.data.data.data.map((data: any) => {
    data.key = data.id;
  });
  return res.data.data.data;
};

const Statistical = () => {
  // const { data: orders, error, mutate } = useSWR("/product-category", fetcher);
  const {
    data: customer,
    error,
    mutate,
  } = useSWR("/customer", fetcherCustomer);
  const { state, dispatch } = useStoreContext();
  const { data: orders } = useSWR(
    state.fromDate && state.toDate
      ? `https://tech-api.herokuapp.com/v1/orders/revenue?from=${state.fromDate}&to=${state.toDate}`
      : "https://tech-api.herokuapp.com/v1/orders/revenue",
    fetchers
  );
  return (
    <div className="grid lg:grid-cols-5 gap-4 p-4">
      <div className="lg:col-span-2 col-span-1 bg-white flex justify-between w-full border p-4 rounded-lg">
        <div className="flex flex-col w-full pb-4">
          <p className="text-2xl font-bold">
            {orders?.revenue ? VND.format(orders.revenue) : VND.format(0)}
          </p>
          <p className="text-gray-600">Tổng doanh thu</p>
        </div>
        {/* <p className=" bg-green-200 flex justify-center items-center p-2 rounded-lg">
          <div className="text-red-700 text-lg flex">
            <ArrowUpOutlined />
            <ArrowDownOutlined />
            <span>18%</span>
          </div>
        </p> */}
      </div>
      <div className="lg:col-span-2 col-span-1 bg-white flex justify-between w-full border p-4 rounded-lg">
        <div className="flex flex-col w-full pb-4">
          <p className="text-2xl font-bold">
            {orders?.discount ? VND.format(orders.discount) : VND.format(0)}
          </p>
          <p className="text-gray-600">Tổng chiết khấu</p>
        </div>
        {/* <p className=" bg-green-200 flex justify-center items-center p-2 rounded-lg">
          <div className="text-green-700 text-lg flex">
            <ArrowUpOutlined />
            <ArrowDownOutlined />
            <span>12%</span>
          </div>
        </p> */}
      </div>
      <div className="lg:col-span-2 col-span-1 bg-white flex justify-between w-full border p-4 rounded-lg">
        <div className="flex flex-col w-full pb-4">
          <p className="text-2xl font-bold">
            {orders?.totalOrders ? orders.totalOrders : 0}
          </p>
          <p className="text-gray-600">Tổng đơn hàng</p>
        </div>
        {/* <p className=" bg-green-200 flex justify-center items-center p-2 rounded-lg">
          <span className="text-green-700 text-lg">+18%</span>
        </p> */}
      </div>
      <div className="lg:col-span-2 col-span-1 bg-white flex justify-between w-full border p-4 rounded-lg">
        <div className="flex flex-col w-full pb-4">
          <p className="text-2xl font-bold">
            {customer ? customer.length : 0}
          </p>
          <p className="Otext-gray-600">Số lượng khách hàng</p>
        </div>
        {/* <p className=" bg-green-200 flex justify-center items-center p-2 rounded-lg">
          <span className="text-green-700 text-lg">+18%</span>
        </p> */}
      </div>
    </div>
  );
};

export default Statistical;
