import {
    StyleSheet,
    Text,
    View,
    Image,
    Platform,
    TouchableOpacity,
    KeyboardAvoidingView,
    BackHandler,
    ScrollView,
  } from 'react-native'
  import React, { useEffect, useState } from 'react'
  import {
    responsiveHeight as hp,
    responsiveWidth as wp,
    responsiveFontSize as fp,
  } from 'react-native-responsive-dimensions'
  
//   import { redirectToApp } from '../../utility/asyncStorage'
import UpdateRecommend from '../../Modals/Update.modal'
import LoginInput from './login/login'
import SignupInputs from './signin/signin'
import Circle from '../../Component/Circle'
  
  const SignIn = ({ navigation }) => {
    const [login, setLogin] = useState(true)
    const [isModalVisible, setisModalVisible] = useState(false)
    useEffect(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          BackHandler.exitApp() // Back button press par app exit kare
          return true
        }
      )
  
      return () => backHandler.remove()
    }, [navigation])
  
    
  
    return (
      <ScrollView style={styles.Container}>
        <KeyboardAvoidingView
          style={styles.Container}
          behavior={Platform.OS === 'ios' ? 'padding' : '100'}
        >
          <View style={styles.Container}>
            <View style={styles.LogoContainer}>
              <View style={styles.circles}>
                <Circle />
                <Circle />
              </View>
  
              <View style={styles.LogoWrapper}>
                <Image
                  style={styles.Logo}
                  source={require("../../assets/jouls.png")}
                />
              </View>
            </View>
            <View style={styles.SignInBoxContainer}>
              <View style={styles.SignIn_UpBox}>
                <View style={styles.Toggle_Login_SignUp}>
                <Text
                    style={
                      login ? styles.TogglerText : styles.onclickTogglerText
                    }
                    onPress={() => setLogin(true)}
                  >
                    Sign up
                  </Text>
                  <Text style={[{ fontSize: fp(4), color: '#BFBFBF' }]}>|</Text>
                  <Text
                    style={!login ? styles.TogglerText : styles.onclickTogglerText}
                    onPress={() => setLogin(false)}
                  >
                    Login
                  </Text>
                </View>
                <View style={styles.Inputs}>
                  {login ? (
                    <SignupInputs navigation={navigation} />
                  ) : (
                    <LoginInput navigation={navigation} setisModalVisible={setisModalVisible}/>
                  )}
                  <View style={styles.row}>
                    <Text style={styles.message}>
                      {login
                        ? 'Don’t have an account?'
                        : 'Already have an account?'}{' '}
                    </Text>
                    <TouchableOpacity onPress={() => setLogin(!login)}>
                      <Text style={styles.link}>
                        {login ? 'Login' : 'Sign up'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
        <UpdateRecommend
          open={isModalVisible}
        //   handleUpdate={redirectToApp}
        />
      </ScrollView>
    )
  }
  
  export default SignIn
  
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
    SignInBoxContainer: {
      flex: 1,
      minHeight: hp(75),
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      // backgroundColor: 'red',
      backgroundColor: '#fff',
      marginTop: -18,
      justifyContent: 'center',
    },
    SignIn_UpBox: {
      flex: 1,
      margin: 20,
      borderRadius: 20,
      padding: 20,
      elevation: 2,
      backgroundColor: '#fff',
    },
    Toggle_Login_SignUp: {
      flexDirection: 'row',
      elevation: 1,
      backgroundColor: '#fff',
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    TogglerText: {
      padding: 12,
      color: 'green',
      fontSize: fp(2),
      fontFamily: 'Rubik',
    },
    onclickTogglerText: {
      padding: 12,
      color: 'black',
      fontSize: fp(2),
      fontFamily: 'Rubik',
    },
    Inputs: {
      // flex: 1,
      // marginHorizontal: 20,
      // justifyContent: 'center',
    },
    row: {
      flexDirection: 'row',
      marginTop: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    message: {
      color: 'black',
    },
    link: {
      fontWeight: 'bold',
      color: 'green',
      textDecorationLine: 'underline',
    },
  })
  