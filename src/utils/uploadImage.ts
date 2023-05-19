import { notification } from "antd";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from "@/utils/firebase";
import { v4 } from "uuid";

export const uploadImageProduct =  async (imageUpload: File | undefined) => {
  if (!imageUpload) {
    notification.open({
      message: "Upload ảnh chưa thành công",
    });
    return "";
  } else {
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    await uploadBytes(imageRef, imageUpload).then(async (snapshot) => {
      await getDownloadURL(snapshot.ref).then((url) => {
        return url;
      });
    });
    return "";
  }
};
