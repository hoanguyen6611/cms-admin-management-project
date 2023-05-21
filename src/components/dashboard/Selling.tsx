import { useStoreContext } from "@/store";
import { VND } from "@/utils/formatVNĐ";
import { Select, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import axios from "axios";
import React, { useState } from "react";
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
const fetchers = async (url: string) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  res.data.data.data.map((data: any) => {
    data.key = data.id;
    data.value = data.id;
    data.label = data.name;
    data.revenue = VND.format(data.revenue);
  });
  return res.data.data.data;
};
const Selling = () => {
  const { state, dispatch } = useStoreContext();
  const { data, error, mutate } = useSWR(
    state.fromDate && state.toDate
      ? `https://tech-api.herokuapp.com/v1/product/list-revenue?from=${state.fromDate}&to=${state.toDate}`
      : "https://tech-api.herokuapp.com/v1/product/list-revenue",
    fetchers
  );
  const { data: revenueStore } = useSWR(
    state.fromDate && state.toDate
      ? `https://tech-api.herokuapp.com/v1/store/list-revenue?from=${state.fromDate}&to=${state.toDate}`
      : "https://tech-api.herokuapp.com/v1/store/list-revenue",
    fetchers
  );
  const [show, setShow] = useState<string>("1");
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
  const columnsRevenueStore: ColumnsType<any> = [
    {
      title: "Tên cửa hàng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số lượng đơn hàng",
      dataIndex: "orders",
      key: "orders",
    },
    {
      title: "Tổng doanh thu",
      dataIndex: "revenue",
      key: "revenue",
    },
  ];
  const handleChange = (value: string) => {
    setShow(value);
  };
  return (
    <div>
      <div className="p-3">
        <Select
          defaultValue="Thống kê sản phẩm"
          style={{ width: 300 }}
          onChange={handleChange}
          options={[
            { value: "1", label: "Thống kế sản phẩm" },
            { value: "2", label: "Thống kế doanh thu các chi nhánh" },
          ]}
        />
      </div>
      {show === "1" ? (
        <div className="w-full col-span-1 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg overflow-scroll">
          <h1 className="font-bold text-center text-2xl p-2">
            Thống kê sản phẩm
          </h1>
          <Table columns={columns} dataSource={data} pagination={false} />
        </div>
      ) : (
        <div className="w-full col-span-1 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg overflow-scroll">
          <h1 className="font-bold text-center text-2xl p-2">
            Thống kê bán hàng các chi nhánh
          </h1>
          <Table
            columns={columnsRevenueStore}
            dataSource={revenueStore}
            pagination={false}
          />
        </div>
      )}
    </div>
  );
};

export default Selling;
