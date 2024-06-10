
import React, { useState, useEffect } from 'react'
import {
  Text,
  View,
  StyleSheet,
  Linking,
  AppRegistry,
  TouchableOpacity,
  Image,
} from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { RNCamera } from 'react-native-camera'
import { Client, Message } from 'react-native-paho-mqtt'
import { useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  responsiveHeight as hp,
  responsiveWidth as wp,
  responsiveFontSize as fp,
} from 'react-native-responsive-dimensions'
import { launchImageLibrary } from 'react-native-image-picker'
//import { handleSendNotification } from '../../utility/asyncStorage'
import App_top_Header from '../../Component/App_top_Header'
import LoaderComponent from '../../Component/ScannerLoader'
import CustomModal from '../../Modals/Custom.modal'
import BlurredModalWithLoader from '../../Modals/BlurredModalWithLoader'
import { DoorOpening, fetchQrCodeDetails, findChargingCost, getUserData, setModal } from '../../redux/Action'
import { handleSendNotification } from '../../firebase/handleNotification'
//DoorOpening
// fetchQrCodeDetails,
// findChargingCost,
// getUserData,
// setModal,
export default function PublicScanner({ navigation, route }) {
  const MqqtUrl = 'wss://mqtt.jouls.co.in/mqtt'
  const dispatch = useDispatch()
  const [isModalVisible, setisModalVisible] = useState(false)
  const [isloaderModalVisible, setIsloaderModalVisible] = useState(false)
  const [loading, setloading] = useState(false)
 
  const [Data, setData] = useState('HGHG')
  const [flashOn, setFlashOn] = useState(false)
  console.log(Data)

  
  const [isScannerActive, setIsScannerActive] = useState(true)
  const [scannerMessage, setScannerMessage] = useState('')
  // require('../../assets/defaultuser.png')
  console.log('isScannerActive', isScannerActive)
  const myStorage = {
    setItem: (key, item) => {
      myStorage[key] = item
    },
    getItem: (key) => myStorage[key],
    removeItem: (key) => {
      delete myStorage[key]
    },
  }

 

  const selectImageFromGallery = async () => {
    const options = {
      mediaType: 'photo',
    }

    launchImageLibrary(options, async (response) => {
      console.log('response', response)
      if (!response.didCancel && !response.error) {
        setIsloaderModalVisible(true)

        const formData = new FormData()
        formData.append('image', {
          uri: response.assets[0].uri,
          type: response.assets[0].type,
          name: response.assets[0].fileName,
        })
        const response2 = await dispatch(fetchQrCodeDetails(formData))
        console.log(response2, 'response')
        if (!response2 || response2.error) {
          setIsloaderModalVisible(false)
          setScannerMessage(
            'Seems to be an invalid QR Code.\n Try with a different QR Code.'
          )
          setisModalVisible(true)
          return
        }

        if (response2?.qrCodeData) {
          setIsloaderModalVisible(false)
          const pid = response2.qrCodeData
          handleSendMessage(pid)
        }
      }
    })
  }

  const receivedData = route.params?.name || 'User'

  const id = useSelector((state) => state?.userReducers?.Product?._id)

  const onSuccess = async (e) => {
    const cleanedWifiString = e.data
    console.log('cleanedWifiString', cleanedWifiString)
    handleSendMessage(cleanedWifiString)
  }

  const apicall = async (pid) => {
    // let SendData={}
    if (!pid) {
      return
    }
    
    try {
      // console.log("in try api calll");
      const findChargingCost1 = await dispatch(findChargingCost(pid))
      await dispatch(getUserData())
 
    } catch (error) {
      console.log('Error', error)
    }
  }

  // Function to check MQTT messages for a given topic
  const checkMQTTMessages = (topic, callback) => {
    try {
      // MQTT connection setup
      const client = new Client({
        uri: MqqtUrl,
        clientId: 'client' + Math.random().toString(36).substring(7),
        storage: myStorage,
      })

      // Variable to track whether message received or not
      let messageReceived = false

      // MQTT connect event listener
      client
        .connect()
        .then(() => {
          client.subscribe(`${topic}_Updates`)
          client.subscribe(`${topic}_Charging_Data`)
          console.log('mqtt connect in checkMQTTMessages')
        })
        .catch((err) => {
          console.error('Error during connection or subscription:', err)
          client.disconnect()
        })

      // Set a timeout to handle no message received on _Updates topic
      const messageTimeout = setTimeout(() => {
        if (!messageReceived) {
          callback('Stop')
          client.disconnect()
          console.log('Disconnected from MQTT broker')
        }
      }, 7000) // 5000 milliseconds (5 seconds), adjust the time as needed

      // MQTT message event listener
      client.on('messageReceived', (message) => {
        console.log(
          'message in on client checkMQTTMessages',
          message.payloadString
        )

        if (message.destinationName === `${topic}_Updates`) {
          if (message.payloadString === 'Door is open') {
            messageReceived = true
            clearTimeout(messageTimeout) // Clear the timeout if message is received
            callback('abletouse')
            client.disconnect()
          }
        } else if (message.destinationName === `${topic}_Charging_Data`) {
          clearTimeout(messageTimeout) // Clear the timeout if message is received
          messageReceived = true
          callback('alreadyuse')
          client.disconnect()
        }
      })

      client.on('connectionLost', (responseObject) => {
        if (responseObject.errorCode !== 0) {
          console.error('Connection lost:', responseObject.errorMessage)
        }
      })
    } catch (err) {
      console.error('Unexpected error:', err)
    }
  }

  // Example usage:

  const checkIsCharger = (pid) => {
    // PID ko lowercase mein convert karein
    console.log(pid.length, 'length')
    const lowercasePID = pid.toLowerCase()
    if (pid == '2x7z6m8y9n1o0p3q4r5s') {
      return true
    }
    // if (pid.length <= 30 && pid.length>19) {
    //   return true
    // }
    // "pes" ya "pel" ka presence check karein
    if (lowercasePID.includes('pes') || lowercasePID.includes('pel')) {
      console.log('pid.lengthpid.length', pid.length)
      // PID ki length 20 se zyada nahi honi chahiye
      if (pid.length <= 30) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  const handleSendMessage = async (pid) => {
    const isCharger = checkIsCharger(pid)
    if (!isCharger) {
      setScannerMessage('Sorry, this rarely happens\nPleasr try again')
      setisModalVisible(true)
      console.log('Is not Charger')
      return
    }

    setloading(true)
    dispatch(DoorOpening(pid))

    checkMQTTMessages(pid, async (result) => {
      console.log('resultresultradhe', result)
      if (result == 'abletouse') {
        dispatch(setModal(true))
        apicall(pid)
        console.log('navigate to newhome')
        await AsyncStorage.setItem('pid', pid)
        navigation.navigate('Newhome')
      } else if (result == 'alreadyuse') {
        setloading(false)
        setScannerMessage('Charger already in use')
        setisModalVisible(true)
        return
      } else if (result == 'Stop') {
        setloading(false)
        setScannerMessage('Charger Not Working')
        setisModalVisible(true)
        return
      }
    })
  }

  const ReScanClick = () => {
    console.log('rescanclick', isModalVisible)
    // setIsScannerActive(true)
    setisModalVisible(false)
  }

  const delfn = () => {
    console.log('delfun')
   handleSendNotification('radhe', 'kumawat')
    // <TouchableOpacity onPress={delfn}>
    //     <Text style={{color:"red",fontSize:20}}>api call</Text>
    //   </TouchableOpacity>
    // setIsScannerActive(!isScannerActive)
    // const sendData = {
    //   Porduct_Key: 'radhe',
    //   inputCost: '200',
    //   findchargername: 'ajmer',
    // }
    // dispatch(ChargerHistory(sendData))
  }
  return (
    <>
      {!loading ? (
        <View style={styles.container}>
          <App_top_Header
            title={`Hello ${receivedData}`}
            navigation={navigation}
            color={'#C1E0C2'}
            isHome={true}
          />

          <View style={styles.containerContentBox}>
        
            <Text style={{ fontSize: 18, fontWeight: '400', color: '#707070' }}>
              To start charging, please scan the
              <Text style={{ color: 'green' }}> QR Code </Text>
            </Text>
            <View style={styles.barcodebox}>
              <QRCodeScanner
                onRead={onSuccess}
                // reactivate={isScannerActive}
                reactivate={isModalVisible ? false : true}
                reactivateTimeout={2000}
                // topContent={
                //   <Text style={styles.centerText}>
                //     Go to
                //     <Text style={styles.textBold}>
                //       wikipedia.org/wiki/QR_code
                //     </Text>
                //     on your computer and scan the QR code.
                //   </Text>
                // }
                flashMode={
                  flashOn
                    ? RNCamera.Constants.FlashMode.torch
                    : RNCamera.Constants.FlashMode.off
                }
                // bottomContent={
                //   <TouchableOpacity style={styles.buttonTouchable}>
                //     {/* <Text style={styles.buttonText}>OK. Got it!</Text> */}
                //   </TouchableOpacity>
                // }
              />
              <Text
                style={{
                  fontSize: 15,
                  color: '#FFFFFF',
                  position: 'absolute',
                  bottom: 20,
                }}
              >
                Scan any Qr Code
              </Text>
            </View>
            <View
              style={{
                gap: 10,
                justifyContent: 'center',
                flexDirection: 'row',
              }}
            >
              <TouchableOpacity onPress={() => selectImageFromGallery()}>
                <Image
                  style={styles.actionimgicon}
                  source={require('../../assets/picimg.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setFlashOn(!flashOn)
                }}
              >
                <Image
                  style={[
                    styles.actionimgicon,
                    { tintColor: flashOn ? 'green' : 'black' },
                  ]}
                  source={require('../../assets/torch.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.statusBox}>
              <View
                style={{
                  height: 10,
                  backgroundColor: 'green',
                  width: 10,
                  borderRadius: 10 / 2,
                  marginRight: 10,
                }}
              ></View>
              <Text style={{ color: '#848484' }}>Status:</Text>
              <Text style={{ paddingLeft: 10, color: '#606060' }}>
                Scanning QR Code
              </Text>
            </View>
            {/* <EvCharging /> */}
          </View>
          <View style={styles.bottomColorBox}></View>
          <CustomModal
            // onRescanClick={ReScanClick}
            isModal={'publicScanner'}
            visible={isModalVisible}
            onClose={() => {
              setisModalVisible(false)
            }}
            // onClose={ReScanClick}
          >
            <Text>
              {/* {!scannerMessage
                ? 'Sorry, this rarely happens\nPleasr try again'
                : 'Charger Already in Use'} */}
              {scannerMessage}
            </Text>
            {/* "Seems to be an invalid QR Code. Try with a different QR Code." */}
          </CustomModal>
          <BlurredModalWithLoader
            visible={isloaderModalVisible}
            isLoading={true}
          />
        </View>
      ) : (
        <View>
          <LoaderComponent loading={loading} />
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerContentBox: {
    flex: 1,
    backgroundColor: '#fff',
    gap: 10,
    margin: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#D4D4D4',
    borderRadius: 20,
    overflow: 'hidden',
  },
  barcodebox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    borderRadius: 8,
    backgroundColor: 'tomato',
    position: 'relative',
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  actionimgicon: { height: 30, width: 30, resizeMode: 'contain' },
  statusBox: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4D4D4',
    borderRadius: 8,
  },
  buttonTouchable: {
    padding: 16,
  },
  bottomColorBox: {
    position: 'absolute',
    backgroundColor: '#C1E0C2',
    bottom: 0,
    height: hp(40),
    borderTopLeftRadius: 40,
    borderTopRightRadius: 50,
    width: wp(100),
    zIndex: -1,
  },
})
