import { Modal, notification, Switch, Button, Form, Input } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { CheckOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { updateIsVisibleFormPermission } from "@/redux/permission/permissionSlice";
import styles from "./PermissionForm.module.scss";

const PermissionForm = (isModalOpen: any) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const permission = useSelector((state: any) => state.permission);
  const [des, setDes] = useState("");
  const [action, setAction] = useState("");
  const [group, setGroup] = useState("");
  const [showMenu, setShowMenu] = useState(false);
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
      dispatch(updateIsVisibleFormPermission(false));
      // getPermission();
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
    dispatch(updateIsVisibleFormPermission(false));
  };
  return (
    <div>
      <Modal
        title="Tạo mới"
        open={permission.isVisibleFormPermission}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}
        okType={"danger"}
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
        >
          <Form.Item label="Tên vai trò" name="name">
            <Input
              placeholder="Vui lòng nhập tên vai trò"
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Thông tin vai trò" name="description">
            <Input
              placeholder="Vui lòng nhập thông tin phân quyền"
              onChange={(e) => setDes(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Action" name="action">
            <Input
              placeholder="Vui lòng nhập action"
              onChange={(e) => setAction(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Group" name="nameGroup">
            <Input
              placeholder="Vui lòng nhập group"
              onChange={(e) => setGroup(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Show Menu" name="showMenu">
            <Switch
              style={{ width: 50 }}
              checked={false}
              onChange={(e: boolean) => setShowMenu(e)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PermissionForm;
