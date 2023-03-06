import React, { useEffect, useState } from "react";
import { Button, Modal, notification, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  CloseOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import CategoryForm from "./CategoryForm";
import { useDispatch } from "react-redux";
import {
  isEditCategoryForm,
  setCategoryId,
  setCategorySelected,
  updateIsVisibleFormCategory,
} from "@/redux/categorySlice";
import { useGetCategorysQuery } from "./category.service";
import { Category } from "@/models/category";

const CategoryTable = () => {
  const { data, isFetching } = useGetCategorysQuery();
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
      // getCategory();
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
    {
      title: "Action",
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
  ];
  // const getCategory = async () => {
  //   const token = localStorage.getItem("token");
  //   const res = await axios.get(
  //     "https://tech-api.herokuapp.com/v1/product-category/list",
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );
  //   setCategory(res.data.data || []);
  // };
  useEffect(() => {
    // getCategory();
  }, []);
  const showModal = () => {
    dispatch(updateIsVisibleFormCategory(true));
  };
  const isEditCategory = async (record: any) => {
    dispatch(updateIsVisibleFormCategory(true));
    dispatch(isEditCategoryForm(true));
    dispatch(setCategoryId(record));
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `https://tech-api.herokuapp.com/v1/product-category/get/${record}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(res.data.data);
    dispatch(setCategorySelected(res.data.data));
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
    <div>
      <>
        <div className="flex justify-end ml-4">
          <Button className="mb-2" onClick={showModal}>
            Tạo mới
          </Button>
          <Button className="">
            <UploadOutlined />
          </Button>
        </div>
        <CategoryForm></CategoryForm>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={!isFetching ? data?.data : []}
        />
      </>
    </div>
  );
};

export default CategoryTable;
