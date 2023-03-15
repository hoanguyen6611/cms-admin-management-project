import React, { useEffect, useState } from "react";
import { Modal, notification, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import {
  isEditCategoryForm,
  setCategoryId,
  setCategorySelectedBy,
  updateIsVisibleFormCategory,
} from "@/redux/categorySlice";
import { Category } from "@/models/category";
import styles from "./CategoryTable.module.scss";

const CategoryTable = () => {
  const dispatch = useDispatch();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [category, setCategory] = useState([]);
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
      getCategory();
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
  const columns: ColumnsType<Category> = [
    {
      title: "",
      dataIndex: "id",
      key: "action",
      render: (record) => {
        return (
          <>
            <EditOutlined onClick={() => isEditCategory(record)} />
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
    {
      title: "Mã danh mục",
      dataIndex: "id",
      key: "id",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
    },
  ];
  const getCategory = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      "https://tech-api.herokuapp.com/v1/product-category/list",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    res.data.data.map((data: any) => {
      data.key = data.id;
    });
    setCategory(res.data.data || []);
  };
  useEffect(() => {
    getCategory();
  }, []);
  const isEditCategory = async (record: number) => {
    dispatch(updateIsVisibleFormCategory(true));
    dispatch(isEditCategoryForm(true));
    dispatch(setCategoryId(record));
    // const token = localStorage.getItem("token");
    // const res = await axios.get(
    //   `https://tech-api.herokuapp.com/v1/product-category/get/${record}`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }
    // );
    // dispatch(setCategorySelectedBy(res.data.data));
  };
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <Table
      rowSelection={rowSelection}
      columns={columns}
      // dataSource={!isFetching ? data?.data : []}
      dataSource={category}
    />
  );
};

export default CategoryTable;
