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
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import { CheckOutlined, CloseOutlined, WarningOutlined } from "@ant-design/icons";
import axios from "axios";
import useSWR from "swr";
import { actions, useStoreContext } from "@/store";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "./CategoryForm.module.scss";

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
const fetchersDistrict = async (url: string) => {
  const token = "304ba88b-84e2-11ed-bcba-eac62dba9bd9";
  const res = await axios.get(url, {
    headers: {
      token: `${token}`,
    },
  });
  res.data.data.map((data: any) => {
    data.value = data.DistrictID;
    data.label = data.DistrictName;
  });
  return res.data.data;
};
const fetchersWard = async (url: string) => {
  const token = "304ba88b-84e2-11ed-bcba-eac62dba9bd9";
  const res = await axios.get(url, {
    headers: {
      token: `${token}`,
    },
  });
  res.data.data.map((data: any) => {
    data.value = data.WardCode;
    data.label = data.WardName;
  });
  return res.data.data;
};
const schema = yup.object({
  name: yup.string().required("Trường tên là trường bắt buộc"),
});
type FormData = yup.InferType<typeof schema>;
const fetcherProvince = async () => {
  const token = "304ba88b-84e2-11ed-bcba-eac62dba9bd9";
  const res = await axios.get(
    "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
    {
      headers: {
        token: `${token}`,
      },
    }
  );
  res.data.data.map((data: any) => {
    data.value = data.ProvinceID;
    data.label = data.ProvinceName;
  });
  return res.data.data;
};

const StoreForm = () => {
  const [form] = Form.useForm();
  const { state, dispatch } = useStoreContext();
  const [id, setId] = useState<number>();
  const [name, setName] = useState("");
  const [provinceCode, setProvinceCode] = useState();
  const [districtCode, setDistrictCode] = useState();
  const [wardCode, setWardCode] = useState();
  const [statusButton, setStatusButton] = useState<boolean>(false);
  const { data: store } = useSWR(
    state.idStore
      ? `https://tech-api.herokuapp.com/v1/store/get/${state.idStore}`
      : null,
    fetchers
  );
  const { data: province } = useSWR("/", fetcherProvince);
  const { data: district } = useSWR(
    provinceCode
      ? `https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceCode}`
      : null,
    fetchersDistrict
  );
  const { data: ward } = useSWR(
    districtCode
      ? `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtCode}`
      : null,
    fetchersWard
  );
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
    setId(store?.id);
    setProvinceCode(store?.provinceCode);
    setDistrictCode(store?.districtCode);
    setWardCode(store?.wardCode);
    form.setFieldsValue({
      name: store?.name,
      longitude: store?.longitude,
      latitude: store?.latitude,
      shopId: store?.shopId,
      addressDetails: store?.addressDetails,
      phone: store?.phone,
      provinceCode: store?.provinceCode,
      districtCode: store?.districtCode,
      wardCode: store?.wardCode,
    });
  }, [store]);
  const nameProvince = province?.find(
    (item: any) => item.ProvinceID === provinceCode
  )?.ProvinceName;
  const nameDistrict = district?.find(
    (item: any) => item.DistrictID === districtCode
  )?.DistrictName;
  const nameWard = ward?.find(
    (item: any) => item.WardCode === wardCode
  )?.WardName;

  const createStore = async () => {
    setStatusButton(true);
    const storeValue = form.getFieldsValue();
    delete storeValue.shopId;
    const storeCreate = {
      ...storeValue,
      addressDetails:
        storeValue.addressDetails +
        ", " +
        nameWard +
        " " +
        nameDistrict +
        " " +
        nameProvince,
    };
    const token = localStorage.getItem("token");
    const res = await axios.post(
      "https://tech-api.herokuapp.com/v1/store/create",
      storeCreate,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.result) {
      dispatch(actions.changeVisibleFormStore(false));
      dispatch(actions.changeEditFormStore(false));
      form.resetFields();
      setStatusButton(false);
      notification.open({
        message: 'Thêm cửa hàng thành công',
        icon: <CheckOutlined style={{ color: "#52c41a" }} />,
      });
    }else if (!res.data.result) {
      notification.open({
        message: 'Thêm cửa hàng thất bại',
        icon: <CloseOutlined style={{ color: "red" }} />,
      });
    }
  };
  const updateStore = async () => {
    setStatusButton(true);
    const storeValue = form.getFieldsValue();
    delete storeValue.shopId;
    const storeCreate = {
      ...storeValue,
      addressDetails: storeValue.addressDetails,
      id: id,
    };
    const token = localStorage.getItem("token");
    const res = await axios.put(
      "https://tech-api.herokuapp.com/v1/store/update",
      storeCreate,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.result) {
      dispatch(actions.changeVisibleFormStore(false));
      dispatch(actions.changeEditFormStore(false));
      form.resetFields();
      setStatusButton(false);
      notification.open({
        message: 'Cập nhật thông tin cửa hàng thành công',
        icon: <CheckOutlined style={{ color: "#52c41a" }} />,
      });
    } else {
      notification.open({
        message: 'Cập nhật thông tin cửa hàng thất bại',
        icon: <WarningOutlined style={{ color: "red" }} />,
      });
    }
  };

  const handleOk = async () => {
    if (id) {
      updateStore();
    } else {
      createStore();
    }
  };
  const cancelFormStore = () => {
    form.resetFields();
    dispatch(actions.changeEditFormStore(false));
    dispatch(actions.changeVisibleFormStore(false));
  };
  const handleChangeProvince = (value: any) => {
    setProvinceCode(value);
  };
  const handleChangeDistrict = (value: any) => {
    setDistrictCode(value);
  };
  const handleChangeWard = (value: any) => {
    setWardCode(value);
  };
  return (
    <div>
      <Modal
        title={
          state.isEditFormStore
            ? "Cập nhật thông tin cửa hàng"
            : "Tạo mới cửa hàng"
        }
        open={state.isVisibleFormStore}
        okType={"danger"}
        onOk={handleOk}
        onCancel={cancelFormStore}
        width={1000}
        footer={[
          <Button key="back" onClick={cancelFormStore}>
            Huỷ
          </Button>,
          <Button
            disabled={statusButton}
            key="submit"
            type="primary"
            onClick={handleOk}
          >
            {state.isEditFormStore ? "Cập nhật" : "Thêm mới"}
          </Button>,
        ]}
      >
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          form={form}
        >
          <Row gutter={4}>
            <Col span={10}>
              <Form.Item label="Tên cửa hàng" name="name">
                <Input
                  style={{ width: 200 }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={14}>
              <Form.Item label="Địa chỉ cửa hàng" name="addressDetails">
                <Input style={{ width: 350 }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={2}>
            <Col span={8}>
              <Form.Item label="Tỉnh thành" name="provinceCode">
                <Select
                  showSearch
                  defaultValue="Chọn tỉnh thành"
                  style={{ width: 150 }}
                  options={province}
                  onChange={handleChangeProvince}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Quận" name="districtCode">
                <Select
                  showSearch
                  defaultValue="Chọn quận huyện"
                  style={{ width: 150 }}
                  options={district}
                  onChange={handleChangeDistrict}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Phường xã" name="wardCode">
                <Select
                  showSearch
                  defaultValue="Chọn phường xã"
                  style={{ width: 200 }}
                  options={ward}
                  onChange={handleChangeWard}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Kinh độ" name="longitude">
                <InputNumber style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Vĩ độ" name="latitude">
                <InputNumber style={{ width: 200 }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Số điện thoại" name="phone">
                <Input style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col span={12} hidden={!state.isEditFormStore}>
              <Form.Item label="Mã cửa hàng" name="shopId">
                <Input disabled style={{ width: 200 }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default StoreForm;
