
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-native-paper';
import { theme } from './src/core/theme';
import { Provider as Sample } from 'react-redux'
import { Store } from './src/redux/Store';
import SignIn from './src/screens/auth/auth';
import Charger_Selection from './src/screens/ChargerSelection/Charger_Selection';
import PublicScanner from './src/screens/PublicCharger/PublicScanner';
import ChargingCard_History from './src/screens/PublicCharger/ChargingCard_History';
import AuthLoadingScreen from './src/screens/Splash/Splash.screen';
import HomeScreen from './src/screens/PublicCharger/Home.Screen';
import AllSupport from './src/screens/PublicCharger/support';
import ChatSupport from './src/screens/PublicCharger/ChatSupport';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <Sample store={Store}>
      <Provider theme={theme}>
    <NavigationContainer>
      <Stack.Navigator 
      initialRouteName="StartScreen"
      screenOptions={{
        headerShown: false,
      }}
      >
            <Stack.Screen name="Authloading" component={AuthLoadingScreen} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="Newhome" component={HomeScreen} />
            <Stack.Screen name="PublicScanner" component={PublicScanner} />
        <Stack.Screen
              name="chargerSelection"
              component={Charger_Selection}
            />
          <Stack.Screen
              name="ChargingCard_History"
              component={ChargingCard_History}
            />  
            
            <Stack.Screen name="support" component={AllSupport} />
            <Stack.Screen name="chatsupport" component={ChatSupport} />
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
    </Sample>

  );
}

export default App;

 // "@react-native-firebase/app": "^20.1.0",
    // "@react-native-firebase/auth": "^20.1.0",
    // "@react-native-firebase/messaging": "^20.1.0",