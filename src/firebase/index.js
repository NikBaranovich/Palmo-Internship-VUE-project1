// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvRwup624TfEfyQXutZI_dG677NEd6Ocw",
  authDomain: "calendar-vue-402510.firebaseapp.com",
  projectId: "calendar-vue-402510",
  storageBucket: "calendar-vue-402510.appspot.com",
  messagingSenderId: "896797295571",
  appId: "1:896797295571:web:fdfca9239c16c3ede2a526",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
export { db };
