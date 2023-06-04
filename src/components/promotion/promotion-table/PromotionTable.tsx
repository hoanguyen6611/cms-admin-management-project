import React from "react";
import { Modal, notification, Table, Spin, Tag, Image } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Category } from "@/models/category";
import styles from "./CategoryTable.module.scss";
import useSWR from "swr";
import { actions, useStoreContext } from "@/store";
import { VND } from "@/utils/formatVNĐ";

const fetcher = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(
    "https://tech-api.herokuapp.com/v1/promotion/list",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  res.data.data.data.map((data: any) => {
    data.key = data.id;
    data.value = VND.format(data.value);
  });
  return res.data.data.data;
};

const PromotionTable = () => {
  const {
    data: promotion,
    error,
    mutate,
  } = useSWR("/v1/promotion/list", fetcher);
  const { state, dispatch } = useStoreContext();
  const deleteConfirmPromotion = (record: any) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xoá danh mục sản phẩm này không?",
      okText: "OK",
      okType: "danger",
      onOk: () => {
        deletePromotion(record);
      },
      cancelText: "HUỶ"
    });
  };
  const deletePromotion = async (record: any) => {
    const token = localStorage.getItem("token");
    const res = await axios.delete(
      `https://tech-api.herokuapp.com/v1/product-category/delete/${record}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.result) {
      notification.open({
        message: 'Xoá mã giảm giá thành công',
        icon: <CheckOutlined style={{ color: "#52c41a" }} />,
      });
      mutate();
    } else if (!res.data.result) {
      notification.open({
        message: 'Xoá mã giảm giá thất bại',
        icon: <CloseOutlined style={{ color: "red" }} />,
      });
    }
  };
  const columns: ColumnsType<Category> = [
    {
      title: "Tên mã giảm giá",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Chi tiết mã giảm giá",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Giá trị",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      // width:70,
      render: (text) => (
        <Tag
          className="text-center"
          style={{ width: 80, height: 25 }}
          color={text === 1 ? "green" : "red"}
          key={text}
        >
          {text === 1 ? "KÍCH HOẠT" : "KHOÁ"}
        </Tag>
      ),
      filters: [
        {
          text: "KÍCH HOẠT",
          value: 1,
        },
        {
          text: "KHOÁ",
          value: 0,
        },
      ],
      onFilter: (value: any, record: any) => record.status === value,
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
              onClick={() => isEditPromotion(record)}
            />
            {/* <DeleteOutlined
              style={{ color: "red", marginLeft: 12 }}
              onClick={() => {
                deleteConfirmPromotion(record);
              }}
            /> */}
          </>
        );
      },
    },
  ];
  const isEditPromotion = async (record: number) => {
    dispatch(actions.setIdPromotionForm(record));
    dispatch(actions.changeVisibleFormPromotion(true));
    dispatch(actions.changeEditFormPromotion(true));
  };
  if (!promotion)
    return (
      <Spin tip="Loading" size="small">
        <div className="content" />
      </Spin>
    );
  return <Table columns={columns} dataSource={promotion} />;
};

export default PromotionTable;
