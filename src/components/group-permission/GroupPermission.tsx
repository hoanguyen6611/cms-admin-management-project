import React from "react";
import { Button } from "antd";
import ChangePermission from "./change-permission/ChangePermission";
import GroupPermissionTable from "./group-permission-table/GroupPermissionTable";
import { useDispatch } from "react-redux";
import { updateIsVisibleFormPermissionGroup } from "@/redux/group-permission/groupPermissionSlice";

const GroupPermissionShow = () => {
  const dispatch = useDispatch();
  const showModal = () => {
    dispatch(updateIsVisibleFormPermissionGroup(true));
  };
  return (
    <div>
      <Button className="mb-2" onClick={showModal}>
        Tạo mới phân quyền
      </Button>
      <ChangePermission></ChangePermission>
      <GroupPermissionTable></GroupPermissionTable>
    </div>
  );
};

export default GroupPermissionShow;
