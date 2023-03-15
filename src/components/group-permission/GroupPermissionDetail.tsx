import React, { useEffect, useState } from "react";
import { Button, Tree } from "antd";
import type { TreeProps } from "antd/es/tree";
import axios from "axios";
import { TreeNode } from "antd/es/tree-select";

const GroupPermissionDetaill = (id: any) => {
  const [permission, setPermission] = useState([]);
  const [permissionSuccess, setPermissionSuccess] = useState([]);
  const onSelect: TreeProps["onSelect"] = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info);
  };

  const onCheck: TreeProps["onCheck"] = (checkedKeys, info) => {
    console.log("onCheck", checkedKeys, info);
  };
  const getPermission = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `https://tech-api.herokuapp.com/v1/permission/list`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    res.data.data.data.map((data: any) => {
      data.title = data.name;
    });
    setPermission(res.data.data.data || []);
  };
  const getPermissionByID = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `https://tech-api.herokuapp.com/v1/group/get/${String(id.id)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(res.data.data.permission);
  };
  useEffect(() => {
    getPermission();
  }, []);
  return (
    <>
      {permission.length ? (
        <Tree
          checkable
          onSelect={onSelect}
          onCheck={onCheck}
          treeData={permission}
        />
      ) : (
        "loading tree"
      )}
    </>
  );
};

export default GroupPermissionDetaill;
