import React, { useEffect, useState } from "react";
import { Form, Input, Modal, Table, notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  updateIsEdit,
  updateIsVisibleFormPermissionGroup,
} from "@/redux/group-permission/groupPermissionSlice";
import useSWR from "swr";
import { CheckOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { Permission } from "@/models";
import axios from "axios";
import { useStoreContext } from "@/store";
const { TextArea } = Input;

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
  res.data.data.data.map((data: any) => {
    data.key = data.id;
  });
  return res.data.data.data;
};
const fetchers = async (url: string) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};

const ChangePermission = () => {
  const { data, error } = useSWR("/permission", getPermission);
  const [state, dispatchs] = useStoreContext();
  const { data: group } = useSWR(
    `https://tech-api.herokuapp.com/v1/group/get/${state.idGroupPermission}`,
    fetchers
  );
  const [name, setName] = useState<string>("");
  const [des, setDes] = useState<string>("");
  const [id, setId] = useState<number>();
  const dispatch = useDispatch();
  const permissionGroup = useSelector((state: any) => state.permissionGroup);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  useEffect(() => {
    setName(group?.name);
    setDes(group?.description);
    setId(group?.id);
    setSelectedRowKeys(group?.permissions.map((item: any) => item.id));
  }, [group]);

  const createFormPermissionGroup = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.put(
      "https://tech-api.herokuapp.com/v1/group/update",
      {
        description: des,
        id: id,
        name: name,
        permissions: selectedRowKeys,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.result) {
      dispatch(updateIsVisibleFormPermissionGroup(false));
      setValueForm();
      notification.open({
        message: res.data.message,
        icon: <CheckOutlined style={{ color: "#52c41a" }} />,
      });
    }
  };
  const cancelCreatePermissionGroup = () => {
    dispatch(updateIsVisibleFormPermissionGroup(false));
    dispatch(updateIsEdit(false));
    setValueForm();
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
  ];
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const setValueForm = () => {
    setName("");
    setDes("");
    setId(0);
    setSelectedRowKeys([]);
  };
  return (
    <div>
      <Modal
        title={permissionGroup.isEdit ? "Cập nhập quyền" : "Tạo mới quyền"}
        open={permissionGroup.isVisibleChangePermissionGroup}
        okType={"danger"}
        onOk={createFormPermissionGroup}
        onCancel={cancelCreatePermissionGroup}
        width={800}
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
        >
          {/* <Form.Item label="Tên" name="name" initialValue={name}>
            <Input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
            ></Input>
          </Form.Item> */}
          <div className="flex flex-col gap-3 mb-5">
            <label htmlFor="name" className="cursor-pointer">
              Tên
            </label>
            <input
              name="name"
              value={name}
              placeholder="Enter your name"
              id="name"
              className="border p-2 rounded-xl"
              type="text"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
            />
          </div>
          {/* <Form.Item label="Chi tiết" name="description">
            <TextArea rows={4} onChange={(e) => setDes(e.target.value)} />
          </Form.Item> */}
          <div className="flex flex-col gap-3 mb-5">
            <label htmlFor="description" className="cursor-pointer">
              Chi tiết
            </label>
            <input
              name="description"
              value={des}
              placeholder="Enter your description"
              id="description"
              type="text"
              className="border p-2 rounded-xl"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDes(e.target.value)
              }
            />
          </div>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data}
          />
        </Form>
      </Modal>
    </div>
  );
};

export default ChangePermission;
