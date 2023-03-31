import React, { useState, createContext } from "react";
import { Modal, notification, Table, Spin, Tag } from "antd";
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
  updateIsVisibleFormCategory,
} from "@/redux/category/categorySlice";
import { Category } from "@/models/category";
import styles from "./CategoryTable.module.scss";
import useSWR, { mutate } from "swr";
import { actions, useStoreContext } from "@/store";

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
  });
  return res.data.data.data;
};

const CategoryTable = () => {
  const { data, error } = useSWR("/product-category", fetcher);
  const [state, dispatchs] = useStoreContext();
  const dispatch = useDispatch();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
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
    } else if (!res.data.result) {
      notification.open({
        message: res.data.message,
        icon: <CloseOutlined style={{ color: "red" }} />,
      });
    }
  };
  const columns: ColumnsType<Category> = [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <Tag
          style={
            text === 1 ? { width: 80, height: 25 } : { width: 112, height: 25 }
          }
          color={text === 1 ? "green" : "red"}
          key={text}
        >
          {text === 1 ? "KÍCH HOẠT" : "CHƯA KÍCH HOẠT"}
        </Tag>
      ),
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
    dispatch(updateIsVisibleFormCategory(true));
    dispatch(isEditCategoryForm(true));
    dispatch(setCategoryId(record));
    dispatchs(actions.setIdCategoryForm(record));
    dispatchs(actions.changeVisibleFormCategory(true));
  };
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  type ContextValue = boolean;
  const Context = createContext<ContextValue>(false);
  // if (error) return <div>An error has occured</div>;
  return (
    <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
  );
};

export default CategoryTable;
