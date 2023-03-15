import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCgbBGWHPBUr6_pZgKuT1NuQvJtazl2WdY",
  authDomain: "music-mp3-page.firebaseapp.com",
  projectId: "music-mp3-page",
  storageBucket: "music-mp3-page.appspot.com",
  messagingSenderId: "767410924896",
  appId: "1:767410924896:web:0f8af1c7d21321e8638205",
  measurementId: "G-GN06H3ZFRZ",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
