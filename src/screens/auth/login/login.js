import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import {
  responsiveHeight as hp,
  responsiveWidth as wp,
  responsiveFontSize as fp,
} from 'react-native-responsive-dimensions'
import { useDispatch, useSelector } from 'react-redux'
import InputBox from '../../../Component/inputBox'
import { signItUp } from '../../../redux/Action'

const LoginInput = ({ navigation,setisModalVisible }) => {
  const ApiURL = 'http://23.22.111.5:5000' // live url

  const version=useSelector((state)=> state?.userReducers?.versionName)

  const [loading, setLoading] = useState(false)
  const [userData, setuserData] = useState({ email: '', password: '' })
  const [emailValuePresent, setEmailValuePresent] = useState({
    show: false,
    message: '',
  })
  const [passwordValuePresent, setPasswordValuePresent] = useState({
    show: false,
    message: '',
  })
  const [rememberMe, setRememberMe] = useState(true)
  const dispatch = useDispatch()

  const login = async () => {
    const allValuesPresent = Object.keys(userData).every(
      (key) => userData[key] !== ''
    )
    if (!userData.email) {
      setEmailValuePresent((prev) => ({
        ...prev,
        show: true,
        message: 'Please enter a valid email address',
      }))
      setPasswordValuePresent((prev) => ({
        ...prev,
        show: false,
        message: '',
      }))
      return
    }

    if (!userData.password) {
      setEmailValuePresent((prev) => ({
        ...prev,
        show: false,
        message: '',
      }))
      setPasswordValuePresent((prev) => ({
        ...prev,
        show: true,
        message: 'Please enter a password',
      }))
      return
    }

    const isValidpassword = isPasswordValid(userData.password)
    // console.log(isValid) // Output: true
    if (!isValidpassword) {
      setEmailValuePresent((prev) => ({
        ...prev,
        show: false,
        message: '',
      }))
      setPasswordValuePresent((prev) => ({
        ...prev,
        show: true,
        message: 'Password must be at least 4 characters long',
      }))
      return
    }

    if (allValuesPresent) {
      try {
        setLoading(true)
        const response = await dispatch(
          signItUp(userData,setisModalVisible,version, navigation, setLoading)
        )
        console.log('clickinoginbuttonresponse', response)
        if (response) {
          setuserData({ ...userData, email: '', password: '' })
        }
        setEmailValuePresent((prev) => ({
          ...prev,
          show: false,
          message: '',
        }))
        setPasswordValuePresent((prev) => ({
          ...prev,
          show: false,
          message: '',
        }))
        setTimeout(() => {
          setLoading(false)
        }, 5000)
      } catch (error) {
        console.error('error in login user', error)
      }
    }
  }

  const isPasswordValid = (password) => {
    // Password length should be at least 8 characters
    if (password.length < 4) {
      return false
    }

   
    return true
  }

  

  
  return (
    <View style={styles.container}>
      <View style={styles.inputsContainer}>
        <View>
          <InputBox
            label="email"
            placeholder="Enter your mail id"
            value={userData.email}
            setValue={setuserData}
            objectData={userData}
            CheckValuePresent={emailValuePresent.show}
          />
        </View>
        {emailValuePresent.show && (
          <Text style={{ color: 'red', marginLeft: 10 }}>
            {emailValuePresent.message}
          </Text>
        )}
        <View>
          <InputBox
            label="password"
            placeholder="Enter your password"
            value={userData.password}
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
      </View>
      <View style={styles.forgotRememberContainer}>
        <TouchableOpacity
       
        >
          <Text style={styles.forgot}>Forgot password?</Text>
        </TouchableOpacity>
        
      </View>
      <TouchableOpacity
        style={styles.SignupButton}
        onPress={login}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="green" />
        ) : (
          <Text style={styles.SignupButtonText}>Login</Text>
        )}
      </TouchableOpacity>

      <View style={styles.socialButtonsContainer}>
      
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'red',
    // flex: 1,
    // Adjust container styles if needed
  },

  inputsContainer: {
    // marginVertical: 8,
  },
  input: {
    borderRadius: 8,
    height: 40,
    backgroundColor: '#fff',
  },
  forgotRememberContainer: {
    width: '100%',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    marginTop: 10,
  },
  forgot: {
    color: 'green',
    textDecorationLine: 'underline',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  SignupButton: {
    alignItems: 'center',
    borderRadius: 8,
    padding: 10,
    borderWidth: 2,
    borderColor: 'green',
  },
  SignupButtonText: {
    fontSize: fp(2.6),
    color: 'green',
  },
  ortext: {
    padding: 15,
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

    borderRadius: 8,
    elevation: 2,
    backgroundColor: '#fff',
  },
  rememberMeText: {
    color: 'black',
  },
})

export default LoginInput

