import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBGCTxdMCgEzaESSrDP93LrD6JtElIozFs',
  authDomain: 'gt-infoboard.firebaseapp.com',
  projectId: 'gt-infoboard',
  storageBucket: 'gt-infoboard.firebasestorage.app',
  messagingSenderId: '482189108196',
  appId: '1:482189108196:web:04124791a7cd0a77ec1df1',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export default app;
