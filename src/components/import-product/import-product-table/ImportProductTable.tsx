import React, { useState, createContext } from "react";
import { Modal, notification, Table, Spin, Tag, Image, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  CloseOutlined,
  EyeOutlined,
  WarningOutlined,
  CloseSquareOutlined,
} from "@ant-design/icons";
import { Category } from "@/models/category";
import styles from "./ImportProductTable.module.scss";
import useSWR from "swr";
import { actions, useStoreContext } from "@/store";

const fetcher = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get("https://tech-api.herokuapp.com/v1/import/list", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  res.data.data.data.map((data: any) => {
    data.key = data.id;
    data.value = data.id;
    data.label = data.name;
  });
  return res.data.data.data;
};

const ImportProductTable = () => {
  const {
    data: importList,
    error,
    mutate,
  } = useSWR("/product-category", fetcher);
  const { state, dispatch } = useStoreContext();
  const cancelImportProductConfirn = (record: any) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn huỷ yêu cầu nhập hàng này không?",
      okText: "OK",
      okType: "danger",
      onOk: () => {
        cancelImportProduct(record);
      },
      cancelText: "HUỶ",
    });
  };
  const cancelImportProduct = async (record: any) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `https://tech-api.herokuapp.com/v1/import/cancel`,
      {
        importId: record,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.result) {
      notification.open({
        message: "Huỷ yêu cầu nhập hàng thành công",
        icon: <CheckOutlined style={{ color: "#52c41a" }} />,
      });
      mutate();
    } else if (!res.data.result) {
      notification.open({
        message: "Huỷ yêu cầu nhập hàng thất bại",
        icon: <CloseOutlined style={{ color: "red" }} />,
      });
    }
  };
  const columns: ColumnsType<Category> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Cửa hàng",
      dataIndex: "storeDto",
      key: "nameStore",
      render: (text) => text?.name,
    },
    {
      title: "Số lượng",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Người tạo yêu cầu",
      dataIndex: "createdBy",
      key: "createdBy",
    },
    {
      title: "Trạng thái",
      dataIndex: "state",
      key: "state",
      // width:70,
      render: (text) => (
        <Tag
          className="text-center"
          style={{ width: 100, height: 25 }}
          color={
            text === 1
              ? "yellow"
              : text === 2
              ? "green"
              : text === 3
              ? "orange"
              : text === 4
              ? "red"
              : ""
          }
          key={text}
        >
          {text === 1
            ? "ĐANG CHỜ"
            : text === 2
            ? "ĐÃ XÁC NHẬN"
            : text === 3
            ? "ĐÃ TỪ CHỐI"
            : text === 4
            ? "ĐÃ HUỶ"
            : ""}
        </Tag>
      ),
      filters: [
        {
          text: "ĐANG CHỜ",
          value: 1,
        },
        {
          text: "ĐÃ XÁC NHẬN",
          value: 2,
        },
        {
          text: "ĐÃ TỪ CHỐI",
          value: 3,
        },
        {
          text: "ĐÃ HUỶ",
          value: 4,
        },
      ],
      onFilter: (value: any, record: any) => record.state === value,
    },
    {
      title: "",
      dataIndex: "id",
      key: "action",
      render: (record) => {
        return (
          <>
            <EyeOutlined
              style={{ color: "green" }}
              onClick={() => isWatchImportProduct(record)}
            />
            <Tooltip title="Huỷ yêu cầu nhập hàng">
              <CloseSquareOutlined
                hidden={
                  importList.find((item: any) => item.id === record).state ===
                    2 ||
                  importList.find((item: any) => item.id === record).state === 4
                }
                style={{ color: "red", marginLeft: 12 }}
                onClick={() => {
                  cancelImportProductConfirn(record);
                }}
              />
            </Tooltip>
          </>
        );
      },
    },
  ];
  const isWatchImportProduct = async (record: number) => {
    console.log(record);
    dispatch(actions.setIdImportProductForm(record));
    dispatch(actions.changeVisibleFormImportProduct(true));
  };
  if (!importList)
    return (
      <Spin tip="Loading" size="small">
        <div className="content" />
      </Spin>
    );
  return <Table columns={columns} dataSource={importList} />;
};

export default ImportProductTable;
