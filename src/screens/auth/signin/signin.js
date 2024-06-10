import React, { useState } from 'react'
import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import {
  responsiveHeight as hp,
  responsiveWidth as wp,
  responsiveFontSize as fp,
} from 'react-native-responsive-dimensions'
import { useDispatch, useSelector } from 'react-redux'
import { loginuser } from '../../../redux/Action'
import InputBox from '../../../Component/inputBox'

const SignupInputs = ({ navigation }) => {
  const [loading, setLoading] = useState(false)
  const [userData, setuserData] = useState({
    Name: '',
    Email: '',
    Password: '',
    ConfirmPassword: '',
  })
  const dispatch = useDispatch()

  const version=useSelector((state)=> state?.userReducers?.versionName)
  const FcmToken=useSelector((state)=> state?.userReducers?.deviceToken)

  const [nameValuePresent, setNameValuePresent] = useState({
    show: false,
    message: '',
  })
  const [emailValuePresent, setEmailValuePresent] = useState({
    show: false,
    message: '',
  })
  const [passwordValuePresent, setPasswordValuePresent] = useState({
    show: false,
    message: '',
  })
  const [confirmPasswordValuePresent, setConfirmPasswordValuePresent] =
    useState({
      show: false,
      message: '',
    })

    const validateName = () => {
      if (!userData.Name) {
        setNameValuePresent({ show: true, message: 'Please enter a valid Name' })
        return false
      } else if (userData.Name.length <= 3) {
        setNameValuePresent({ show: true, message: 'Name must be at least 3 characters' })
        return false
      } else {
        setNameValuePresent({ show: false, message: '' })
        return true
      }
    }
    
    const validateEmail = () => {
      if (!userData.Email) {
        setEmailValuePresent({ show: true, message: 'Please enter a valid email address' })
        return false
      } else {
          setEmailValuePresent({ show: false, message: '' })
          return true
      }
    }
    
    const validatePassword = () => {
      if (!userData.Password) {
        setPasswordValuePresent({ show: true, message: 'Please enter a password' })
        return false
      } else if (userData.Password.length < 4) {
        setPasswordValuePresent({ show: true, message: 'Password must be at least 4 characters long' })
        return false
      } else {
        setPasswordValuePresent({ show: false, message: '' })
        return true
      }
    }
    
    const validateConfirmPassword = () => {
      if (!userData.ConfirmPassword) {
        setConfirmPasswordValuePresent({ show: true, message: 'Please enter a Confirm password' })
        return false
      } else if (userData.Password !== userData.ConfirmPassword) {
        setConfirmPasswordValuePresent({ show: true, message: 'Password and Confirm password do not match' })
        return false
      } else {
        setConfirmPasswordValuePresent({ show: false, message: '' })
        return true
      }
    }
    
    
    const signup = async () => {
      if (!validateName() || !validateEmail() || !validatePassword() || !validateConfirmPassword()) {
        return
      }
    
      const allValuesEmpty = Object.values(userData).every(value => value !== '')
    
      if (allValuesEmpty) {
        try {
          setLoading(true)
          const response =await dispatch(loginuser(userData,version,FcmToken,navigation, setLoading))
          if(response){
            setuserData({ Name: '', Email: '', Password: '', ConfirmPassword: '' })
          }
          console.log("response",response);
        } catch (error) {
          console.log('Error in signup in signupinputs component', error)
        }
      }
    }
    

  return (
    <View style={styles.container}>
      <View style={styles.inputsContainer}>
        <View>
          <InputBox
            label="Name"
            placeholder="Enter your name"
            value={userData.Name}
            setValue={setuserData}
            objectData={userData}
            CheckValuePresent={nameValuePresent.show}
          />
          {nameValuePresent.show && (
            <Text style={styles.errorText}> {nameValuePresent.message}</Text>
          )}
        </View>
        <View>
          <InputBox
            label="Email"
            placeholder="Enter your mail id"
            value={userData.Email}
            setValue={setuserData}
            objectData={userData}
            CheckValuePresent={emailValuePresent.show}
          />

          {emailValuePresent.show && (
            <Text style={{ color: 'red', marginLeft: 10 }}>
              {emailValuePresent.message}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.passwordContainer}>
        <View style={{ width: '48%' }}>
          <InputBox
            label="Password"
            placeholder="Enter your password"
            value={userData.Password}
            setValue={setuserData}
            objectData={userData}
            CheckValuePresent={passwordValuePresent.show}
          />
          {passwordValuePresent.show && (
            <Text style={{ color: 'red', marginLeft: 10 }}>
              {passwordValuePresent.message}
            </Text>
          )}
        </View>

        <View style={{ width: '48%' }}>
          <InputBox
            label="ConfirmPassword"
            placeholder="Enter password"
            value={userData.ConfirmPassword}
            setValue={setuserData}
            objectData={userData}
            CheckValuePresent={confirmPasswordValuePresent.show}
          />
          {confirmPasswordValuePresent.show && (
            <Text style={styles.errorText}>
              {confirmPasswordValuePresent.message}
            </Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={styles.SignupButton}
        onPress={signup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="green" />
        ) : (
          <Text style={styles.SignupButtonText}>Sign up</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.TermsAndConditions}>
        By Signing up you agree to
        <Text style={{ color: 'green', textDecorationLine: 'underline' }}>
          Terms & Conditions
        </Text>
      </Text>
     
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // marginBottom: 10,
    // backgroundColor: 'pink',
  },
  inputsContainer: {
    // marginVertical: 8,
    color: 'black',
  },
  input: {
    borderRadius: 8,
    height: 40,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    // backgroundColor: 'red',
    justifyContent: 'space-between',
    flexDirection: 'row',
    // width: wp(37.5),
    // flexWrap: 'wrap',
    gap: 10,
  },
  SignupButton: {
    // backgroundColor: 'red',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 30,
    padding: 10,
    borderWidth: 2,
    borderColor: 'green',
  },
  SignupButtonText: {
    fontSize: fp(2.6),
    color: 'green',
  },
  TermsAndConditions: {
    fontSize: fp(1.5),
    paddingTop: 10,
    textAlign: 'center',
    color: 'black',
  },
  errorText: {
    color: 'red',
    marginLeft: 10,
  },
  ortext: {
    padding: 12,
    fontSize: fp(3),
    textAlign: 'center',
    color: '#8B8B8B',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButton: {
    padding: 8,
    marginHorizontal: 8,
    // borderWidth: 1,
    borderRadius: 8,
    elevation: 2,
    backgroundColor: '#fff',
  },
  socialIconWrapper: {
    // padding: 5,
  },
})

export default SignupInputs
