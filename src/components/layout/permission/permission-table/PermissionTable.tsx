import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  notification,
  Radio,
  Space,
  Switch,
  Table,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  CheckOutlined,
  EditOutlined,
  DeleteOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { updateIsVisibleFormPermission } from "@/redux/permissionSlice";
import PermissionForm from "../permission-form/PermissionForm";
import styles from "./PermissionTable.module.scss";

interface Permission {
  id: number;
  status: number;
  modifiedDate: string;
  createdDate: string;
  modifiedBy: string;
  createdBy: string;
  name: string;
  action: string;
  showMenu: boolean;
  description: string;
  nameGroup: string;
}

const PermissionTable = () => {
  const dispatch = useDispatch();
  const [permission, setPermission] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const deletePermission = async (record: any) => {
    const token = localStorage.getItem("token");
    const res = await axios.delete(
      `https://tech-api.herokuapp.com/v1/permission/delete/${record}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(res);
    if (res.data.result) {
      getPermission();
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
      title: "Mã quyền",
      dataIndex: "id",
      key: "id",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Tên quyền",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
    {
      title: "Thông tin quyền",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "action",
      render: (record) => {
        return (
          <>
            <EditOutlined />
            <DeleteOutlined
              style={{ color: "red", marginLeft: 12 }}
              onClick={() => {
                deletePermission(record);
              }}
            />
          </>
        );
      },
    },
  ];
  const getPermission = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      "https://tech-api.herokuapp.com/v1/permission/list",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setPermission(res.data.data.data || []);
  };
  useEffect(() => {
    getPermission();
  }, []);

  const showModal = () => {
    dispatch(updateIsVisibleFormPermission(true));
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
      <Button className="mb-2" onClick={showModal}>
        Tạo mới quyền
      </Button>
      <PermissionForm></PermissionForm>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={permission}
      />
    </div>
  );
};

export default PermissionTable;
