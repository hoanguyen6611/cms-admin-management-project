import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyBOTFrO2jnFcXSo2HYtkQIQYRO6CM-9eFo",
  authDomain: "ec-cms-admin.firebaseapp.com",
  projectId: "ec-cms-admin",
  storageBucket: "ec-cms-admin.appspot.com",
  messagingSenderId: "265885494262",
  appId: "1:265885494262:web:ce08b9add6f4aafd80f5d7",
  measurementId: "G-D8X8E50WN6",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
