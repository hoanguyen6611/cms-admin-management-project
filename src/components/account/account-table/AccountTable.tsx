import React, { useState, createContext } from "react";
import { Modal, notification, Table, Spin, Tag, Image, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  CloseOutlined,
  EyeOutlined,
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
    "https://tech-api.herokuapp.com/v1/account/list?kind=1",
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

const AccountTable = () => {
  const { data, error } = useSWR("/product-category", fetcher);
  const [state, dispatchs] = useStoreContext();
  const dispatch = useDispatch();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const deleteConfirmAccount = (record: any) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xoá tài khoản này không?",
      okText: "OK",
      okType: "danger",
      onOk: () => {
        deleteAccount(record);
      },
    });
  };
  const deleteAccount = async (record: any) => {
    const token = localStorage.getItem("token");
    const res = await axios.delete(
      `https://tech-api.herokuapp.com/v1/account/delete/${record}`,
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
    // {
    //   title: "",
    //   dataIndex: "icon",
    //   key: "icon",
    //   width: 50,
    //   render: (text) => <Image width={50} src={text} alt="icon"></Image>,
    // },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "username",
      key: "username",
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
              onClick={() => isEditAccount(record)}
            />
            <DeleteOutlined
              style={{ color: "red", marginLeft: 12 }}
              onClick={() => {
                deleteConfirmAccount(record);
              }}
            />
          </>
        );
      },
    },
  ];
  const isEditAccount = async (record: number) => {
    dispatchs(actions.setIdAccountForm(record));
    dispatchs(actions.changeVisibleFormAccount(true));
  };
  if (!data)
    return (
      <Spin tip="Loading" size="small">
        <div className="content" />
      </Spin>
    );
  return <Table columns={columns} dataSource={data} />;
};

export default AccountTable;
