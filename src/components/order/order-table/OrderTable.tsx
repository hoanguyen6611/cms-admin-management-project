import React, { useState } from "react";
import { notification, Table, Spin, Tag, Modal, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  CloseOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import useSWR from "swr";
import { Product } from "@/models";
import styles from "./ProductTable.module.scss";
import { actions, useStoreContext } from "@/store";
import { VND } from "@/utils/formatVNĐ";

const fetcher = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get("https://tech-api.herokuapp.com/v1/orders/list", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  res.data.data.data.map((data: any) => {
    data.key = data.id;
    data.totalMoney = VND.format(data.totalMoney);
    data.saleOff = VND.format(data.saleOff);
  });
  return res.data.data.data;
};
const fetchers = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get("https://tech-api.herokuapp.com/v1/store/list", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  res.data.data.data.map((data: any) => {
    data.value = data.id;
    data.label = data.name;
  });
  return res.data.data.data;
};

const OrderTable = () => {
  const { data, error, mutate } = useSWR("/product", fetcher);
  const { data: store, error: errorStore } = useSWR("/store/list", fetchers);
  const { state, dispatch } = useStoreContext();

  const columns: ColumnsType<Product> = [
    {
      title: "Mã đơn hàng",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "createdDate",
      key: "createdDate",
    },

    {
      title: "Khách hàng",
      dataIndex: "customerAddressDto",
      key: "customerName",
      render: (text) => text?.receiverFullName,
    },
    {
      title: "Tổng tiền thanh toán",
      dataIndex: "totalMoney",
      key: "totalMoney",
    },
    {
      title: "Giảm giá",
      dataIndex: "saleOffMoney",
      key: "saleOffMoney",
      render: (text) => VND.format(text),
    },
    {
      title: "Cửa hàng",
      dataIndex: "storeId",
      key: "storeId",
      render: (text) => store?.find((item: any) => item.id === text)?.name,
    },
    {
      title: "Trạng thái đơn hàng",
      dataIndex: "state",
      key: "state",
      render: (text) => (
        <Tag
          className="text-center"
          style={{ width: 100, height: 25 }}
          color={
            text === 0
              ? "yellow"
              : text === 1
              ? "blue"
              : text === 2
              ? "orange"
              : text === 3
              ? "green"
              : text === 4
              ? "red"
              : text === 5
              ? "cyan"
              : ""
          }
          key={text}
        >
          {text === 0
            ? "ĐANG CHỜ"
            : text === 1
            ? "ĐÃ NHẬN ĐƠN"
            : text === 2
            ? "ĐANG VẬN CHUYỂN"
            : text === 3
            ? "HOÀN TẤT"
            : text === 4
            ? "ĐÃ HUỶ"
            : text === 5
            ? "LƯU TRỮ"
            : ""}
        </Tag>
      ),
      filters: [
        {
          text: "ĐANG CHỜ",
          value: 0,
        },
        {
          text: "ĐÃ NHẬN ĐƠN",
          value: 1,
        },
        {
          text: "ĐANG VẬN CHUYỂN",
          value: 2,
        },
        {
          text: "HOÀN TẤT",
          value: 3,
        },
        {
          text: "ĐÃ HUỶ",
          value: 4,
        },
        {
          text: "LƯU TRỮ",
          value: 5,
        },
      ],
      onFilter: (value: any, record: any) => record.state === value,
    },
    {
      title: "",
      dataIndex: "id",
      key: "action",
      render: (record: number) => {
        return (
          <>
            <Tooltip title="Xem chi tiết">
              <EyeOutlined
                style={{ color: "green" }}
                onClick={() => isEditProduct(record)}
              />
            </Tooltip>
          </>
        );
      },
    },
  ];
  const isEditProduct = (record: number) => {
    dispatch(actions.changeVisibleFormOrder(true));
    dispatch(actions.setIdOrderForm(record));
  };
  return <Table columns={columns} dataSource={data} className="mt-4" />;
};

export default OrderTable;
