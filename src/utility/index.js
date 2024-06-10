import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Linking } from 'react-native';

const fetchDataAsyncStorageData = async () => {
  try {
    const storedData = await AsyncStorage.getItem('pid');
    const Appmid = await AsyncStorage.getItem('mid');
    const Authtoken = await AsyncStorage.getItem('Authtoken');
   
    return { storedData,Appmid ,Authtoken};
  } catch (error) {
    console.error('Error fetching data:', error);
    // throw error; // Re-throw the error to handle it outside of this function
  }
};



function calculateTimeDifferenceStartTimeEndTime(startTime, endTime) {
  // Ensure both startTime and endTime are provided
  if (!startTime || !endTime) {
    return "0 sec";
  }

  // Parse the start and end times
  const [startHours, startMinutes, startSeconds] = startTime.split(':').map(Number);
  const [endHours, endMinutes, endSeconds] = endTime.split(':').map(Number);

  // Create Date objects for both times on the same arbitrary date
  const startDate = new Date(2024, 0, 1, startHours, startMinutes, startSeconds);
  const endDate = new Date(2024, 0, 1, endHours, endMinutes, endSeconds);

  // If start time is greater than or equal to end time, return "0 sec"
  if (startDate >= endDate) {
    return "0 sec";
  }

  // Calculate the difference in milliseconds
  const diffMilliseconds = endDate - startDate;

  // Convert the difference to hours, minutes, and seconds
  const diffSeconds = Math.floor((diffMilliseconds / 1000) % 60);
  const diffMinutes = Math.floor((diffMilliseconds / (1000 * 60)) % 60);
  const diffHours = Math.floor(diffMilliseconds / (1000 * 60 * 60));

  // Construct the time difference string
  let timeDifference = "";

  if (diffHours > 0) {
    timeDifference += `${diffHours} hr `;
  }

  if (diffMinutes > 0) {
    timeDifference += `${diffMinutes} min `;
  }

  if (diffSeconds > 0) {
    timeDifference += `${diffSeconds} sec`;
  }

  // If both hours, minutes, and seconds are 0, return "0 sec"
  if (diffHours === 0 && diffMinutes === 0 && diffSeconds === 0) {
    return "0 sec";
  }

  return timeDifference.trim();
}

const redirectToApp = () => {
  const packageName = 'com.Jouls';
  
  let appUrl;
  if (Platform.OS === 'ios') {
    // iOS app store URL
    appUrl = `https://apps.apple.com/app/id<YOUR_APP_ID>`;
  } else if (Platform.OS === 'android') {
    // Android Play Store URL
    appUrl = `https://play.google.com/store/apps/details?id=${packageName}`;
  } else {
    // If platform is neither iOS nor Android, return an error or handle accordingly
    console.error('Unsupported platform');
    return;
  }

  // Open the URL
  Linking.openURL(appUrl).catch((err) =>
    console.error('An error occurred', err)
  );
}



const ShowMessageModalData = [
  { subheading: "Connecting", message: "Don't worry your charging session won't get hurt" },
  { subheading: "Check the Charging WiFi", message: "Don't worry your charging session won't get hurt" },
  { subheading: "It Seems the Charger is Disconnected", message: "Don't worry your charging session won't get hurt" },
  { subheading: "Charging is Interrupted", message: "Please check your charging cable and connection" },
  { subheading: "Charger Connected", message: "Please check your charging cable and connection" }
];

export {fetchDataAsyncStorageData,calculateTimeDifferenceStartTimeEndTime,ShowMessageModalData,redirectToApp}