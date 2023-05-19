import { VND } from "@/utils/formatVNĐ";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import axios from "axios";
import React from "react";
import useSWR from "swr";

const fetcher = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(
    "https://tech-api.herokuapp.com/v1/product/list-revenue",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  res.data.data.data.map((data: any) => {
    data.key = data.id;
    data.value = data.id;
    data.label = data.name;
    data.revenue = VND.format(data.revenue);
  });
  return res.data.data.data;
};
const Selling = () => {
  const { data, error, mutate } = useSWR("/list-revenue", fetcher);
  const columns: ColumnsType<any> = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số lượng",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Tổng doanh thu",
      dataIndex: "revenue",
      key: "revenue",
    },
  ];
  return (
    <div className="w-full col-span-1 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg overflow-scroll">
      <h1 className="font-bold text-center text-2xl p-2">Thống kê sản phẩm</h1>
      <Table columns={columns} dataSource={data} pagination={false} />
      {/* <ul>
        {data
          ? data.map((item: any) => {
              <li
                key={item.id}
                className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 flex items-center cursor-pointer"
              >
                <div className="bg-purple-100 rounded-lg p-3"></div>
                <div className="pl-4">
                  <p className="text-gray-800 font-bold">{item.name}</p>
                  <p className="text-gray-400 text-sm">{item.amount}</p>
                </div>
                <div className="lg:flex md:hidden absolute right-6 text-sm">
                  {item.revenue}
                </div>
              </li>;
            })
          : "Hello"}
      </ul> */}
    </div>
  );
};

export default Selling;
