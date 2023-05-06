import {
  Button,
  Col,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  Modal,
  Radio,
  RadioChangeEvent,
  Row,
  Select,
  notification,
} from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import useSWR from "swr";
import { actions, useStoreContext } from "@/store";
import { RangePickerProps } from "antd/es/date-picker";
import { CheckOutlined, WarningOutlined } from "@ant-design/icons";

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

const CustomerForm = () => {
  const [form] = Form.useForm();
  const {state, dispatch} = useStoreContext();
  const [id, setId] = useState();
  const [birthday, setBirthday] = useState<string>("");
  const { data: customer } = useSWR(
    `https://tech-api.herokuapp.com/v1/customer/get/${state.idCustomer}`,
    fetchers
  );
  const { data: store, error } = useSWR("/store/list", fetcher);
  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];
  useEffect(() => {
    setId(customer?.id);
    form.setFieldsValue({
      username: customer?.account ? customer?.account.username : "",
      fullName: customer?.account ? customer?.account.fullName : "",
      email: customer?.account ? customer?.account.email : "",
      createdDate: customer?.account ? customer?.account.createdDate : "",
      phone: customer?.account ? customer?.account.phone : "",
      status: customer?.account ? customer?.account.status : "",
      birthday: customer?.account ? customer?.account.birthday : "",
      gender:
        customer?.gender === 1
          ? "Nam"
          : "" && customer?.gender === 2
          ? "Nữ"
          : "",
    });
  }, [customer]);

  const cancelOrderForm = () => {
    dispatch(actions.changeVisibleFormCustomer(false));
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
  const createCustomer = async () => {
    // console.log({ ...form.getFieldsValue(), password: "123456897" });
    const customer = {
      ...form.getFieldsValue(),
      avatar:
        "https://img6.thuthuatphanmem.vn/uploads/2022/11/18/anh-avatar-don-gian-ma-dep_081757969.jpg",
      birthday,
    };
    delete customer.createdDate;
    const token = localStorage.getItem("token");
    const res = await axios.post(
      "https://tech-api.herokuapp.com/v1/customer/create",
      customer,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.result) {
      dispatch(actions.changeVisibleFormCustomer(false));
      form.resetFields();
      notification.open({
        message: res.data.message,
        icon: <CheckOutlined style={{ color: "#52c41a" }} />,
      });
    } else {
      notification.open({
        message: res.data,
        icon: <WarningOutlined style={{ color: "red" }} />,
      });
    }
  };
  const updateCustomer = async () => {
    const customer = {
      ...form.getFieldsValue(),
      password: "123456897",
      avatar:
        "https://img6.thuthuatphanmem.vn/uploads/2022/11/18/anh-avatar-don-gian-ma-dep_081757969.jpg",
      birthday,
      id,
    };
    delete customer.createdDate;
    console.log(customer);
    // const token = localStorage.getItem("token");
    // const res = await axios.put(
    //   "https://tech-api.herokuapp.com/v1/customer/update",
    //   customer,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }
    // );
    // if (res.data.result) {
    //   dispatchs(actions.changeVisibleFormCustomer(true));
    //   form.resetFields();
    //   notification.open({
    //     message: res.data.message,
    //     icon: <CheckOutlined style={{ color: "#52c41a" }} />,
    //   });
    // } else {
    //   notification.open({
    //     message: res.data,
    //     icon: <WarningOutlined style={{ color: "red" }} />,
    //   });
    // }
  };
  const handleOk = async () => {
    if (id) {
      updateCustomer();
    } else {
      createCustomer();
    }
  };
  const onChangeBirthday: DatePickerProps["onChange"] = (date, dateString) => {
    setBirthday(dateString);
  };
  return (
    <div>
      <Modal
        title={
          state.isEditFormCustomer
            ? "Cập nhập thông tin khách hàng"
            : "Thêm mới khách hàng"
        }
        open={state.isVisibleFormCustomer}
        okType={"danger"}
        onCancel={cancelOrderForm}
        width={1000}
        footer={[
          <Button key="back" onClick={cancelOrderForm}>
            Huỷ
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            {id ? "Cập nhập" : "Thêm mới"}
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
              <Form.Item label="Họ và tên" name="fullName">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Email" name="email">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row hidden={!id} gutter={16}>
            <Col span={12}>
              <Form.Item label="Ngày gia nhập" name="createdDate">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Trạng thái" name="status">
                <Radio.Group onChange={(e: RadioChangeEvent) => {}}>
                  <Radio value={0}>Khoá</Radio>
                  <Radio value={1}>Mở</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Số điện thoại" name="phone">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Giới tính" name="gender">
                <Select
                  defaultValue="Chọn giới tính"
                  options={[
                    { value: "1", label: "Nam" },
                    { value: "2", label: "Nữ" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Ngày sinh" name="birthday">
                <DatePicker
                  format={dateFormatList}
                  onChange={onChangeBirthday}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerForm;
