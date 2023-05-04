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
import React, { useContext, useEffect, useState } from "react";
const { TextArea } = Input;
import {
  CheckOutlined,
  PlusOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  isEditCategoryForm,
  updateIsVisibleFormCategory,
} from "@/redux/category/categorySlice";
import { RootState } from "@/redux/store";
import {
  ref,
  UploadResult,
  uploadBytesResumable,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "@/utils/firebase";
import type { RadioChangeEvent } from "antd";
import useSWR, { mutate } from "swr";
import { Category } from "@/models";
import Context from "@/store/Context";
import { actions, useStoreContext } from "@/store";
import { v4 } from "uuid";
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
const schema = yup.object({
  name: yup.string().required("Trường tên là trường bắt buộc"),
});
type FormData = yup.InferType<typeof schema>;

const StoreForm = () => {
  const [form] = Form.useForm();
  const [state, dispatchs] = useStoreContext();
  const { data: store } = useSWR(
    `https://tech-api.herokuapp.com/v1/store/get/${state.idStore}`,
    fetchers
  );
  console.log(state.isEditFormStore);
  const [id, setId] = useState<number>();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [iconUpload, setIconUpload] = useState<File>();
  const dispatch = useDispatch();
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
    form.setFieldsValue({
      name: store?.name,
      longitude: store?.longitude,
      latitude: store?.latitude,
      shopId: store?.shopId,
      addressDetails: store?.addressDetails,
      phone: store?.phone,
    });
  }, [store]);

  const createStore = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      "https://tech-api.herokuapp.com/v1/store/create",
      {
        ...form.getFieldsValue(),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.result) {
      dispatchs(actions.changeVisibleFormStore(false));
      //   dispatch(actions.changeEditFormCategory(false));
      form.resetFields();
      notification.open({
        message: res.data.message,
        icon: <CheckOutlined style={{ color: "#52c41a" }} />,
      });
      mutate("/product-category", fetcher, false);
    }
  };
  const updateStore = async () => {
    const store = {
      ...form.getFieldsValue(),
      id: id,
    };
    delete store?.shopId;
    const token = localStorage.getItem("token");
    const res = await axios.put(
      "https://tech-api.herokuapp.com/v1/store/update",
      store,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.result) {
      dispatchs(actions.changeVisibleFormStore(false));
      dispatch(actions.changeEditFormStore(false));
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

  const handleOk = async () => {
    if (id) {
      updateStore();
    } else {
      createStore();
    }
  };
  const cancelFormStore = () => {
    //   dispatch(updateIsVisibleFormCategory(false));
    //   dispatch(isEditCategoryForm(false));
    dispatchs(actions.changeVisibleFormStore(false));
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
          state.isEditFormStore
            ? "Cập nhập thông tin cửa hàng"
            : "Tạo mới cửa hàng"
        }
        open={state.isVisibleFormStore}
        okType={"danger"}
        onOk={handleOk}
        onCancel={cancelFormStore}
        width={800}
        footer={[
          <Button key="back" onClick={cancelFormStore}>
            Huỷ
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            {state.isEditFormCategory ? "Cập nhập" : "Thêm mới"}
          </Button>,
        ]}
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          form={form}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Tên cửa hàng" name="name">
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Địa chỉ cửa hàng" name="addressDetails">
                <Input style={{ width: 500 }} />
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
                <Input></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Mã cửa hàng" name="shopId">
                <Input></Input>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default StoreForm;
