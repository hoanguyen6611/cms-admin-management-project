import { Modal, notification, Switch, Button } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { CheckOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { updateIsVisibleFormPermission } from "@/redux/permissionSlice";
import styles from './PermissionForm.module.scss';

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
          <Switch
            style={{ width: 50 }}
            onChange={(e: boolean) => setShowMenu(e)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default PermissionForm;
