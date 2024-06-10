import {
    ActivityIndicator,
    Alert,
    Button,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
  } from 'react-native'
  import React, { useEffect, useRef, useState } from 'react'
  import AsyncStorage from '@react-native-async-storage/async-storage'
  import { useDispatch, useSelector } from 'react-redux'
  import {
    getUserData,
    publicAlreadyChargingStarted,
    publicstopCharging,
    setChargerHistoryPid,
    setChargingStarted,
    setModal,
  } from '../../redux/Action'
  import SetCost from './SetCost'
  import Wave from './Wave'
 // import CustomModal7Sec from '../../components/ChargingMessage7sec'
import HomeScreenCircles from '../../Component/HomeScreenCircle'
import App_top_Header from '../../Component/App_top_Header'
import ChargingAlertModal from '../../Modals/Charging_alert.modal'
import { fetchDataAsyncStorageData } from '../../utility'
  
  const Newhome = ({ navigation }) => {
    const dispatch = useDispatch()
    // for 10 min not click start charging
    const [buttonPressed, setButtonPressed] = useState(false)
    const [timerExpired, setTimerExpired] = useState(false)
    const [inputcostfromsetcost, setinputcostfromsetcost] = useState('')
    const [chargingUnitsfromsetCost, setchargingUnitsfromsetCost] = useState('')
    const [ShowChargingCostPerSecond, SetShowChargingCostPerSecond] = useState('')
    const [buttonText, setButtonText] = useState('')
    const [AsyncStoragePiddata, setAsyncStoragePiddata] = useState()
    const [colorChange, setColorChange] = useState('#DBDBDB')
    const [IsChargingStartedValue, setIsChargingStartedValue] = useState(false)
    const [ChargingEnergy, setChargingEnergy] = useState('')
    const [ChargingCost, setChargingCost] = useState('')
    const [checkChargingStarted, setcheckChargingStarted] = useState(false)
    const [name, setName] = useState('User')
    const [isTimerRunning, setIsTimerRunning] = useState(false)
    const [isCharginAlertVisible, setisChargingAlertVisible] = useState(false)
    const [totalSeconds, setTotalSeconds] = useState(0)
  
    const [timeInSec, SetTimeinSec] = useState('')
    const [showChargingEnergy, setShowChargingEnergy] = useState(false)
    const [showPaymentCompleteModal, setShowPaymentCompleteModal] =
      useState(false)
    // charingalert modal
    const [isPowerCutTextVisible, setisPowerCutTextVisible] = useState(false)
    const [shouldAnimate, setShouldAnimate] = useState(true)
    const [currentWordIndex, setCurrentWordIndex] = useState(0)
    const words = ['Payment Successful', 'Starting..', 'Charging Started']
    
    // stop charging loader
    const [isloadershow, setIsloaderShow] = useState(false)
  
    // use for 7 sec modal
    const timerRefs = useRef([null, null, null, null]);
    const [modalVisible7Sec, setModalVisible7Sec] = useState(false);
    const [currentIndex7Sec, setCurrentIndex7Sec] = useState(0);
    //
    const [getsample, setGetSampledata] = useState(true)
    const [totalTime, setTotalTime] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
  
    const [isModalOpen, setIsModalOpen] = useState(false)
  
    // const [buttonText,setButtonText]=useState("Scan QR")
    const [onstoChargingCost, setOnStopChargingCost] = useState('')
    const [startTime, SetstartTime] = useState(1)
    const [EndTime, SetEndTime] = useState(4)
    const [checkStopbuttonClick, setStopButtonClick] = useState(true)
    const [sendDataToChart, setSendDataToChart] = useState([])
  
    let ModalOpenValue = useSelector(
      (state) => state?.userReducers?.IsSetCostModalOpen
    )
  
    let chargerhistoryData = useSelector(
      (state) => state?.userReducers?.ChargerHistoryData
    )
    let checkChargingStartedBool = useSelector(
      (state) => state?.userReducers?.checkChargingStarted
    )
    let chargingHistoryPId = useSelector(
      (state) => state?.userReducers?.chagerPid
    )
  
    let SampleDataaa = useSelector((state) => state?.userReducers?.SetEnergy)
    const SamplePowerData = useSelector((state) => state?.userReducers?.SetPower)
    const SampleOutputCurrent = useSelector(
      (state) => state?.userReducers?.SetCurrent
    )
  
    console.log(
      'timeinsecinputcostfromsetcost',
      inputcostfromsetcost,
      chargingUnitsfromsetCost
    )
  
    useEffect(() => {
      if (checkChargingStartedBool && chargingHistoryPId) {
        const totalTime = formatTime(totalSeconds)
        dispatch(
          publicAlreadyChargingStarted(
            chargingHistoryPId,
            handleCostAndTimeOpen,
            setisChargingAlertVisible,
            setShowPaymentCompleteModal,
            setisPowerCutTextVisible,
            handleButtonClick7Sec,
            CloseModal7sec
          )
        )
        console.log('chargerhistoryData', chargerhistoryData)
        if (chargerhistoryData.length > 0) {
          setinputcostfromsetcost(chargerhistoryData[0].inputCost || '0')
          setchargingUnitsfromsetCost(
            chargerhistoryData[0].totalChargingUnits || '0'
          )
          const seconds = ChargingHistoryTime(chargerhistoryData)
          console.log('seconds', seconds)
          setTotalSeconds(seconds)
          setIsTimerRunning(true)
        }
        // setcheckChargingStarted(true)
        setColorChange('#118615')
        setShowChargingEnergy(true)
        setButtonPressed(true)
        setButtonText('Stop Charging')
      }
    }, [checkChargingStartedBool, chargingHistoryPId])
  
    useEffect(() => {
      let interval
      if (isTimerRunning) {
        interval = setInterval(() => {
          setTotalSeconds((prevTotalSeconds) => prevTotalSeconds + 1)
          // if(timeInSec && inputcostfromsetcost){
          //   const prev=inputcostfromsetcost*totalSeconds/timeInSec
          //   const parsedA = parseFloat(prev);
          //   const roundedA = parsedA.toFixed(3);
          //   SetShowChargingCostPerSecond(roundedA.toString());
          // }
        }, 1000)
      } else {
        clearInterval(interval)
      }
      return () => clearInterval(interval) // Cleanup interval on component unmount
    }, [isTimerRunning, inputcostfromsetcost])
  
    useEffect(() => {
      if (!inputcostfromsetcost || !ChargingCost) {
        if (
          inputcostfromsetcost &&
          ChargingCost &&
          (timeInSec.length <= 0 || !timeInSec) &&
          inputcostfromsetcost <= ChargingCost
        ) {
          // handleClickStopCharging()
          console.log('charging cost stop charing')
        }
      }
  
      if (
        timeInSec.length > 0 &&
        timeInSec &&
        inputcostfromsetcost &&
        ShowChargingCostPerSecond &&
        inputcostfromsetcost <= ShowChargingCostPerSecond
      ) {
        // handleClickStopCharging()
      }
    }, [ChargingCost, ShowChargingCostPerSecond])
  
    useEffect(() => {
      if (showChargingEnergy) {
        // setChargingEnergy(SampleDataaa)
        // if (SampleDataaa.toString().length > 0 && timeInSec.length<=0) {
        if (
          SampleDataaa.length > 0 &&
          inputcostfromsetcost &&
          chargingUnitsfromsetCost
        ) {
          // let a = (parseInt(SampleDataaa) * setcost from app ) / enery input pr automatic calucaltue ho ke jo rhi hai 0.84*1000
          //10*1000/15  15- set cost from app
          // 10 --- user
          let a =
            (SampleDataaa * inputcostfromsetcost) /
            (chargingUnitsfromsetCost * 1000)
          // a = Math.floor(a * 100) / 100
          console.log('abcdefghiradhe', a, SampleDataaa, chargingUnitsfromsetCost)
          setChargingCost(a)
        }
      }
  
      // if (SampleOutputCurrent < 0.1) {
      //   const totalEnergyTime = formatTime(totalSeconds)
      //   dispatch(publicstopCharging(data, totalEnergyTime, SetEndTime,SampleDataaa))
      //   setcheckChargingStarted(false)
      //   setGetSampledata(false)
      //   handleResetClick()
      //   setButtonText('Scan QR')
      //   setChargingEnergy('')
      //   setChargingCost('')
      //      setinputcostfromsetcost("")
      //   handleRemoveItem()
      //   setData('')
      // }
    }, [
      SampleDataaa,
      SampleOutputCurrent,
      inputcostfromsetcost,
      chargingUnitsfromsetCost,
      showChargingEnergy,
    ])
  
    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', async () => {
        // Adding async here
        const { storedData, ChargingStartedValue } =
          await fetchDataAsyncStorageData() // Wait for the Promise to resolve
  
        // if(ChargingStartedValue){
        //   setIsChargingStartedValue(ChargingStartedValue)
        //   setButtonText("Stop Charging")
        //   // return
        // }
        if (!checkChargingStartedBool) {
          if (storedData) {
            setColorChange('#118615')
            setButtonText('Start Charging')
            setAsyncStoragePiddata(storedData)
          } else {
            setColorChange('#DBDBDB')
            setButtonText('Scan QR')
          }
        }
      })
      return () => {
        unsubscribe()
      }
    }, [navigation, checkChargingStartedBool])
  
    useEffect(() => {
      fetchData()
    }, [])
  
    // for not click startcharing 10 min
    useEffect(() => {
      let timer
      if (!buttonPressed && AsyncStoragePiddata) {
        timer = setTimeout(() => {
          setTimerExpired(true)
        }, 120000)
      }
      // console.log(timer, 'timer')
      return () => {
        clearTimeout(timer)
      }
    }, [buttonPressed, AsyncStoragePiddata, buttonText])
  
    useEffect(() => {
      clearAsyncStorage()
    }, [timerExpired])
  
    useEffect(() => {
      if (checkChargingStarted && AsyncStoragePiddata) {
        saveDataToAsyncStorage()
      }
    }, [checkChargingStarted, AsyncStoragePiddata])
  
    // useEffect(()=>{
    //   if(IsChargingStartedValue){
    //     setButtonText("Stop Charging")
    //   }
    // },[IsChargingStartedValue])
  
    const formatTime = (timeInSeconds) => {
      const hours = Math.floor(timeInSeconds / 3600)
      const minutes = Math.floor((timeInSeconds % 3600) / 60)
      const seconds = timeInSeconds % 60
      const time = `${hours}:${String(minutes).padStart(2, '0')}:${String(
        seconds
      ).padStart(2, '0')}`
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(
        seconds
      ).padStart(2, '0')}`
    }
  
    const handleStartClick = () => {
      setIsTimerRunning(true)
    }
  
    const handleStopClick = () => {
      setIsTimerRunning(false)
    }
  
    const handleResetClick = () => {
      setIsTimerRunning(false)
      // setTotalSeconds(0)
    }
  
    const handleCostAndTimeOpen = async (text, unique) => {
      // console.log('text', text, unique)
      if (text == 'Stop Charging') {
        setIsloaderShow(true)
        console.log('StopChargingStopChargingStopCharging', unique)
        handleClickStopCharging(unique)
      } else if (text == 'Start Charging' && AsyncStoragePiddata) {
        dispatch(setModal(true))
        // setIsModalOpen(true)
        // setGetSampledata(true)
        SetTimeinSec('')
        // setChargingEnergy('')
        // setChargingCost('')
        SetShowChargingCostPerSecond('')
        setchargingUnitsfromsetCost('')
      } else {
        navigation.navigate('PublicScanner', { name: name })
        setchargingUnitsfromsetCost('')
        setChargingCost('')
        setTotalSeconds(0)
      }
    }
  
    const handleRemoveItem = async () => {
      try {
        // Use AsyncStorage.removeItem to remove the "pid" item
        await AsyncStorage.removeItem('pid')
        await AsyncStorage.removeItem('ChargingStarted')
  
        console.log('Item removed from AsyncStorage')
        setAsyncStoragePiddata(null) // Reset the data state
        setColorChange('#DBDBDB')
        setButtonText('Scan QR')
        setButtonPressed(false)
        handleCostAndTimeClose()
        dispatch(setChargingStarted(false))
        dispatch(setChargerHistoryPid(''))
      } catch (error) {
        console.error('Error removing item from AsyncStorage:', error)
      }
    }
  
    const handleCostAndTimeClose = () => {
      dispatch(setModal(false))
  
      // setIsModalOpen(false)
      // SetTimeinSec("")
    }
  
    const clearAsyncStorage = async () => {
      if (timerExpired) {
        // await AsyncStorage.removeItem('pid');
        handleRemoveItem()
        // console.log('AsyncStorage remove!')
        Alert.alert('automatic remove')
      }
      setTimerExpired(false)
    }
  
    const saveDataToAsyncStorage = async () => {
      if (checkChargingStarted && AsyncStoragePiddata) {
        try {
          console.log('saveDataToAsyncStoragesaveDataToAsyncStorage')
          // Save data to AsyncStorage
          // await AsyncStorage.setItem('ChargingStarted', "true");
          setShowChargingEnergy(true)
          setButtonPressed(true)
        } catch (error) {
          console.error('Error saving data to AsyncStorage:', error)
        }
      }
    }
  
    const fetchData = async () => {
      try {
        // Get the stored MID from AsyncStorage
        const storedMid = await AsyncStorage.getItem('mid')
  
        // Dispatch action to get user data using the retrieved MID
        const data = await dispatch(getUserData(storedMid))
        // Set the retrieved MID and user data in state
        const userdata = await data
        console.log('userdataradhe', data)
        setName(userdata.name)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
  
    const handleClickStopCharging = (unique) => {
      console.log('AsyncStoragePiddata', AsyncStoragePiddata, chargingHistoryPId)
  
      // setGetSampledata(false)
      setcheckChargingStarted(false)
      handleResetClick()
      setButtonText('Scan QR')
      // setChargingEnergy('')
      // setChargingCost('')
      setinputcostfromsetcost('')
      SetShowChargingCostPerSecond('')
      setchargingUnitsfromsetCost('')
      setShowChargingEnergy(false)
  
      if (!AsyncStoragePiddata && !chargingHistoryPId) {
        return
      }
      const pid = AsyncStoragePiddata || chargingHistoryPId
      if (!unique) {
        dispatch(
          publicstopCharging(
            pid,
            SampleDataaa,
            SetEndTime,
            setisChargingAlertVisible,
            setShowPaymentCompleteModal,
            setisPowerCutTextVisible
          )
        )
        console.log('aumatic discornnectby')
      }
      handleRemoveItem()
    }
  
    const ChargingHistoryTime = (chargerdata) => {
      if (!Array.isArray(chargerdata) || chargerdata.length === 0) {
        return 0 // Changed to return 0 as a number
      }
  
      // Pehle item ki StartTime ko mila lena
      const startTimeParts = chargerdata[0].StartTime.split(':')
      const startHour = parseInt(startTimeParts[0], 10)
      const startMinute = parseInt(startTimeParts[1], 10)
      const startSecond = parseInt(startTimeParts[2], 10)
  
      // Ab current time ko le lena
      const currentTime = new Date()
  
      // Difference nikalna
      const currentHour = currentTime.getHours()
      const currentMinute = currentTime.getMinutes()
      const currentSecond = currentTime.getSeconds()
  
      // Calculate total seconds
      const differenceInSeconds =
        (currentHour - startHour) * 3600 +
        (currentMinute - startMinute) * 60 +
        (currentSecond - startSecond)
  
      return differenceInSeconds
    }
  
    const animateNextWord = () => {
      setShouldAnimate(true)
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length)
    }
  // for 7 sec 
  const handleButtonClick7Sec = () => {
    clearTimers7sec();
  
    if (modalVisible7Sec) {
      setCurrentIndex7Sec(4); // Show "Charger Connected" message
      setTimeout(() => setModalVisible7Sec(false), 1000);
    } else {
      startTimerSequence7Sec();
    }
  };
  
  const startTimerSequence7Sec = () => {
    const durations = [7000, 14000, 21000, 28000];
    durations.forEach((duration, index) => {
      timerRefs.current[index] = setTimeout(() => showModal7sec(index), duration);
    });
  };
  
  
  const clearTimers7sec = () => {
    timerRefs.current.forEach(timer => clearTimeout(timer));
  };
  
  const showModal7sec = (index) => {
    console.log(`No action received for ${index * 7 + 7} seconds`);
    setCurrentIndex7Sec(index);
    setModalVisible7Sec(true);
  };
  const CloseModal7sec = (index) => {
    clearTimers7sec()
    setModalVisible7Sec(false)
  };
  
  
    const handleChargingStop = () => {
      setisPowerCutTextVisible(false)
    }
  
    const generateHoursArray = () => {
      if (EndTime < 0 || EndTime > 23) {
        console.error('Invalid end time')
        return
      }
  
      const newGeneratedHours = []
  
      for (let hour = startTime; true; hour = (hour % 24) + 1) {
        const ampm = hour < 12 ? 'AM' : 'PM'
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12 // Convert to 12-hour format
        const timeString = `${formattedHour} ${ampm}`
        newGeneratedHours.push(timeString)
  
        if (hour === EndTime) {
          break
        }
      }
      navigation.navigate('Charging_History', {
        newGeneratedHours: newGeneratedHours,
      })
      // Update the state with the new array
      // console.log('newGeneratedHours', newGeneratedHours)
      setSendDataToChart(newGeneratedHours)
  
      // {ChargingEnergy != ''
      //                 ? Math.round(ChargingEnergy * 100) / 100
      //                 : '0'}{' '}
      //               Wh
    }
    return (
      <View style={styles.container}>
        {/* <Button title="animateNextWord" onPress={animateNextWord}  /> */}
        {/* <Button title="del pid" onPress={handleRemoveItem} /> */}
        {/* <Button title="know length" onPress={generateHoursArray} />
        <Button title="navigate to chargerhistory" onPress={generateHoursArray} /> */}
        <App_top_Header
          title={`Hello ${name}!`}
          navigation={navigation}
          color={'#C1E0C2'}
          isHome={true}
          name={name}
        />
        <View style={styles.contents}>
          <View style={styles.statusBox}>
            <View
              style={{
                height: 10,
                backgroundColor: colorChange,
                width: 10,
                borderRadius: 10 / 2,
                marginRight: 10,
              }}
            ></View>
            <Text style={{ color: '#717171' }}>Status:</Text>
            <Text style={{ paddingLeft: 10, color: colorChange }}>
              {checkChargingStartedBool ||
              (AsyncStoragePiddata && checkChargingStarted)
                ? // Condition: Both AsyncStorage data and charging started
                  'Charging'
                : AsyncStoragePiddata
                ? // Condition 1: Only AsyncStorage data is available
                  'Your charger is connected'
                : // Default case: No data available
                  'Not Connected'}
            </Text>
          </View>
          <View style={styles.powerAndCharging}>
            <View style={{ justifyContent: 'center' }}>
              <Text style={{ color: '#9A9A9A' }}>Power Used</Text>
            </View>
            <View style={{ backgroundColor: '#EDECEC', width: 1 }}></View>
            <View style={{ justifyContent: 'center' }}>
              <View
                style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}
              >
                <Image
                  style={[styles.Icons, { height: 20 }]}
                  source={require('../../assets/power.png')}
                />
                <Text style={{ color: '#9A9A9A' }}>
                  {/* Charger- {showChargingEnergy ? SamplePowerData : '0'} w */}
                  Charger-{' '}
                  {showChargingEnergy
                    ? Math.round(SamplePowerData * 100) / 100
                    : '0'}{' '}
                  w
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.dashboard}>
            <View>
              <View style={styles.chargingCostMeater}>
                <View style={styles.dashboardIconsView}>
                  <Image
                    style={styles.Icons}
                    source={require('../../assets/ev_charger.png')}
                  />
                  <Text style={{ color: '#717171' }}>Charging Cost</Text>
                </View>
                <Text style={{ color: '#717171' }}>
                  {/* {timeInSec && timeInSec.length > 0
                  ₹
                    ? ShowChargingCostPerSecond || '0'
                    : ChargingCost || '0'} */}
                  ₹{' '}
                  {showChargingEnergy
                    ? Math.round(ChargingCost * 1000) / 1000 +
                      ' / ' +
                      inputcostfromsetcost
                    : '0'}
                </Text>
                <View
                  style={{
                    position: 'absolute',
                    flexDirection: 'row',
                    gap: 88,
                    marginBottom: -100,
                    bottom: 0,
                  }}
                >
                  <HomeScreenCircles />
                  <HomeScreenCircles />
                </View>
              </View>
            </View>
            <View style={{ alignSelf: 'center', paddingVertical: 5 }}>
              {checkChargingStartedBool ||
              (AsyncStoragePiddata && checkChargingStarted) ? (
                // Condition: Both AsyncStorage data and charging started
                //<Text style={{color:"black"}}>kign jamer</Text>
                // {ShowChargingCostPerSecond}
                 <Wave size={150} progress={40} />
              ) : AsyncStoragePiddata ? (
                // Condition 1: Only AsyncStorage data is available
                <Image
                  source={require('../../assets/GreenWavesPhoto.png')}
                  style={{ height: 190, width: 190 }}
                />
              ) : (
                // Default case: No data available
                <Image
                  source={require('../../assets/pidNotAvailable.png')}
                  style={{ height: 190, width: 190 }}
                />
              )}
            </View>
  
            <View style={styles.potIconContainer}>
              <Image
                style={styles.portIcon}
                source={require('../../assets/porticon.png')}
              />
            </View>
            <View style={styles.chargingEnergyAndTime}>
              <View style={styles.chargingValueText}>
                <View style={styles.dashboardIconsView}>
                  <Image
                    style={styles.Icons}
                    source={require('../../assets/battery_charging_30.png')}
                  />
                  <Text style={{ color: '#717171' }}>Charging Time</Text>
                </View>
                <Text style={{ color: '#717171' }}>
                  {formatTime(totalSeconds)} hrs
                </Text>
              </View>
              <View style={{ backgroundColor: '#C7C7C7', width: 1 }}></View>
  
              <View style={styles.chargingValueText}>
                <View style={styles.dashboardIconsView}>
                  <Image
                    style={styles.Icons}
                    source={require('../../assets/charger.png')}
                  />
                  <Text style={{ color: '#717171' }}>Charging Energy</Text>
                </View>
                <Text style={{ color: '#717171' }}>
                  {showChargingEnergy
                    ? Math.round(SampleDataaa * 100) / 100
                    : '0'}{' '}
                  Wh
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                handleCostAndTimeOpen(buttonText)
              }}
              // onPress={()=>{handleCostAndTimeOpen("Stop Charging")}}
              style={styles.ButtonBox}
              disabled={isloadershow}
            >
              {/* <Text style={styles.ButtonText}>{data?"Start Charging":"Scan QR"}</Text> */}
              {/* <Text style={styles.ButtonText}>{IsChargingStartedValue?"Stop Charging":buttonText}</Text> */}
              {isloadershow ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.ButtonText}>{buttonText}</Text>
              )}
            </TouchableOpacity>
          </View>
          <Text
            style={{
              color: '#118615',
              textAlign: 'center',
              fontSize: 12,
              paddingTop: 8,
            }}
          >
            Start Charging and Contribute for your mother earth!
          </Text>
        </View>
        <SetCost
          // open={true}
          // open={isModalOpen}
          open={ModalOpenValue}
          setGetSampledata={setGetSampledata}
          onClose={handleCostAndTimeClose}
          startTimer={handleStartClick}
          inputvalue={''}
          setButtonText={setButtonText}
          SetTimeinSec={SetTimeinSec}
          setOnStopChargingCost={setOnStopChargingCost}
          SetstartTime={SetstartTime}
          setcheckChargingStarted={setcheckChargingStarted}
          handleStopCharging={handleCostAndTimeOpen}
          setButtonPressed={setButtonPressed}
          setinputcostfromsetcost={setinputcostfromsetcost}
          chargingUnitsfromsetCost={chargingUnitsfromsetCost}
          setchargingUnitsfromsetCost={setchargingUnitsfromsetCost}
          setisChargingAlertVisible={setisChargingAlertVisible}
          ChargingEnergy={SampleDataaa}
          setShowPaymentCompleteModal={setShowPaymentCompleteModal}
          animateNextWord={animateNextWord}
          setisPowerCutTextVisible={setisPowerCutTextVisible}
        />
         <View>
          <ChargingAlertModal
            showChargingCompleted={showPaymentCompleteModal}
            visible={isCharginAlertVisible}
            onClose={() => {
              setisChargingAlertVisible(false)
              setTotalSeconds(0)
              setIsloaderShow(false)
            }}
            energyConsumed={SampleDataaa}
            cost={ChargingCost}
            time={formatTime(totalSeconds)}
            shouldAnimate={shouldAnimate}
            setShouldAnimate={setShouldAnimate}
            currentWordIndex={currentWordIndex}
            setCurrentWordIndex={setCurrentWordIndex}
            words={words}
            isPowerCutTextVisible={isPowerCutTextVisible}
          />
        </View>
        {/* <View>
          <CustomModal7Sec
          data={ShowMessageModalData}
          heading="Charging Status"
          index={currentIndex7Sec}
          visible={modalVisible7Sec}
          onClose={CloseModal7sec}
          />
        </View> */}
      </View>
    )
  }
  
  export default Newhome
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    modalopen: {
      backgroundColor: 'rgba(0, 0, 0, 0.76)',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
      zIndex: 2,
    },
    contents: {
      flex: 1,
      padding: 20,
    },
    statusBox: {
      backgroundColor: '#fff',
      padding: 10,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 8,
      // Android
      elevation: 5,
      // iOS
      shadowColor: 'green',
      shadowOffset: { width: 10, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    powerAndCharging: {
      height: 40,
      width: '85%',
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      borderWidth: 1,
      borderRadius: 8,
      borderColor: '#EDECEC',
      marginTop: 10,
      marginBottom: -15,
    },
    dashboard: {
      flex: 1,
      marginTop: 10,
      borderRadius: 10,
      backgroundColor: '#fff',
      borderWidth: 1,
      overflow: 'hidden',
      justifyContent: 'space-between',
      borderColor: '#C7C7C7',
      zIndex: 1,
    },
    dashboardIconsView: {
      flexDirection: 'row',
      gap: 3,
      alignItems: 'center',
    },
    Icons: {
      height: 25,
      resizeMode: 'contain',
      width: 30,
    },
    chargingCostMeater: {
      backgroundColor: '#fff',
      width: '70%',
      elevation: 5,
      overflow: 'hidden',
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      gap: 10,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      height: 80,
    },
    potIconContainer: {
      opacity: 0.2,
      position: 'absolute',
      alignSelf: 'flex-end',
      bottom: 0,
      zIndex: 0,
      transform: [{ rotate: '-15deg' }],
    },
    portIcon: {
      height: 180,
      overflow: 'hidden',
      width: 180,
      marginRight: -90,
      marginBottom: 20,
      resizeMode: 'contain',
    },
    chargingEnergyAndTime: {
      flexDirection: 'row',
      height: 90,
      justifyContent: 'space-evenly',
      backgroundColor: '#fff',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#C7C7C7',
    },
    chargingValueText: {
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },
    buttonContainer: {
      marginTop: -20,
      height: 100,
      backgroundColor: '#C1E0C2',
      paddingHorizontal: 20,
      elevation: 2,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      justifyContent: 'center',
    },
    //add
    ButtonBox: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      padding: 10,
      marginTop: 10,
      borderRadius: 8,
      borderWidth: 2,
      backgroundColor: 'green',
      borderColor: 'green',
    },
    ButtonText: {
      fontSize: 20,
      color: '#fff',
    },
  })
  