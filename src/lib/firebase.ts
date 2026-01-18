import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAzKHYpwVVXD7yBxB3wYTOhpBsvSQuXisk",
  authDomain: "uttarakhand-1aa03.firebaseapp.com",
  projectId: "uttarakhand-1aa03",
  storageBucket: "uttarakhand-1aa03.firebasestorage.app",
  messagingSenderId: "218124750456",
  appId: "1:218124750456:web:2a482533f9bef21167a78d",
  measurementId: "G-K41Y5MF8MQ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export default app;