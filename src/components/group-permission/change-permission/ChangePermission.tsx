import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, notification, Tree } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  updateIsEdit,
  updateIsVisibleFormPermissionGroup,
} from "@/redux/group-permission/groupPermissionSlice";
import useSWR from "swr";
import { CheckOutlined } from "@ant-design/icons";
import axios from "axios";
import { useStoreContext } from "@/store";
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
  const dispatch = useDispatch();
  const permissionGroup = useSelector((state: any) => state.permissionGroup);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<any>([]);
  const [state, dispatchs] = useStoreContext();

  const { data: group } = useSWR(
    `https://tech-api.herokuapp.com/v1/group/get/${state.idGroupPermission}`,
    fetchers
  );
  console.log(group?.permissions.map((item: any) => item.id));
  useEffect(() => {
    setId(group?.id);
    setCheckedKeys(group?.permissions);
    form.setFieldsValue({
      name: group?.name,
      description: group?.description,
      status: group?.status,
    });
  }, [group]);
  console.log(checkedKeys);

  const checkNumber = (a: any) => {
    return typeof a === "number";
  };

  const handleOk = () => {
    if (id) {
      updatePermissionGroup();
    } else {
      createPermissionGroup();
    }
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
      dispatch(updateIsVisibleFormPermissionGroup(false));
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
      dispatch(updateIsVisibleFormPermissionGroup(false));
      notification.open({
        message: res.data.message,
        icon: <CheckOutlined style={{ color: "#52c41a" }} />,
      });
    }
  };
  const cancelCreatePermissionGroup = () => {
    dispatch(updateIsVisibleFormPermissionGroup(false));
    dispatch(updateIsEdit(false));
    form.resetFields();
  };

  const onSelect: TreeProps["onSelect"] = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info);
  };

  const onCheck: TreeProps["onCheck"] = (checkedKeys, info) => {
    console.log("onCheck", checkedKeys);
    setCheckedKeys(checkedKeys); //set những permission đã chọn
  };
  return (
    <div>
      <Modal
        title={permissionGroup.isEdit ? "Cập nhập quyền" : "Tạo mới quyền"}
        open={permissionGroup.isVisibleChangePermissionGroup}
        onOk={handleOk}
        onCancel={cancelCreatePermissionGroup}
        width={800}
        footer={[
          <Button key="back" onClick={cancelCreatePermissionGroup}>
            Huỷ
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            {permissionGroup.isEdit ? "Cập nhập" : "Thêm mới"}
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
