import React from "react";
import { Button } from "antd";
import ChangePermission from "./change-permission/ChangePermission";
import GroupPermissionTable from "./group-permission-table/GroupPermissionTable";
import { useDispatch } from "react-redux";
import { updateIsVisibleFormPermissionGroup } from "@/redux/group-permission/groupPermissionSlice";
import { PlusOutlined } from "@ant-design/icons";

const GroupPermissionShow = () => {
  const dispatch = useDispatch();
  return (
    <div>
      <ChangePermission></ChangePermission>
      <GroupPermissionTable></GroupPermissionTable>
    </div>
  );
};

export default GroupPermissionShow;
