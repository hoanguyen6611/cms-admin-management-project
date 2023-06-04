import {
  Button,
  Col,
  DatePicker,
  DatePickerProps,
  Form,
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
import useSWR, { mutate } from "swr";
import { actions, useStoreContext } from "@/store";
import { RangePickerProps } from "antd/es/date-picker";
import { ColumnsType } from "antd/es/table";
import { OrdersDetailDtoList } from "@/models/order";
import { VND } from "@/utils/formatVNĐ";

const fetcher = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get("https://tech-api.herokuapp.com/v1/store/list", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
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
const stores = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get("https://tech-api.herokuapp.com/v1/store/list", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  res.data.data.data.map((data: any) => {
    data.value = data.id;
    data.label = data.name;
  });
  return res.data.data.data;
};

const OrderForm = () => {
  const [form] = Form.useForm();
  const { state, dispatch } = useStoreContext();
  const { data: order } = useSWR(
    state.idOrder
      ? `https://tech-api.herokuapp.com/v1/orders/get/${state.idOrder}`
      : null,
    fetchers
  );
  const { data: store, error } = useSWR("/store/list", fetcher);
  const data = order?.ordersDetailDtoList;
  useEffect(() => {
    form.setFieldsValue({
      code: order?.code,
      createdDate: order?.createdDate,
      storeId: store?.find((item: any) => item.id === order?.storeId)?.name,
      receiverFullName: order?.customerAddressDto?.receiverFullName,
      ordersDetailDtoList: order?.ordersDetailDtoList,
      state: order?.state,
      totalMoney: VND.format(order?.totalMoney),
      deliveryFee: VND.format(order?.deliveryFee),
      amount: order?.amount,
      saleOff: VND.format(order?.saleOffMoney),
      paymentMoney: VND.format(
        Number(order?.totalMoney) + Number(order?.deliveryFee)
      ),
      paymentMethod: order?.paymentMethod
    });
  }, [order]);

  const cancelOrderForm = () => {
    dispatch(actions.changeVisibleFormOrder(false));
  };

  const onChange = (
    value: DatePickerProps["value"] | RangePickerProps["value"],
    dateString: [string, string] | string
  ) => {
    console.log("Selected Time: ", value);
    console.log("Formatted Selected Time: ", dateString);
  };

  const onOk = (
    value: DatePickerProps["value"] | RangePickerProps["value"]
  ) => {
    console.log("onOk: ", value);
  };
  const columns: ColumnsType<OrdersDetailDtoList> = [
    {
      title: "#",
      dataIndex: "productDto",
      key: "idProduct",
      render: (text) => text?.id,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productDto",
      key: "nameProduct",
      render: (text) => text?.name,
    },
    {
      title: "Số lượng",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (text) => VND.format(text),
    },
    {
      title: "Cấu hình",
      dataIndex: "productVariantDto",
      key: "color",
      render: (text) => text?.name,
    },
    {
      title: "Giảm giá",
      dataIndex: "productDto",
      key: "saleOff",
      render: (text) => text?.saleOff + "%",
    },
    {
      title: "Thành tiền",
      dataIndex: "productDto",
      key: "moneyTotal",
      render: (text) => VND.format(text?.price),
    },
  ];
  return (
    <div>
      <Modal
        title="Xem thông tin đơn hàng"
        open={state.isVisibleFormOrder}
        okType={"danger"}
        onCancel={cancelOrderForm}
        width={1000}
        footer={[
          <Button key="back" onClick={cancelOrderForm}>
            Huỷ
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
              <Form.Item label="Mã đơn hàng" name="code">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Trạng thái đơn hàng" name="state">
                <Select
                  disabled
                  defaultValue="Chọn trạng thái đơn hàng"
                  options={[
                    { value: 0, label: "Đã nhận đơn" }, //hồng
                    { value: 1, label: "Đã xác nhận" }, //vàng
                    { value: 2, label: "Đang vận chuyển" }, //cam
                    { value: 3, label: "Hoàn tất" }, //xanh
                    { value: 4, label: "Đã huỷ" }, //đỏ
                    { value: 5, label: "Lưu trữ" }, //tím
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Thời gian" name="createdDate">
                {/* <DatePicker showTime onChange={onChange} onOk={onOk} /> */}
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Hình thức thanh toán" name="paymentMethod">
                <Select
                  disabled
                  defaultValue="Chọn hình thức"
                  options={[
                    { value: 1, label: "Giao hàng thu tiền" },
                    { value: 2, label: "Thanh toán online" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row></Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Cửa hàng giao dịch" name="storeId">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Khách hàng" name="receiverFullName">
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
          <Row className="mt-5">
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
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default OrderForm;
