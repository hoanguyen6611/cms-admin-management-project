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
import { CheckOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/dist/client/router";
import Link from "antd/es/typography/Link";

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

const GroupPermissionTable = () => {
  const router = useRouter();
  const deletePermission = async (record: any) => {
    //   const token = localStorage.getItem("token");
    //   console.log(record);
    //   await axios.delete(
    //     `https://tech-api.herokuapp.com/v1/permission/delete/${record}`,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   );
    // if(res.data.result) {
    // }
  };

  const columns: ColumnsType<Permission> = [
    {
      title: "Mã phân quyền",
      dataIndex: "id",
      key: "id",
      render: (text) => <a>{text}</a>,
    },
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
      title: "Action",
      dataIndex: "id",
      key: "action",
      render: (record) => {
        return (
          <>
            <Link href={`/group-permission/${record}`}>
              <EditOutlined
              />
            </Link>
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
  const [permission, setPermission] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [des, setDes] = useState("");
  const [action, setAction] = useState("");
  const [group, setGroup] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const getPermission = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      "https://tech-api.herokuapp.com/v1/group/list",
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
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      "https://tech-api.herokuapp.com/v1/permission/create",
      {
        action: action,
        description: des,
        name: name,
        nameGroup: group,
        showMenu: showMenu,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.result) {
      setIsModalOpen(false);
      getPermission();
      setName("");
      setDes("");
      setAction("");
      setGroup("");
      setShowMenu(false);
      notification.open({
        message: res.data.message,
        icon: <CheckOutlined style={{ color: "#52c41a" }} />,
      });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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
        Tạo mới phân quyền
      </Button>
      <Modal
        title="Tạo mới"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="flex flex-col gap-2 mb-5">
          <label htmlFor="name">Tên phân quyền</label>
          <input
            type="text"
            id="name"
            placeholder="Vui lòng nhập tên phân quyền"
            className="p-4 rounded-md border border-gray-100"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 mb-5">
          <label htmlFor="description">Thông tin phân quyền</label>
          <input
            type="text"
            id="description"
            placeholder="Vui lòng nhập thông tin phân quyền"
            className="p-4 rounded-md border border-gray-100"
            onChange={(e) => setDes(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 mb-5">
          <label htmlFor="action">Action</label>
          <input
            type="text"
            id="action"
            placeholder="Vui lòng nhập action"
            className="p-4 rounded-md border border-gray-100"
            onChange={(e) => setAction(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 mb-5">
          <label htmlFor="nameGroup">Group</label>
          <input
            type="text"
            id="nameGroup"
            placeholder="Vui lòng nhập group"
            className="p-4 rounded-md border border-gray-100"
            onChange={(e) => setGroup(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 mb-5">
          <label htmlFor="nameGroup">Show menu</label>
          <Switch onChange={(e: boolean) => setShowMenu(e)} />
        </div>
      </Modal>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={permission}
      />
    </div>
  );
};

export default GroupPermissionTable;
