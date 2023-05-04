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
    "https://tech-api.herokuapp.com/v1/store/auto-complete",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  res.data.data.map((data: any) => {
    data.key = data.id;
  });
  return res.data.data;
};

const StoreTable = () => {
  const { data: store, error } = useSWR("/store", fetcher);
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
      title: "Tên cửa hàng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Địa chỉ cửa hàng",
      dataIndex: "addressDetails",
      key: "addressDetails",
    },
    // {
    //   title: "Trạng thái",
    //   dataIndex: "status",
    //   key: "status",
    //   // width:70,
    //   render: (text) => (
    //     <Tag
    //       style={
    //         text === 1 ? { width: 80, height: 25 } : { width: 50, height: 25 }
    //       }
    //       color={text === 1 ? "green" : "red"}
    //       key={text}
    //     >
    //       {text === 1 ? "KÍCH HOẠT" : "KHOÁ"}
    //     </Tag>
    //   ),
    // },
    {
      title: "",
      dataIndex: "id",
      key: "action",
      render: (record) => {
        return (
          <>
            <EditOutlined
              style={{ color: "green" }}
              onClick={() => isEditStore(record)}
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
  const isEditStore = async (record: number) => {
    dispatchs(actions.setIdStoreForm(record));
    dispatchs(actions.changeVisibleFormStore(true));
    dispatch(actions.changeEditFormStore(true));
  };
  if (!store)
    return (
      <Spin tip="Loading" size="small">
        <div className="content" />
      </Spin>
    );
  return <Table columns={columns} dataSource={store} />;
};

export default StoreTable;
