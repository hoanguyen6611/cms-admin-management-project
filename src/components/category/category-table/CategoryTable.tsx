import React, { useState, createContext } from "react";
import { Modal, notification, Table, Spin, Tag, Image } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Category } from "@/models/category";
import styles from "./CategoryTable.module.scss";
import useSWR from "swr";
import { actions, useStoreContext } from "@/store";
import { fetcherCategory } from "@/utils/category";

const fetcher = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(
    "https://tech-api.herokuapp.com/v1/product-category/list",
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
  });
  return res.data.data.data;
};

const CategoryTable = () => {
  const { data, error, mutate } = useSWR("/product-category", fetcherCategory);
  const { state, dispatch } = useStoreContext();
  const deleteConfirmCategory = (record: any) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xoá danh mục sản phẩm này không?",
      okText: "OK",
      okType: "danger",
      onOk: () => {
        deleteCategory(record);
      },
    });
  };
  const deleteCategory = async (record: any) => {
    const token = localStorage.getItem("token");
    const res = await axios.delete(
      `https://tech-api.herokuapp.com/v1/product-category/delete/${record}`,
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
  const columns: ColumnsType<Category> = [
    {
      title: "",
      dataIndex: "icon",
      key: "icon",
      width: 50,
      render: (text) => <Image width={50} src={text} alt="icon"></Image>,
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      // width:70,
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
      title: "",
      dataIndex: "id",
      key: "action",
      render: (record) => {
        return (
          <>
            <EditOutlined
              style={{ color: "green" }}
              onClick={() => isEditCategory(record)}
            />
            <DeleteOutlined
              style={{ color: "red", marginLeft: 12 }}
              onClick={() => {
                deleteConfirmCategory(record);
              }}
            />
          </>
        );
      },
    },
  ];
  const isEditCategory = async (record: number) => {
    dispatch(actions.setIdCategoryForm(record));
    dispatch(actions.changeVisibleFormCategory(true));
    dispatch(actions.changeEditFormCategory(true));
  };
  if (!data)
    return (
      <Spin tip="Loading" size="small">
        <div className="content" />
      </Spin>
    );
  return <Table columns={columns} dataSource={data} />;
};

export default CategoryTable;
