import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCgbBGWHPBUr6_pZgKuT1NuQvJtazl2WdY",
  authDomain: "music-mp3-page.firebaseapp.com",
  projectId: "music-mp3-page",
  storageBucket: "music-mp3-page.appspot.com",
  messagingSenderId: "767410924896",
  appId: "1:767410924896:web:db911c6faca7b5f0638205",
  measurementId: "G-5PEDSTBDSP"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
