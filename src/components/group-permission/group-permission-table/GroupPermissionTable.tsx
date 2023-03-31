import axios from "axios";
import React, { useState } from "react";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Permission } from "@/models/permission";
import styles from "./GroupPermissionTable.module.scss";
import { useDispatch } from "react-redux";
import {
  setIdSelected,
  updateIsEdit,
  updateIsVisibleFormPermissionGroup,
} from "@/redux/group-permission/groupPermissionSlice";
import useSWR from "swr";
import { actions, useStoreContext } from "@/store";

const fetcher = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get("https://tech-api.herokuapp.com/v1/group/list", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  res.data.data.data.map((data: any) => {
    data.key = data.id;
  });
  return res.data.data.data;
};

const GroupPermissionTable = () => {
  const { data, error } = useSWR("/group-permission", fetcher);
  const [state, dispatchs] = useStoreContext();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const dispatch = useDispatch();
  const deletePermission = async (record: any) => {
    //   const token = localStorage.getItem("token");
    //   console.log(record);
    //   await axios.delete(
    //     `https://tech-api.herokuapp.com/v1/permission/delete/${record}`,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   );
    // if(res.data.result) {
    // }
  };

  const columns: ColumnsType<Permission> = [
    {
      title: "Tên phân quyền",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Thông tin phân quyền",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <Tag
          style={text === 1 ?{ width: 80, height: 30 }:{ width: 120, height: 30 } }
          color={text === 1 ? "green" : "red"}
          key={text}
        >
          {text === 1 ? "KÍCH HOẠT" : "CHƯA KÍCH HOẠT"}
        </Tag>
      ),
    },
    {
      title: "",
      dataIndex: "id",
      key: "action",
      render: (record) => {
        return (
          <>
            <EditOutlined
              style={{ color: "green" }}
              onClick={() => isChangePermissionGroup(record)}
            />
            <DeleteOutlined
              style={{ color: "red", marginLeft: 12 }}
              onClick={() => {
                deletePermission(record);
              }}
            />
          </>
        );
      },
    },
  ];
  const isChangePermissionGroup = (record: number) => {
    dispatch(updateIsVisibleFormPermissionGroup(true));
    dispatch(updateIsEdit(true));
    dispatch(setIdSelected(record));
    dispatchs(actions.setIdGroupPermissionForm(record));
  };
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  if (error) return <div>An error has occured</div>;
  if (!data) return <div>Loading</div>;
  return (
    <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
  );
};

export default GroupPermissionTable;
