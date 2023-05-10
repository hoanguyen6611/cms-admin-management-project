import React from "react";
import ChangePermission from "./change-permission/ChangePermission";
import GroupPermissionTable from "./group-permission-table/GroupPermissionTable";

const GroupPermissionShow = () => {
  return (
    <div>
      <ChangePermission></ChangePermission>
      <GroupPermissionTable></GroupPermissionTable>
    </div>
  );
};

export default GroupPermissionShow;
