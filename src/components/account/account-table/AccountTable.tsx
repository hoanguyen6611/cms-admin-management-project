import React, { useState, createContext } from "react";
import { Modal, notification, Table, Spin, Tag, Image, Tooltip } from "antd";
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
import { Account } from "@/models/account";

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
  const { data, error, mutate } = useSWR("/product-category", fetcher);
  const { state, dispatch } = useStoreContext();
  // const dispatch = useDispatch();
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
  const columns: ColumnsType<Account> = [
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
          className="text-center"
          style={{ width: 80, height: 25 }}
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
    dispatch(actions.setIdAccountForm(record));
    dispatch(actions.changeVisibleFormAccount(true));
    dispatch(actions.changeEditFormAccount(true));
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
