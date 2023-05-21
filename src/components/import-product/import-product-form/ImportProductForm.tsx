import {
  Button,
  Col,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  notification,
  Radio,
  Row,
  Select,
  Table,
  Upload,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
const { TextArea } = Input;
import {
  CheckOutlined,
  PlusOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/utils/firebase";
import type { RadioChangeEvent } from "antd";
import useSWR from "swr";
import { Category, ImportProduct } from "@/models";
import Context from "@/store/Context";
import { actions, useStoreContext } from "@/store";
import { v4 } from "uuid";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "./CategoryForm.module.scss";
import { fetcherCategory } from "@/utils/category";
import { ColumnsType } from "antd/es/table";
import { VND } from "@/utils/formatVNĐ";

const fetcher = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(
    "https://tech-api.herokuapp.com/v1/product-category/list",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  res.data.data.data.map((data: any) => {
    data.value = data.id;
    data.label = data.name;
  });
  return res.data.data.data;
};
const fetchers = async (url: string) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};
const schema = yup.object({
  name: yup.string().required("Trường tên là trường bắt buộc"),
});
type FormData = yup.InferType<typeof schema>;

const ImportProductForm = () => {
  const [form] = Form.useForm();
  const { state, dispatch } = useStoreContext();
  // const { data, error, mutate } = useSWR("product-category", fetcherCategory);
  const { data: importId } = useSWR(
    state.idImportProduct
      ? `https://tech-api.herokuapp.com/v1/import/get/${state.idImportProduct}`
      : "",
    fetchers
  );
  const [id, setId] = useState<number>();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  useEffect(() => {
    setId(importId?.id);
    form.setFieldsValue({
      state: importId?.state,
      id: importId?.id,
      date: importId?.date,
      storeName: importId?.storeDto?.name,
    });
  }, [importId]);
  const data = importId?.items;

  const createCategoryForm = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      "https://tech-api.herokuapp.com/v1/product-category/create",
      {
        ...form.getFieldsValue(),
        orderSort: 0,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.result) {
      form.resetFields();
      notification.open({
        message: res.data.message,
        icon: <CheckOutlined style={{ color: "#52c41a" }} />,
      });
      dispatch(actions.changeVisibleFormCategory(false));
      dispatch(actions.changeEditFormCategory(false));
      // mutate();
    } else {
      notification.open({
        message: res.data,
        icon: <WarningOutlined style={{ color: "red" }} />,
      });
    }
  };
  const updateCategory = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.put(
      "https://tech-api.herokuapp.com/v1/product-category/update",
      {
        ...form.getFieldsValue(),
        id: id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.result) {
      form.resetFields();
      notification.open({
        message: res.data.message,
        icon: <CheckOutlined style={{ color: "#52c41a" }} />,
      });
      dispatch(actions.changeVisibleFormCategory(false));
      dispatch(actions.changeEditFormCategory(false));
      // mutate();
    } else {
      notification.open({
        message: res.data,
        icon: <WarningOutlined style={{ color: "red" }} />,
      });
    }
  };

  const handleOk = async () => {
    if (id) {
      updateCategory();
    } else {
      createCategoryForm();
    }
  };
  const cancelCreateCategory = () => {
    form.resetFields();
    dispatch(actions.changeVisibleFormImportProduct(false));
  };
  const columns: ColumnsType<ImportProduct> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "variantDto",
      key: "nameProduct",
      render: (text) => text?.name,
    },
    {
      title: "Cấu hình",
      dataIndex: "variantDto",
      key: "color",
      render: (text) => text?.name,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
  ];
  return (
    <div>
      <Modal
        title={"Cập nhập trạng thái nhập hàng"}
        open={state.isVisibleFormImportProduct}
        onOk={handleOk}
        onCancel={cancelCreateCategory}
        width={800}
        footer={[
          <Button key="back" onClick={cancelCreateCategory}>
            Huỷ
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            {'Cập nhập trạng thái'}
          </Button>,
        ]}
      >
        <Form
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          form={form}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Mã nhập hàng" name="id">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Trạng thái nhập hàng" name="state">
                <Select
                  defaultValue="Chọn trạng thái nhập hàng"
                  options={[
                    { value: 0, label: "Đang chờ" },
                    { value: 1, label: "Đã xác nhận", disabled: true },
                    { value: 2, label: "Đã từ chối", disabled: true },
                    { value: 2, label: "Đã huỷ" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Thời gian" name="date">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Cửa hàng nhập hàng" name="storeName">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Table
                pagination={false}
                columns={columns}
                dataSource={data}
                className="mt-4"
              />
            </Col>
          </Row>
          {/* <Row className="mt-5">
            <Col span={12}></Col>
            <Col span={12}>
              <Form.Item label="Tổng tiền" name="totalMoney">
                <Input style={{ width: 200 }} disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}></Col>
            <Col span={12}>
              <Form.Item label="Phí giao hàng" name="deliveryFee">
                <Input style={{ width: 200 }} disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}></Col>
            <Col span={12}>
              <Form.Item label="Giảm giá" name="saleOff">
                <Input style={{ width: 200 }} disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}></Col>
            <Col span={12}>
              <Form.Item label="Thanh toán" name="paymentMoney">
                <Input style={{ width: 200 }} disabled />
              </Form.Item>
            </Col>
          </Row> */}
        </Form>
      </Modal>
    </div>
  );
};

export default ImportProductForm;
