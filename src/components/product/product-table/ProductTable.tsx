import React from "react";
import { notification, Table, Spin, Tag, Modal, Image } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import useSWR from "swr";
import styles from "./ProductTable.module.scss";
import { actions, useStoreContext } from "@/store";
import { VND } from "@/utils/formatVNĐ";

const fetcher = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(
    "https://tech-api.herokuapp.com/v1/product/list",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  res.data.data.data.map((data: any) => {
    data.key = data.id;
    data.price = data.price;
  });
  return res.data.data.data;
};

const ProductTable = () => {
  const { data, error, mutate } = useSWR("/product", fetcher);
  const { state, dispatch } = useStoreContext();
  const deleteConfirmProduct = (record: any) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xoá sản phẩm này không?",
      okText: "OK",
      okType: "danger",
      onOk: () => {
        deleteProduct(record);
      },
    });
  };
  const deleteProduct = async (record: any) => {
    const token = localStorage.getItem("token");
    const res = await axios.delete(
      `https://tech-api.herokuapp.com/v1/product/delete/${record}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.result) {
      notification.open({
        message: res.data.message,
        icon: <CheckOutlined style={{ color: "#52c41a" }} />,
      });
      mutate();
    } else if (!res.data.result) {
      notification.open({
        message: res.data.message,
        icon: <CloseOutlined style={{ color: "red" }} />,
      });
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: "",
      dataIndex: "image",
      key: "image",
      render: (text) => <Image width={50} src={text} alt="image"></Image>,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      filters: [],
      filterSearch: true,
      onFilter: (value: any, record: any) => record.name.includes(value),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (text) => VND.format(text),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <Tag
          style={
            text === 1 ? { width: 80, height: 25 } : { width: 50, height: 25 }
          }
          color={text === 1 ? "green" : "red"}
          key={text}
        >
          {text === 1 ? "KÍCH HOẠT" : "KHOÁ"}
        </Tag>
      ),
      filters: [
        {
          text: "KÍCH HOẠT",
          value: 1,
        },
        {
          text: "KHOÁ",
          value: 0,
        },
      ],
      onFilter: (value: any, record: any) => record.status === value,
    },
    {
      title: "Số lượng",
      dataIndex: "quanlity",
      key: "quanlity",
    },
    {
      title: "",
      dataIndex: "id",
      key: "action",
      render: (record: number) => {
        return (
          <>
            <EditOutlined
              style={{ color: "green" }}
              onClick={() => isEditProduct(record)}
            />
            <DeleteOutlined
              style={{ color: "red", marginLeft: 12 }}
              onClick={() => {
                deleteConfirmProduct(record);
              }}
            />
          </>
        );
      },
    },
  ];
  const isEditProduct = (record: number) => {
    dispatch(actions.setIdProductForm(record));
    dispatch(actions.changeVisibleFormProduct(true));
    dispatch(actions.changeEditFormProduct(true));
  };

  if (!data)
    return (
      <Spin tip="Loading" size="small">
        <div className="content" />
      </Spin>
    );
  return <Table columns={columns} dataSource={data} className="mt-4" />;
};

export default ProductTable;
