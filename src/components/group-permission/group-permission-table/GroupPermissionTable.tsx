import axios from "axios";
import React, { useState } from "react";
import { Modal, Spin, Table, Tag, notification } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Permission } from "@/models/permission";
import styles from "./GroupPermissionTable.module.scss";
import useSWR from "swr";
import { actions, useStoreContext } from "@/store";

const fetcher = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get("https://tech-api.herokuapp.com/v1/group/list", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  res.data.data.data.map((data: any) => {
    data.key = data.id;
  });
  return res.data.data.data;
};

const GroupPermissionTable = () => {
  const { data, error } = useSWR("/group-permission", fetcher);
  const { state, dispatch } = useStoreContext();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const deleteConfirmGroup = (record: number) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xoá group này không?",
      okText: "OK",
      okType: "danger",
      onOk: () => {
        deleteGroup(record);
      },
    });
  };
  const deleteGroup = async (record: number) => {
    const token = localStorage.getItem("token");
    const res = await axios.delete(
      `https://tech-api.herokuapp.com/v1/group/delete/${record}`,
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

  const columns: ColumnsType<Permission> = [
    {
      title: "Tên phân quyền",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Thông tin phân quyền",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
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
              onClick={() => isChangePermissionGroup(record)}
            />
          </>
        );
      },
    },
  ];
  const isChangePermissionGroup = (record: number) => {
    dispatch(actions.setIdGroupPermissionForm(record));
    dispatch(actions.changeVisibleFormGroupPermission(true));
  };
  if (!data)
    return (
      <Spin tip="Loading" size="small">
        <div className="content" />
      </Spin>
    );
  return <Table columns={columns} dataSource={data} />;
};

export default GroupPermissionTable;
