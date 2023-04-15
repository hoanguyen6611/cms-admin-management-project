import React from "react";
import { Button } from "antd";
import ChangePermission from "./change-permission/ChangePermission";
import GroupPermissionTable from "./group-permission-table/GroupPermissionTable";
import { useDispatch } from "react-redux";
import { updateIsVisibleFormPermissionGroup } from "@/redux/group-permission/groupPermissionSlice";
import { PlusOutlined } from "@ant-design/icons";

const GroupPermissionShow = () => {
  const dispatch = useDispatch();
  const showModal = () => {
    dispatch(updateIsVisibleFormPermissionGroup(true));
  };
  return (
    <div>
      <div className="flex justify-end ml-4">
        <Button className="mb-2" onClick={showModal}>
          <PlusOutlined />
          Tạo mới
        </Button>
      </div>
      <ChangePermission></ChangePermission>
      <GroupPermissionTable></GroupPermissionTable>
    </div>
  );
};

export default GroupPermissionShow;
