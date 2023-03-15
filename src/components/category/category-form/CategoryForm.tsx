import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Row,
  Select,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
const { TextArea } = Input;
import { CheckOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  isEditCategoryForm,
  updateIsVisibleFormCategory,
} from "@/redux/categorySlice";
import { RootState } from "@/redux/store";
import { ref, UploadResult, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/utils/firebase";
import Image from "next/image";

const CategoryForm = () => {
  const categorySelector = useSelector((state: RootState) => state.category);
  const [createCategory, setCreateCategory] = useState(false);
  const [id, setId] = useState();
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [status, setStatus] = useState(categorySelector.category?.status);
  const [orderSort, setOrderSort] = useState(0);
  const [note, setNote] = useState("");
  const [icon, setIcon] = useState<File>();
  const [iconUpload, setIconUpload] = useState("");
  const [category, setCategory] = useState([]);
  const dispatch = useDispatch();
  const [fileList, setFileList] = useState([]);
  useEffect(() => {
    // getCategorySelected();
    async function fetchData() {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `https://tech-api.herokuapp.com/v1/product-category/get/${categorySelector.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data.data);
    }
    fetchData();
  }, [categorySelector.id, categorySelector.isEdit]);

  const createFormCategory = async () => {
    const token = localStorage.getItem("token");
    if (id) {
      const res = await axios.put(
        "https://tech-api.herokuapp.com/v1/product-category/update",
        {
          name: name,
          note: note,
          orderSort: orderSort,
          status: status,
          icon: iconUpload,
          id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.result) {
        getCategory();
        dispatch(updateIsVisibleFormCategory(false));
        getCategory();
        notification.open({
          message: res.data.message,
          icon: <CheckOutlined style={{ color: "#52c41a" }} />,
        });
      }
    } else {
      const res = await axios.post(
        "https://tech-api.herokuapp.com/v1/product-category/create",
        {
          name: name,
          note: note,
          orderSort: orderSort,
          status: status,
          icon: iconUpload,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.result) {
        getCategory();
        dispatch(updateIsVisibleFormCategory(false));
        getCategory();
        notification.open({
          message: res.data.message,
          icon: <CheckOutlined style={{ color: "#52c41a" }} />,
        });
      }
    }
  };
  const cancelCreateCategory = () => {
    dispatch(updateIsVisibleFormCategory(false));
    dispatch(isEditCategoryForm(false));
  };
  const getCategory = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      "https://tech-api.herokuapp.com/v1/product-category/list",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    res.data.data.map((data: any) => {
      data.value = data.id;
      data.label = data.name;
    });
    setCategory(res.data.data || []);
  };
  const getCategorySelected = async (id: number | undefined) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `https://tech-api.herokuapp.com/v1/product-category/get/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };
  const handleFileSelected = (file: any) => {
    setIcon(file);
  };
  const uploadImage = () => {
    if (!icon) {
      notification.open({
        message: "Upload ảnh chưa thành công",
      });
    } else {
      const imageRef = ref(storage, `images/${icon.name}`);
      uploadBytesResumable(imageRef, icon).then((res: UploadResult) => {
        setIconUpload(
          `https://firebasestorage.googleapis.com/v0/b/music-mp3-page.appspot.com/o/images%2F${icon.name}?
          alt=media&token=16d7e53d-909a-484e-8481-f242d2e3a31f`
        );
      });
    }
  };
  const icons = categorySelector.category?.icon;
  return (
    <div>
      <Modal
        title={
          categorySelector.isEdit
            ? "Cập nhập danh mục sản phẩm"
            : "Tạo mới danh mục sản phẩm"
        }
        open={categorySelector.isVisibleFormCategory}
        okType={"danger"}
        onOk={createFormCategory}
        onCancel={cancelCreateCategory}
        width={800}
      >
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
        >
          <Row>
            <Col span={12}>
              {categorySelector.category?.name}
              <Form.Item
                label="Tên danh mục"
                name="nameCategory"
                rules={[
                  {
                    required: true,
                    message: "Tên danh mục là trường bắt buộc",
                  },
                ]}
              >
                <Input
                  value={categorySelector.category?.name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Danh mục cha" name="parentId">
                <div className="flex">
                  <Select
                    onClick={getCategory}
                    defaultValue="Chọn nhóm danh mục cha"
                    onChange={(e) => setParentId(e)}
                    options={category}
                  />
                  <button
                    className="ml-2"
                    onClick={() => setCreateCategory(true)}
                  >
                    <PlusOutlined />
                  </button>
                </div>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              {categorySelector.category?.status}
              <Form.Item label="Trạng thái" name="status">
                <InputNumber
                  style={{ width: 200 }}
                  onChange={(e: any) => setStatus(e)}
                  defaultValue={categorySelector.category?.status}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              {categorySelector.category?.orderSort}
              <Form.Item label="Order Sort" name="orderSort">
                <InputNumber
                  style={{ width: 200 }}
                  onChange={(e: any) => setOrderSort(e)}
                  value={categorySelector.category?.orderSort}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              {categorySelector.category?.note}
              <Form.Item label="Ghi chú" name="note">
                <TextArea
                  value={categorySelector.category?.note}
                  rows={4}
                  onChange={(e) => setNote(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            {/* <Image
              src="https://cdn.tgdd.vn/Files/2017/01/19/939425/cach-cai-hinh-nen-may-tinh-khong-bi-mo_1280x720-800-resize.jpg"
              alt="Picture of the author"
              width={500}
              height={500}
            /> */}
            <Upload
              listType="picture-card"
              onChange={(e) => handleFileSelected(e.file)}
            >
              {fileList.length >= 8 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
            <Button onClick={uploadImage}>Upload</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryForm;
