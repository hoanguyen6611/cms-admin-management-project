import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, notification, Tree } from "antd";
import useSWR from "swr";
import { CheckOutlined } from "@ant-design/icons";
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
const ChangePermission = () => {
  const [form] = Form.useForm();
  const { data: permissions, error } = useSWR("/permission", getPermission);
  const [name, setName] = useState<string>("");
  const [des, setDes] = useState<string>("");
  const [id, setId] = useState<number>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<any>([]);
  const { state, dispatch } = useStoreContext();

  const { data: group } = useSWR(
    `https://tech-api.herokuapp.com/v1/group/get/${state.idGroupPermission}`,
    fetchers
  );
  useEffect(() => {
    setId(group?.id);
    setCheckedKeys(group?.permissions.map((item: any) => item.id));
    console.log(checkedKeys);
    form.setFieldsValue({
      name: group?.name,
      description: group?.description,
      status: group?.status,
    });
  }, [group]);
  const permissionList = group?.permissions.map((item: any) => item.id);
  console.log(permissionList);
  console.log(checkedKeys);

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
    const token = localStorage.getItem("token");
    const res = await axios.put(
      "https://tech-api.herokuapp.com/v1/group/update",
      {
        description: des,
        id: id,
        name: name,
        permissions: checkedKeys.filter(checkNumber),
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
  const cancelCreatePermissionGroup = () => {
    dispatch(actions.changeVisibleFormGroupPermission(false));
    form.resetFields();
  };

  const onSelect: TreeProps["onSelect"] = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info);
  };

  const onCheck: TreeProps["onCheck"] = (checkedKeys, info) => {
    console.log("onCheck", checkedKeys);
    setCheckedKeys(checkedKeys);
  };
  const list = [
    286, 4, 31, 38, 42, 26, 27, 28, 29, 30, 32, 142, 143, 33, 34, 35, 36, 37,
    144, 145, 146, 246, 249, 251, 147, 148, 149, 150, 151, 152, 159, 160, 161,
    162, 163, 164, 165, 166, 167, 168, 169, 224, 170, 171, 172, 173, 153, 155,
    158, 156, 157, 154, 198, 199, 200, 179, 176, 177, 178, 250, 223, 240, 242,
    245, 1, 2, 3, 45, 226, 295, 308,
  ];
  return (
    <div>
      <Modal
        title={"Cập nhập phân quyền"}
        open={state.isVisibleFormGroupPermission}
        onOk={handleOk}
        onCancel={cancelCreatePermissionGroup}
        width={800}
        footer={[
          <Button key="back" onClick={cancelCreatePermissionGroup}>
            Huỷ
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            {"Cập nhập"}
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
            ></Input>
          </Form.Item>
          <Form.Item label="Chi tiết" name="description">
            <TextArea rows={4} onChange={(e) => setDes(e.target.value)} />
          </Form.Item>
          <Form.Item name="permissions">
            <Tree
              checkable
              onSelect={onSelect}
              onCheck={onCheck}
              treeData={permissions}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ChangePermission;
