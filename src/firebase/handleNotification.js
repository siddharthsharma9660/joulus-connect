import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import { initializeFirebase } from './intialize.firebase';
import { Platform, Linking } from 'react-native';

const getUserDeviceToken = async () => {
    try {
      // Initialize Firebase app and wait for it to complete
      const isFirebaseInitialized = await initializeFirebase();
  
      if (!isFirebaseInitialized) {
        throw new Error('Firebase initialization failed');
      }
  
      // Register the device for remote messages
      await messaging().registerDeviceForRemoteMessages();
  
      // Get the FCM token
      const token = await messaging().getToken();
      console.log('FCM token:', token);
  
      // Return the token if it exists
      return token ? token : '';
    } catch (error) {
      console.log('FCM error:', error.message);
      // Return an empty string in case of an error
      return '';
    }
  };

const configureNotifications = () => {
    try {
      // Configure push notifications
      PushNotification.configure({
        onNotification: function (notification) {
          console.log('NOTIFICATION:', notification);
        },
        requestPermissions: Platform.OS === 'ios',
      });
  
      // Create a notification channel for Android
      PushNotification.createChannel(
        {
          channelId: 'default-channel-id', // (required)
          channelName: 'Default channel', // (required)
        },
        (created) => console.log(`createChannel returned '${created}'`)
      );
  
      // Handle foreground messages
      const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
        try {
          console.log("remoteMessage", remoteMessage);
          PushNotification.localNotification({
            channelId: 'default-channel-id',
            title: remoteMessage.notification?.title,
            message: remoteMessage.notification?.body,
          });
        } catch (error) {
          console.error('Error handling foreground message:', error);
        }
      });
  
      // Handle background messages
      messaging().setBackgroundMessageHandler(async remoteMessage => {
        try {
          console.log("remoteMessageremoteMessage", remoteMessage);
          console.log('Message handled in the background!', remoteMessage);
          PushNotification.localNotification({
            channelId: 'default-channel-id',
            title: remoteMessage.notification?.title,
            message: remoteMessage.notification?.body,
          });
        } catch (error) {
          console.error('Error handling background message:', error);
        }
      });
  
      // Cleanup on unmount
      if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => {
          unsubscribeForeground();
        });
      }
    } catch (error) {
      console.error('Error configuring notifications:', error);
    }
  };
  
  
  
  // send notification
  const handleSendNotification = (title, message) => {
    try {
      // Send local notification
      PushNotification.localNotification({
        channelId: 'default-channel-id', 
        channelName: 'Default channel', 
        soundName: 'default', 
        vibrate: true,
        title: title || 'Button Clicked',
        message: message || 'Notification triggered by button click',
      });
      
      console.log('Notification sent successfully');
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };
  
  export {getUserDeviceToken,configureNotifications,handleSendNotification}