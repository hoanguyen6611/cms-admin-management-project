import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, notification, Tree } from "antd";
import useSWR from "swr";
import { CheckOutlined, WarningOutlined } from "@ant-design/icons";
import axios from "axios";
import { actions, useStoreContext } from "@/store";
const { TextArea } = Input;
import type { DataNode, TreeProps } from "antd/es/tree";

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
  const groups: any = {};
  const permissions: DataNode[] = [];
  for (let i = 0; i < res.data.data.data.length; i++) {
    const nameGroup = res.data.data.data[i].nameGroup;
    if (groups[nameGroup]) {
      groups[nameGroup].push(res.data.data.data[i]);
    } else {
      groups[nameGroup] = [res.data.data.data[i]];
    }
  }
  for (const group in groups) {
    permissions.push({
      title: group,
      key: group,
      children: groups[group].map((item: any) => {
        return {
          ...item,
          title: item.name + " ( " + item.action + " )",
          key: item.id,
        };
      }),
    });
  }
  return permissions;
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
const fetcherId = async (url: string) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data?.permissions.map((item: any) => item.id);
};
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
const ChangePermission = () => {
  const [form] = Form.useForm();
  const { data: permissions, error } = useSWR("/permission", getPermission);
  const [name, setName] = useState<string>("");
  const [des, setDes] = useState<string>("");
  const [id, setId] = useState<number>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<any>([]);
  const [selectedKeys, setSelectedKeys] = useState<any>();
  const [defaultCheckedKeys, setDefaultCheckedKeys] = useState<any>();
  const { state, dispatch } = useStoreContext();
  const { data, mutate } = useSWR("/group-permission", fetcher);

  const { data: group } = useSWR(
    state.idGroupPermission
      ? `https://tech-api.herokuapp.com/v1/group/get/${state.idGroupPermission}`
      : null,
    fetchers
  );
  const { data: groupId } = useSWR(
    state.idGroupPermission
      ? `https://tech-api.herokuapp.com/v1/group/get/${state.idGroupPermission}`
      : null,
    fetcherId
  );
  useEffect(() => {
    setId(group?.id);
    setCheckedKeys(group?.permissions.map((item: any) => item.id));
    setDefaultCheckedKeys(group?.permissions.map((item: any) => item.id));
    form.setFieldsValue({
      name: group?.name,
      description: group?.description,
      status: group?.status,
      permissions: group?.permissions.map((item: any) => item.id),
    });
  }, [group]);
  const permissionList = group?.permissions.map((item: any) => item.id);

  const checkNumber = (a: any) => {
    return typeof a === "number";
  };

  const handleOk = () => {
    updatePermissionGroup();
  };

  const createPermissionGroup = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      "https://tech-api.herokuapp.com/v1/group/create",
      {
        ...form.getFieldsValue(),
        permissions: checkedKeys.filter(checkNumber),
        kind: 0,
      },
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
    }
  };

  const updatePermissionGroup = async () => {
    const value = {
      ...form.getFieldsValue(),
      id: id,
      permissions: checkedKeys.filter(checkNumber),
    };
    console.log(value);
    const token = localStorage.getItem("token");
    const res = await axios.put(
      "https://tech-api.herokuapp.com/v1/group/update",
      value,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.result) {
      dispatch(actions.changeVisibleFormGroupPermission(false));
      notification.open({
        message: "Cập nhật quyền thành công",
        icon: <CheckOutlined style={{ color: "#52c41a" }} />,
      });
      mutate();
    } else {
      notification.open({
        message: "Cập nhật quyền thất bại",
        icon: <WarningOutlined style={{ color: "red" }} />,
      });
    }
  };
  const cancelCreatePermissionGroup = () => {
    dispatch(actions.changeVisibleFormGroupPermission(false));
    form.resetFields();
  };

  const onSelect: TreeProps["onSelect"] = (selectedKeys, info) => {
    setSelectedKeys(selectedKeys);
  };

  const onCheck: TreeProps["onCheck"] = (checkedKeys, info) => {
    console.log("onCheck", checkedKeys);
    setCheckedKeys(checkedKeys);
  };
  return (
    <div>
      <Modal
        title={"Cập nhật phân quyền"}
        open={state.isVisibleFormGroupPermission}
        onOk={handleOk}
        onCancel={cancelCreatePermissionGroup}
        width={800}
        footer={[
          <Button key="back" onClick={cancelCreatePermissionGroup}>
            Huỷ
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            {"Cập nhật"}
          </Button>,
        ]}
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          form={form}
          name="basic"
        >
          <Form.Item label="Tên" name="name" initialValue={name}>
            <Input
              disabled
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
            ></Input>
          </Form.Item>
          <Form.Item label="Chi tiết" name="description">
            <TextArea
              disabled
              rows={4}
              onChange={(e) => setDes(e.target.value)}
            />
          </Form.Item>
          <Form.Item name="permissions">
            <Tree
              checkedKeys={group?.permissions.map((item: any) => item.id)}
              checkable
              onSelect={onSelect}
              selectedKeys={selectedKeys}
              onCheck={onCheck}
              treeData={permissions}
              // defaultCheckedKeys={defaultCheckedKeys}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ChangePermission;
