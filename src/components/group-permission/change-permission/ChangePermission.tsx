import React, { useEffect, useState } from "react";
import { Form, Input, Modal, notification, Tree } from "antd";
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
import type { TreeProps } from "antd/es/tree";

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
  var items: any;
  res.data.data.data.map((data: any) => {
    data.key = data.key;
    data.title = data.nameGroup;
    data.children = [
      {
        title: data.name + " ( " + data.action + " )",
        key: data.id,
      },
    ];
  });
  // for (var i = 0; i < res.data.data.data.length; i++) {
  //   if (items.indexOf(res.data.data.data[i]) === -1) {
  //     items.push(res.data.data.data[i])
  //   }
  // }
  const ids = res.data.data.data.map((o: any) => o.nameGroup);
  const filtered = res.data.data.data.filter(
    (nameGroup: any, index: any) => !ids.includes(nameGroup, index + 1)
  );
  return filtered;
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
const getPermissionByAdmin = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(
    "https://tech-api.herokuapp.com/v1/group/list?kind=1",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  res.data.data.data.map((data: any) => {
    data.key = data.id;
  });
  return res.data.data[0].permissions;
};

const ChangePermission = () => {
  const [form] = Form.useForm();
  const { data, error } = useSWR("/permission", getPermission);
  console.log(data);
  const { data: groupAdmin } = useSWR(
    "https://tech-api.herokuapp.com/v1/group/list?kind=1",
    fetchers
  );
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
  const [checkedKeys, setCheckedKeys] = useState<any>();
  useEffect(() => {
    setName(group?.name);
    setDes(group?.description);
    setId(group?.id);
    setSelectedRowKeys(group?.permissions.map((item: any) => item.id));
    form.setFieldsValue({
      name: group?.name,
      description: group?.description,
      status: group?.status,
    });
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

  const setValueForm = () => {
    setName("");
    setDes("");
    setId(0);
    setSelectedRowKeys([]);
  };

  const onSelect: TreeProps["onSelect"] = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info);
  };

  const onCheck: TreeProps["onCheck"] = (checkedKeys, info) => {
    console.log("onCheck", checkedKeys, info);
    setCheckedKeys(checkedKeys);
  };
  // const onCheck = (checkedKeysValue: React.Key[]) => {
  //   console.log('onCheck', checkedKeysValue);
  //   setCheckedKeys(checkedKeysValue);
  // };
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
          form={form}
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
          <Tree
            checkable
            onSelect={onSelect}
            onCheck={onCheck}
            treeData={data}
          />
        </Form>
      </Modal>
    </div>
  );
};

export default ChangePermission;
