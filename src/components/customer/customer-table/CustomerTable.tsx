import React, { useState, createContext } from "react";
import {
  Modal,
  notification,
  Table,
  Spin,
  Tag,
  Image,
  Avatar,
  Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  CloseOutlined,
  UserOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Category } from "@/models/category";
import styles from "./CategoryTable.module.scss";
import useSWR from "swr";
import { actions, useStoreContext } from "@/store";
import { Customer } from "@/models/customer";

const fetcher = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(
    "https://tech-api.herokuapp.com/v1/customer/list?groupId=7",
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

const CustomerTable = () => {
  const { data, error, mutate } = useSWR("/customer", fetcher);
  const { state, dispatch } = useStoreContext();
  const deleteConfirmCustomer = (record: any) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xoá khách hàng này không?",
      okText: "OK",
      okType: "danger",
      onOk: () => {
        deleteCustomer(record);
      },
      cancelText: "HUỶ"
    });
  };
  const deleteCustomer = async (record: any) => {
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
        message: "Xoá tài khoản thành công",
        icon: <CheckOutlined style={{ color: "#52c41a" }} />,
      });
      mutate();
    } else if (!res.data.result) {
      notification.open({
        message: "Xoá tài khoản thất bại",
        icon: <CloseOutlined style={{ color: "red" }} />,
      });
    }
  };
  const columns: ColumnsType<Customer> = [
    {
      title: "",
      dataIndex: "icon",
      key: "icon",
      width: 50,
      render: (text) =>
        text ? (
          <Image width={50} src={text} alt="icon"></Image>
        ) : (
          <Avatar className="mr-2" size={40} icon={<UserOutlined />} />
        ),
    },
    {
      title: "Họ và tên",
      dataIndex: "account",
      key: "account",
      render: (text) => text?.fullName,
    },
    {
      title: "Email",
      dataIndex: "account",
      key: "account",
      render: (text) => text?.email,
    },
    {
      title: "Trạng thái",
      dataIndex: "account",
      key: "status",
      // width:70,
      render: (text) => (
        <Tag
          className="text-center"
          style={{ width: 80, height: 25 }}
          color={text?.status === 1 ? "green" : "red"}
          key={text?.status}
        >
          {text?.status === 1 ? "KÍCH HOẠT" : "KHOÁ"}
        </Tag>
      ),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (text) => (text === 1 ? "Nam" : "" && text === 2 ? "Nữ" : ""),
      filters: [
        {
          text: "Nam",
          value: "male",
        },
        {
          text: "Nữ",
          value: "female",
        },
      ],
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
              onClick={() => isEditCustomer(record)}
            />
            <DeleteOutlined
              style={{ color: "red", marginLeft: 12 }}
              onClick={() => {
                deleteConfirmCustomer(record);
              }}
            />
          </>
        );
      },
    },
  ];
  const isEditCustomer = async (record: number) => {
    dispatch(actions.setIdCustomerForm(record));
    dispatch(actions.changeVisibleFormCustomer(true));
    dispatch(actions.changeEditFormCustomer(true));
  };
  if (!data)
    return (
      <Spin tip="Loading" size="small">
        <div className="content" />
      </Spin>
    );
  return <Table columns={columns} dataSource={data} />;
};

export default CustomerTable;
