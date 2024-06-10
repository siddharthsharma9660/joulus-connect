import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Alert,
    ToastAndroid,
    BackHandler,
  } from 'react-native'
  import {
    responsiveHeight as hp,
    responsiveWidth as wp,
    responsiveFontSize as fp,
  } from 'react-native-responsive-dimensions'
  

  import React, { useEffect, useRef, useState } from 'react'
  import { useFocusEffect } from '@react-navigation/native'
  import AsyncStorage from '@react-native-async-storage/async-storage'
import Circle from '../../Component/Circle'
import CustomModal from '../../Modals/Custom.modal'
  
  const Charger_Selection = ({ navigation }) => {
    const [isModalVisible, setisModalVisible] = useState(false)
    const exitApp = useRef(false)
    const onChargerClick = () => {
      console.log('click hua')
      setisModalVisible(true)
    }
    useFocusEffect(
      React.useCallback(() => {
        const backAction = () => {
          if (!exitApp.current) {
            ToastAndroid.show(
              'Please press back again to exit',
              ToastAndroid.SHORT
            )
            exitApp.current = true
  
            setTimeout(() => {
              exitApp.current = false
            }, 2000)
  
            return true // prevent default back button behavior
          } else {
            BackHandler.exitApp()
            return false
          }
        }
  
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction
        )
  
        return () => backHandler.remove()
      }, [])
    )
  
    useEffect(() => {
      // AsyncStorage se data delete karna
      AsyncStorage.removeItem('pid') // 'key' ki jagah aap apne data ke key ko daal sakte hain
        .then(() => {
          console.log('pid successfully deleted from AsyncStorage')
        })
        .catch((error) => {
          console.log('Error deleting data from AsyncStorage:', error)
        })
    }, [])
   
    return (
      <View style={styles.Container}>
        <View style={styles.LogoContainer}>
          <View style={styles.circles}>
            <Circle />
            <Circle />
          </View>
          <View style={styles.LogoWrapper}>
            <Image style={styles.Logo} source={require('../../assets/jouls.png')} />
          </View>
        </View>
        <View style={styles.Charger_SelectionBoxContainer}>
          <View style={styles.Charger_Selection_UpBox}>
            <View style={styles.AskToStart}>
              <View>
                <Text style={styles.headingText}>Choose charging method</Text>
              </View>
              <View>
                <View>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={onChargerClick}
                  >
                    <Text style={styles.link}>Home Charger</Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Newhome')}
                  >
                    <Text style={styles.link}>Public Charger</Text>
                    <Text style={{ color: '#717171' }}>
                      (Apartments, Offices, Semi-public areas)
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.tagNote}>
            <Image
              style={styles.tagNoteImg}
              source={require('../../assets/energy_savings_leaf.png')}
            />
            <Text style={{ color: '#118615' }}>
              Charging an electric vehicle is equivalent to giving a car a breath
              of fresh air
            </Text>
          </View>
        </View>
        <CustomModal
          visible={isModalVisible}
          onClose={() => setisModalVisible(false)}
        >
          <Text>Currently Not Available</Text>
        </CustomModal>
      </View>
    )
  }
  
  export default Charger_Selection
  
  const styles = StyleSheet.create({
    Container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    LogoContainer: {
      backgroundColor: '#fff',
      height: hp(27),
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
    },
    circles: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      position: 'absolute',
  
      gap: 8,
      bottom: hp(-25),
    },
    LogoWrapper: {
      borderRadius: 14,
      elevation: 3,
    },
    Logo: {
      height: hp(9),
      width: wp(40),
      borderRadius: 14,
      resizeMode: 'contain',
      backgroundColor: '#fff',
    },
    Charger_SelectionBoxContainer: {
      flex: 1,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      backgroundColor: '#fff',
      marginTop: -18,
    },
    Charger_Selection_UpBox: {
      flex: 1,
      // marginHorizontal: 16,
      margin: 20,
      marginBottom: 5,
      padding: 20,
      paddingTop: 30,
      borderRadius: 20,
      elevation: 2,
      backgroundColor: 'white',
    },
    AskToStart: {
      flex: 1,
    },
    headingText: {
      fontSize: 22,
      color: '#555454',
      marginBottom: 10,
    },
    button: {
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      height: 90,
      elevation: 2,
      marginVertical: 8,
      borderRadius: 8,
    },
    link: {
     fontWeight: "600",
      fontSize: 22,
      color: '#118615',
    },
    tagNote: {
      height: 60,
      marginHorizontal: 20,
      paddingHorizontal: 10,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    tagNoteImg: {
      height: 40,
      marginRight: 6,
    },
  })
  