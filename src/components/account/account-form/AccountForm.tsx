import {
  Button,
  Col,
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
const group = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get("https://tech-api.herokuapp.com/v1/group/list", {
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
const AccountForm = () => {
  const [id, setId] = useState();
  const [form] = Form.useForm();
  const [state, dispatchs] = useStoreContext();
  const { data: account } = useSWR(
    `https://tech-api.herokuapp.com/v1/account/get/${state.idAccount}`,
    fetchers
  );
  const { data: groups, error: errorGroup } = useSWR(
    "/group-permission",
    group
  );

  const { data: store, error } = useSWR("/store/list", fetcher);
  useEffect(() => {
    setId(account?.id);
    form.setFieldsValue({
      username: account?.username,
      fullName: account?.fullName,
      email: account?.email,
      phone: account?.phone,
      status: account?.status,
      groupId: account?.group?.id,
    });
  }, [account]);

  const cancelOrderForm = () => {
    dispatchs(actions.changeVisibleFormAccount(false));
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
  const handleOk = () => {
    if (id) {
      updateAccount();
    } else {
      createAccount();
    }
  };
  const createAccount = async () => {
    const account = {
      ...form.getFieldsValue(),
      avatarPath:
        "https://img6.thuthuatphanmem.vn/uploads/2022/11/18/anh-avatar-don-gian-ma-dep_081757969.jpg",
    };
    const token = localStorage.getItem("token");
    const res = await axios.post(
      "https://tech-api.herokuapp.com/v1/account/create_admin",
      account,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.result) {
      dispatchs(actions.changeVisibleFormAccount(false));
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
  const updateAccount = async () => {
    const account = {
      ...form.getFieldsValue(),
      avatarPath:
        "https://img6.thuthuatphanmem.vn/uploads/2022/11/18/anh-avatar-don-gian-ma-dep_081757969.jpg",
      id,
    };
    delete account?.username;
    delete account?.groupId;
    const token = localStorage.getItem("token");
    const res = await axios.put(
      "https://tech-api.herokuapp.com/v1/account/update_admin",
      account,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.result) {
      dispatchs(actions.changeVisibleFormAccount(false));
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
  return (
    <div>
      <Modal
        title="Xem thông tin tài khoản"
        open={state.isVisibleFormAccount}
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
              <Form.Item label="Tên đăng nhập" name="username">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Mật khẩu" name="password">
                <Input.Password placeholder="Vui lòng nhập mật khẩu" />
              </Form.Item>
            </Col>
          </Row>
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
              <Form.Item label="Nhóm phân quyền" name="groupId">
                <Select
                  defaultValue="Chọn nhóm phân quyền"
                  style={{ width: 300 }}
                  options={groups}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default AccountForm;