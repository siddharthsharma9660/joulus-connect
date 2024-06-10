import { initializeApp, getApp, getApps } from '@react-native-firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyDEeBA8UfAjcF2T5ooJBMzeVh_oq7-hTyQ",
    authDomain: "jouls-connect.firebaseapp.com",
    projectId: "jouls-connect",
    storageBucket: "jouls-connect.appspot.com",
    messagingSenderId: "139646200556",
    appId: "1:139646200556:android:7a2c0a779f5b28e86113c9",
  };


export const initializeFirebase = async () => {
  try {
    if (getApps().length === 0) {
      initializeApp(firebaseConfig);
      console.log('Firebase initialized successfully');
    } else {
      console.log('Firebase app already initialized');
    }
    return true;
  } catch (error) {
    console.error('Firebase initialization error:', error.message);
    return false;
  }
};


