import React, { useEffect, useState } from "react";
import { notification, Table, Spin, Tag, Modal, Image } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  isEditProductForm,
  updateVisibleFormProduct,
} from "@/redux/product/productSlice";
import { useDispatch } from "react-redux";
import useSWR from "swr";
import { Product } from "@/models";
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
    data.price = VND.format(data.price);
  });
  return res.data.data.data;
};

const ProductTable = () => {
  const { data, error } = useSWR("/product", fetcher);
  const [state, dispatchs] = useStoreContext();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const dispatch = useDispatch();
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
    } else if (!res.data.result) {
      notification.open({
        message: res.data.message,
        icon: <CloseOutlined style={{ color: "red" }} />,
      });
    }
  };

  const columns: ColumnsType<Product> = [
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
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
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
    dispatch(updateVisibleFormProduct(true));
    dispatch(isEditProductForm(true));
    dispatchs(actions.setIdProductForm(record));
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
