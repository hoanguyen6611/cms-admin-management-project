import React, { useState, createContext } from "react";
import { Modal, notification, Table, Spin, Tag, Image } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { Category } from "@/models/category";
import styles from "./CategoryTable.module.scss";
import useSWR, { mutate } from "swr";
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
  const { data: promotion, error } = useSWR("/v1/promotion/list", fetcher);
  const {state, dispatch} = useStoreContext();
  // const dispatch = useDispatch();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const deleteConfirmPromotion = (record: any) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xoá danh mục sản phẩm này không?",
      okText: "OK",
      okType: "danger",
      onOk: () => {
        deletePromotion(record);
      },
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
        message: res.data.message,
        icon: <CheckOutlined style={{ color: "#52c41a" }} />,
      });
    } else if (!res.data.result) {
      notification.open({
        message: res.data.message,
        icon: <CloseOutlined style={{ color: "red" }} />,
      });
    }
  };
  const columns: ColumnsType<Category> = [
    // {
    //   title: "",
    //   dataIndex: "icon",
    //   key: "icon",
    //   width: 50,
    //   render: (text) => <Image width={50} src={text} alt="icon"></Image>,
    // },
    {
      title: "Tên ưu đãi",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Chi tiết ưu đãi",
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
          style={
            text === 1 ? { width: 80, height: 25 } : { width: 50, height: 25 }
          }
          color={text === 1 ? "green" : "red"}
          key={text}
        >
          {text === 1 ? "KÍCH HOẠT" : "KHOÁ"}
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
              onClick={() => isEditPromotion(record)}
            />
            <DeleteOutlined
              style={{ color: "red", marginLeft: 12 }}
              onClick={() => {
                deleteConfirmPromotion(record);
              }}
            />
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
