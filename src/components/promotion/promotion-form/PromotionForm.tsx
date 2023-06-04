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
  Switch,
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
import useSWR from "swr";
import { actions, useStoreContext } from "@/store";
import { v4 } from "uuid";
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
const fetcherList = async () => {
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

const PromotionForm = () => {
  const [form] = Form.useForm();
  const { state, dispatch } = useStoreContext();
  const { data, error } = useSWR("product-category/list", fetcher);
  const {
    data: promotionList,
    mutate,
  } = useSWR("/v1/promotion/list", fetcherList);
  const { data: promotion } = useSWR(
    state.idPromotion
      ? `https://tech-api.herokuapp.com/v1/promotion/get/${state.idPromotion}`
      : null,
    fetchers
  );
  const [id, setId] = useState<number>();
  const [icon, setIcon] = useState("");
  const [iconUpload, setIconUpload] = useState<File>();
  const [exchangeable, setExchangeable] = useState<boolean>(false);
  const [kind, setKind] = useState(0);
  const [statusButton, setStatusButton] = useState<boolean>(false);

  useEffect(() => {
    setId(promotion?.id);
    form.setFieldsValue({
      title: promotion?.title,
      description: promotion?.description,
      value: promotion?.value,
      status: promotion?.status,
    });
  }, [promotion]);

  const createPromotion = async () => {
    const promotion = { ...form.getFieldsValue() };
    if (exchangeable) {
      delete promotion?.loyaltyLevel;
    } else {
      delete promotion?.point;
    }
    setStatusButton(true);
    const token = localStorage.getItem("token");
    const res = await axios.post(
      "https://tech-api.herokuapp.com/v1/promotion/create",
      promotion,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.result) {
      dispatch(actions.changeVisibleFormPromotion(false));
      dispatch(actions.changeEditFormPromotion(false));
      form.resetFields();
      setStatusButton(false);
      notification.open({
        message: 'Tạo mã giảm giá thành công',
        icon: <CheckOutlined style={{ color: "#52c41a" }} />,
      });
      mutate();
    } else {
      notification.open({
        message: 'Tạo mã giảm giá thất bại',
        icon: <WarningOutlined style={{ color: "red" }} />,
      });
    }
  };
  const updatePromotion = async () => {
    setStatusButton(true);
    const token = localStorage.getItem("token");
    const res = await axios.put(
      "https://tech-api.herokuapp.com/v1/product-category/update",
      {
        ...form.getFieldsValue(),
        id: id,
        icon: icon,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.result) {
      dispatch(actions.changeVisibleFormPromotion(false));
      dispatch(actions.changeEditFormPromotion(false));
      form.resetFields();
      setStatusButton(false);
      notification.open({
        message: 'Cập nhật thông tin giảm giá thành công',
        icon: <CheckOutlined style={{ color: "#52c41a" }} />,
      });
      mutate();
    } else {
      notification.open({
        message: 'Cập nhật thông tin giảm giá thất bại',
        icon: <WarningOutlined style={{ color: "red" }} />,
      });
    }
  };

  const handleOk = async () => {
    // uploadImage();
    if (id) {
      updatePromotion();
    } else {
      createPromotion();
    }
  };
  const cancelCreatePromotion = () => {
    dispatch(actions.changeVisibleFormPromotion(false));
    dispatch(actions.changeEditFormPromotion(false));
    form.resetFields();
  };
  const handleFileSelected = (file: any) => {
    setIconUpload(file.target.files[0]);
  };
  const uploadImage = async () => {
    if (!iconUpload) {
      notification.open({
        message: "Upload ảnh chưa thành công",
      });
    } else {
      const imageRef = ref(storage, `images/${iconUpload.name + v4()}`);
      await uploadBytes(imageRef, iconUpload).then(async (snapshot) => {
        await getDownloadURL(snapshot.ref).then((url) => {
          setIcon(url);
        });
      });
    }
  };
  return (
    <div>
      <Modal
        title={
          state.isEditFormPromotion
            ? "Cập nhật mã giảm giá"
            : "Tạo mới mã giá giá"
        }
        open={state.isVisibleFormPromotion}
        okType={"danger"}
        onOk={handleOk}
        onCancel={cancelCreatePromotion}
        width={1100}
        footer={[
          <Button key="back" onClick={cancelCreatePromotion}>
            Huỷ
          </Button>,
          <Button
            disabled={statusButton}
            key="submit"
            type="primary"
            onClick={handleOk}
          >
            {state.isEditFormPromotion ? "Cập nhật" : "Thêm mới"}
          </Button>,
        ]}
      >
        <Form
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 10 }}
          layout="horizontal"
          form={form}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Tên mã giảm giá" name="title">
                <Input style={{ width: 300 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Chi tiết giảm giá" name="description">
                <Input style={{ width: 300 }} />
              </Form.Item>
            </Col>
          </Row>
          <Row></Row>
          <Row gutter={4}>
            <Col span={12}>
              <Form.Item label="Hình thức giảm giá" name="kind">
                <Select
                  defaultValue="Hình thức giảm giá"
                  onChange={(e) => {
                    setKind(Number(e));
                  }}
                  options={[
                    { value: "1", label: "Tiền" },
                    { value: "2", label: "Phần trăm" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Row gutter={kind === 1 ? 0 : 4}>
                <Col span={kind === 1 ? 24 : 12}>
                  <Form.Item label="Giảm giá" name="value">
                    <InputNumber
                      addonAfter={
                        kind === 1 ? "VNĐ" : "" && kind === 2 ? "%" : ""
                      }
                      style={{ width: 100 }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12} hidden={kind !== 2}>
                  <Form.Item label="Giảm tối đa" name="maxValueForPercent">
                    <InputNumber style={{ width: 100 }} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Có cho chuyển đổi không" name="exchangeable">
                <Switch
                  style={{ width: 50 }}
                  onChange={(e: boolean) => setExchangeable(e)}
                />
              </Form.Item>
            </Col>
            <Col hidden={exchangeable} span={12}>
              <Form.Item label="Hạng thành viên" name="loyaltyLevel">
                <Select
                  defaultValue="Hạng thành viên"
                  options={[
                    { value: "0", label: "Đồng" },
                    { value: "1", label: "Bạc" },
                    { value: "2", label: "Vàng" },
                    { value: "3", label: "Bạch Kim" },
                    { value: "4", label: "Kim Cương" },
                    { value: "5", label: "Royal" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col hidden={!exchangeable} span={12}>
              <Form.Item label="Số xu quy đổi" name="point">
                <InputNumber />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default PromotionForm;
