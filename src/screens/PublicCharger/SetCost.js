import {
    StyleSheet,
    Text,
    View,
    // Modal,
    Image,
    TouchableOpacity,
    TextInput,
    Alert,
  } from 'react-native'
  import {
    responsiveHeight as hp,
    responsiveWidth as wp,
    responsiveFontSize as fp,
  } from 'react-native-responsive-dimensions'
  import React, { useEffect, useState } from 'react'
  
  import { useDispatch, useSelector } from 'react-redux'
  import {
      ChargerHistory,
    publicstartCharging,
  } from '../../redux/Action'
  import RazorpayCheckout from 'react-native-razorpay'
  import Modal from 'react-native-modal'
  import SetCostRecommend from './SetCostRecommend'
  import { Checkbox } from 'react-native-paper'
import CustomModal from '../../Modals/Custom.modal'
import { fetchDataAsyncStorageData } from '../../utility'
  
  const razorpayLogo =
    'https://res.cloudinary.com/ddvb5pl1p/image/upload/v1715073770/vks1ypuudvmxwqz7ub88.png'
  
  const resizeImage = (source, width, height) => {
    return `${source}?width=${width}&height=${height}`
  }
  
  const SetCost = ({
    open,
    onClose,
    startTimer,
    inputvalue,
    setButtonText,
    SetTimeinSec,
    setOnStopChargingCost,
    SetstartTime,
    setcheckChargingStarted,
    handleStopCharging,
    setinputcostfromsetcost,
    chargingUnitsfromsetCost,
    setchargingUnitsfromsetCost,
    setGetSampledata,
    setisChargingAlertVisible,
    ChargingEnergy,
    setShowPaymentCompleteModal,
    animateNextWord,
    setisPowerCutTextVisible,
  }) => {
    const dispatch = useDispatch()
    const [ShowSetCost, SetShowSetCost] = useState(true)
    const [inputCost, setInputCost] = useState('')
    const [Time, settime] = useState('')
    const [isModalVisible, setisModalVisible] = useState(false)
    const [amountValuePresent, setAmountValuePresent] = useState({
      show: false,
      message: '',
    })
  
    // const [walletValue,setWalletValue]=useState("10")
    const [rememberMe, setRememberMe] = useState(true)
    console.log('rememberMe', rememberMe)
    let findchargingCost = useSelector(
      (state) => state.userReducers.setchargingcost
    )
    console.log('findchargingCost', findchargingCost)
    let findchargingCostPerHour = useSelector(
      (state) => state.userReducers.setchargingcostperhour
    )
    let findChargingEnergy = useSelector((state) => state.userReducers.SetEnergy)
    let walletValue = useSelector((state) => state.userReducers.WallentBalance)
    let DeviceToken = useSelector((state) => state.userReducers.deviceToken)
    // console.log("DeviceTokenDeviceToken",DeviceToken);
    if (!findchargingCost || findchargingCost == '0') {
      findchargingCost = 10
    }
    if (!findchargingCostPerHour || findchargingCostPerHour == '0') {
      findchargingCostPerHour = 10
    }
    console.log('findcharingfindcharing', findChargingEnergy)
  
    useEffect(() => {
      // console.log("openopen",open);
      if (open) {
        setInputCost('')
      }
    }, [open])
  
    console.log('inpucostinputcost', inputCost)
    useEffect(() => {
      setDataToParent()
    }, [inputCost, findchargingCost])
  
    const setDataToParent = () => {
      setinputcostfromsetcost(inputCost)
      // const data= Math.ceil((inputCost / findchargingCost) * 100) / 100
      const data = inputCost / findchargingCost
  
      console.log('datadatadata', data)
      setchargingUnitsfromsetCost(data)
      setGetSampledata(true)
    }
  
    const handlePayment = async () => {
      if (inputCost <= 0 || !inputCost) {
        setAmountValuePresent((prev) => ({
          ...prev,
          show: true,
          message: 'Please enter a valid amount',
        }))
        return
        // Alert.alert('Please set the cost of charging first')
      } else {
        setAmountValuePresent((prev) => ({
          ...prev,
          show: false,
          message: '',
        }))
      }
  
      const { storedData } = await fetchDataAsyncStorageData()
      if (!storedData) {
        Alert.alert('Scan please')
        return
      }
  
      if (walletValue === '0' || Number(walletValue) === 0 || !rememberMe) {
        const options = getPaymentOptions(inputCost)
        try {
          const data = await RazorpayCheckout.open(options)
          if (data && data.razorpay_payment_id) {
            handlePaymentSuccess(
              inputCost,
              storedData,
              data.razorpay_payment_id,
              0
            )
          }
        } catch (error) {
          handlePaymentError(error)
        }
      } else if (Number(inputCost) <= Number(walletValue)) {
        handleWalletPayment(inputCost, storedData)
      } else if (Number(inputCost) > Number(walletValue) && walletValue != 0) {
        handlePartialPayment(inputCost, walletValue, storedData)
      }
    }
  
    const getPaymentOptions = (cost) => ({
      description: 'Payment for your order',
      image: razorpayLogo,
      currency: 'INR',
      key: 'rzp_live_V4Palfsx7GsPm3',
      amount: cost * 100,
      name: 'Jouls Ecotech Pvt Ltd',
      prefill: {
        email: 'customer@example.com',
        contact: '9999999999',
        name: 'Customer Name',
      },
      theme: { color: '#118615' },
    })
  
    const handlePaymentSuccess = async (
      payment,
      productKey,
      paymentId,
      walletUse
    ) => {
      console.log('call handlePaymentSuccess')
  
      onClose()
      const sendData = {
        payment,
        inputCost: payment,
        Porduct_Key: productKey,
        paymentId,
        findchargingCost,
        WalletUse: walletUse.toString(),
        DeviceToken: DeviceToken || '',
      }
      setShowPaymentCompleteModal(false)
      setisChargingAlertVisible(true)
  
      const response = await dispatch(ChargerHistory(sendData))
      console.log('responseresponse', response)
      if (response?.message === 'ChargerHistory added successfully') {
        animateNextWord()
        startCharging()
      }
      // else if(response.message==""){
      //   console.log("respone",response);
      // }
    }
  
    const handleWalletPayment = async (cost, productKey) => {
      console.log('call handleWalletPayment')
  
      onClose()
      const sendData = {
        payment: '0',
        inputCost: cost,
        Porduct_Key: productKey,
        paymentId: 'Paid Using Wallet',
        findchargingCost,
        WalletUse: cost.toString(),
        DeviceToken: DeviceToken || '',
      }
      setShowPaymentCompleteModal(false)
      setisChargingAlertVisible(true)
  
      const response = await dispatch(ChargerHistory(sendData))
      console.log('callhandleWalletPaymentcallhandleWalletPayment', response)
  
      if (response?.message === 'ChargerHistory added successfully') {
        animateNextWord()
        startCharging()
      }
      // else if (response?.message === 'PID not found'){
      //   console.log("please scan");
      // setisChargingAlertVisible(false)
  
      // }
    }
  
    const handlePartialPayment = async (cost, walletValue, productKey) => {
      console.log('call handlePartialPayment')
      const options = getPaymentOptions(cost - walletValue)
      try {
        const data = await RazorpayCheckout.open(options)
        if (data && data.razorpay_payment_id) {
          handlePaymentSuccess(
            cost - walletValue,
            productKey,
            data.razorpay_payment_id,
            walletValue
          )
        }
      } catch (error) {
        handlePaymentError(error)
      }
    }
  
    const handlePaymentError = (error) => {
      console.log('Payment Error:', error)
      Alert.alert('Payment Failed', 'Payment failed. Please try again.')
    }
  
    const startCharging = async (paymentId) => {
      const { storedData } = await fetchDataAsyncStorageData()
      if (!storedData) {
        Alert.alert('scan please')
        return
      }
      
      console.log('heklo')
      if (inputCost > 0 || Time) {
        console.log('click hus')
        dispatch(
          publicstartCharging(
            storedData,
            onClose,
            startTimer,
            setButtonText,
            SetstartTime,
            setcheckChargingStarted,
            handleStopCharging,
            inputCost,
            paymentId,
            ChargingEnergy,
            findchargingCost,
            setisChargingAlertVisible,
            setShowPaymentCompleteModal,
            animateNextWord,
            setisPowerCutTextVisible
          )
        )
      } else {
        Alert.alert('Please set the cost of charging first')
      }
    }
  
    const onclicksetcostSetTime = (text) => {
      if (text == 'setcost') {
        SetShowSetCost(true)
        settime('')
        setInputCost('')
        SetTimeinSec('')
      }
      if (text == 'setTime') {
        setisModalVisible(true)
        
      }
    }
    return (
      <Modal
        // isVisible={true}
        isVisible={open}
        onSwipeComplete={onClose}
        swipeDirection={'down'}
        onBackdropPress={onClose}
        onBackButtonPress={onClose}
        style={styles.modal}
        animationOut={'slideOutDown'}
      >
        <View style={styles.container}>
          <View style={styles.contents}>
            <View style={styles.cancelButton}>
              <TouchableOpacity onPress={onClose}>
                <Image source={require('../../assets/cancel.png')} />
              </TouchableOpacity>
            </View>
            <View style={styles.contentBox}>
              <View>
                <View style={styles.Toggle_SetCost_SetTime}>
                  <TouchableOpacity
                    onPress={() => {
                      onclicksetcostSetTime('setcost')
                    }}
                  >
                    <Text
                      style={[
                        styles.TogglerText,
                        { color: ShowSetCost ? '#118615' : '#5B5B5B' },
                      ]}
                    >
                      Set Cost
                    </Text>
                  </TouchableOpacity>
                  
                </View>
                <View>
                  {ShowSetCost ? (
                    <ChargingCost
                      setInputCost={setInputCost}
                      inputCost={inputCost}
                      findchargingCost={findchargingCost}
                      setinputcostfromsetcost={setinputcostfromsetcost}
                      chargingUnitsfromsetCost={chargingUnitsfromsetCost}
                      handlePayment={handlePayment}
                      walletValue={walletValue}
                      rememberMe={rememberMe}
                      setRememberMe={setRememberMe}
                      amountValuePresent={amountValuePresent}
                    />
                  ) : (
                    <></>
                  )}
                </View>
              </View>
              <View style={styles.paymentBox}>
                {/* <TouchableOpacity
                  style={{
                    width: 110,
                    alignItems: 'center',
                    justifyContent: 'center',
                    // marginTop: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Image source={require('../../assets/paytm.png')} />
  
                    <Text style={{ color: '#9A9999' }}>Pay Using</Text>
                    <Image source={require('../../assets/arrow_drop_up.png')} />
                  </View>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'sans-serif',
                      marginLeft: -40,
                      color: '#636363',
                    }}
                  >
                    Razorpay
                  </Text>
                </TouchableOpacity> */}
                <TouchableOpacity
                  style={styles.payButton}
                  onPress={handlePayment}
                  // onPress={startCharging}
                >
                  <View>
                    {/* <Text style={styles.payButtonText}>₹{inputCost}</Text> */}
                    <Text style={styles.payButtonText}>
                      ₹
                      {!rememberMe
                        ? inputCost
                        : rememberMe &&
                          Number(inputCost) - Number(walletValue) <= 0
                        ? 0
                        : rememberMe && Number(inputCost) - Number(walletValue)}
                    </Text>
  
                    {/* <Text style={[styles.payButtonText, { fontSize: 11 }]}>
                      TOTAL
                    </Text> */}
                  </View>
                  <View>
                    <Text style={[styles.payButtonText, { fontSize: 17 }]}>
                      Pay Charge
                    </Text>
                    {/* <Text style={styles.payButtonText}>Charge</Text> */}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.bottomColorBox}></View>
          </View>
          <CustomModal
            visible={isModalVisible}
            onClose={() => setisModalVisible(false)}
          >
            <Text>Currently Not Available</Text>
          </CustomModal>
        </View>
      </Modal>
    )
  }
  
  const ChargingCost = ({
    setInputCost,
    inputCost,
    findchargingCost,
    setinputcostfromsetcost,
    chargingUnitsfromsetCost,
    handlePayment,
    walletValue,
    rememberMe,
    setRememberMe,
    amountValuePresent,
  }) => {
    // const [rememberMe, setRememberMe] = useState(true)
  
    console.log(findchargingCost, 'chargincost in chargingcost')
    const handleinputchangecost = (text) => {
      // if (/^\d*$/.test(text)) {
      //   setInputCost(text);
      // }
      setInputCost(text.trim())
      // setinputcostfromsetcost(text)
    }
  
    const [isModalVisible, setIsModalVisible] = useState(false)
  
    const toggleModal = () => {
      setIsModalVisible(!isModalVisible)
    }
  
    return (
      <View style={{ marginVertical: 10 }}>
        <Text
          style={{
            color: '#6C6C6C',
            fontSize: 19,
            fontWeight: '600',
          }}
        >
          Enter Amount
        </Text>
        <View
          style={{
            marginTop: 5,
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: '#C8C8C8',
            borderRadius: 10,
            paddingHorizontal: 10,
          }}
        >
          <TextInput
            style={{
              color: 'black',
              fontSize: 15,
              height: 45,
            }}
            placeholderTextColor={'#DBDBDB'}
            keyboardType="numeric"
            placeholder="Enter the Charging Cost"
            onChangeText={(text) => {
              handleinputchangecost(text)
            }}
            value={inputCost.toString()}
          />
        </View>
        {amountValuePresent.show && (
          <Text style={{ color: 'red', marginLeft: 5 }}>
            {amountValuePresent.message}
          </Text>
        )}
        <Text
          style={{
            color: '#6C6C6C',
            fontSize: 15,
            marginVertical: 5,
            fontWeight: '400',
            marginTop: 7,
          }}
        >
          Cost of Charging : ₹{findchargingCost} per Kwh (per Unit)
        </Text>
        <Text
          style={{
            color: '#6C6C6C',
            fontSize: 16,
            fontWeight: "400",
            marginTop: 5,
          }}
        >
          {/* {Math.ceil((inputCost / findchargingCost) * 100) / 100} */}
          {/* Charging Units - {chargingUnitsfromsetCost} kwh */}
          Charging Units - {Math.round(chargingUnitsfromsetCost * 1000) /
            1000}{' '}
          kwh
        </Text>
        <TouchableOpacity onPress={toggleModal}>
          <Text
            style={{
              color: '#118615',
              fontSize: 13,
              fontWeight: '600',
              marginTop: 8,
              textDecorationLine: 'underline',
            }}
          >
            Get Charging Cost
          </Text>
        </TouchableOpacity>
  
        <View style={styles.checkboxContainer}>
          <Checkbox.Android
            status={rememberMe ? 'checked' : 'unchecked'}
            onPress={() => setRememberMe(!rememberMe)}
            // uncheckedColor={theme.colors.primary}
            color={'#118615'}
            style={{ padding: 0, marginLeft: 0 }}
          />
          <Text style={styles.rememberMeText}>
            Use the credits from your wallet : ₹ {walletValue}
          </Text>
        </View>
  
        <View>
          <SetCostRecommend
            setInputCost={setInputCost}
            open={isModalVisible}
            onClose={toggleModal}
            CostofCharging={findchargingCost}
            chargingUnitsfromsetCost={chargingUnitsfromsetCost}
            handlePayment={handlePayment}
            walletValue={walletValue}
            rememberMe={rememberMe}
            setRememberMe={setRememberMe}
          />
        </View>
      </View>
    )
  }
  

  
  export default SetCost
  
  const styles = StyleSheet.create({
    modal: {
      margin: 0,
    },
    container: {
      flex: 1,
      // backgroundColor: 'rgba(0, 0, 0, 0.76)',
    },
    setTimeContainer: {
      marginTop: 25,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    contents: {
      position: 'absolute',
      bottom: 0,
      backgroundColor: '#fff',
      padding: 20,
      height: hp(70),
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      width: '100%',
    },
    cancelButton: {
      alignSelf: 'flex-end',
    },
    contentBox: {
      marginVertical: 20,
      padding: 20,
      backgroundColor: '#fff',
      height: hp(55),
      elevation: 2,
      borderRadius: 10,
      justifyContent: 'space-between',
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: -10,
      marginTop: 5,
    },
    rememberMeText: {
      fontSize: 14,
      color: '#6C6C6C',
    },
    Toggle_SetCost_SetTime: {
      flexDirection: 'row',
      height: 40,
      paddingHorizontal: 5,
      elevation: 1,
      backgroundColor: '#fff',
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    TogglerText: {
      color: '#5B5B5B',
      fontSize: fp(2.7),
    },
    paymentBox: {
      flexDirection: 'row',
      alignContent: 'center',
      marginTop: 10,
      // backgroundColor: 'red',
    },
    payButton: {
      flex: 1,
      flexDirection: 'row',
      borderRadius: 15,
      width: 40,
      justifyContent: 'center',
      alignItems: 'center',
      // backgroundColor: 'red',
      // alignItems: 'center',
      // borderRadius: 8,
      // marginTop: 30,
      padding: 10,
      height: 60,
      // marginTop: 20,
      backgroundColor: 'green',
    },
    payButtonText: {
      fontSize: fp(2.6),
      color: '#fff',
      marginLeft:10
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
    button: {
      backgroundColor: '#FFFFFF', // White background color
      padding: 8,
      borderRadius: 8,
      alignItems: 'flex-start', // Align text to the left
      borderWidth: 1, // Add black border
      borderColor: '#9B9B9B', // Black border color
      width: 80,
      justifyContent: 'center',
      // paddingHorizontal: 8,
      // height: 50,
    },
    activeButton: {
      borderColor: 'green',
      borderWidth: 2,
      backgroundColor: '#C1E0C2',
      color: 'white',
    },
  })
  