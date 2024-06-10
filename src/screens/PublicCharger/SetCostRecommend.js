import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native'
import {
  responsiveHeight as hp,
  responsiveWidth as wp,
} from 'react-native-responsive-dimensions'
import Modal from 'react-native-modal'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { Checkbox } from 'react-native-paper'
import SetVehicale from '../../Modals/SetVehicale'

const SetCostRecommend = ({
  open,
  onClose,
  CostofCharging,
  setInputCost,
  chargingUnitsfromsetCost,
  handlePayment,
  walletValue,
  rememberMe,
  setRememberMe
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  // const [rememberMe, setRememberMe] = useState(true)

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible)
  }

  const [selectedVehicle, setSelectedVehicle] = useState({
    name: '',
    model: '',
    kwh: '',
  })
  const [paycost, setPaycost] = useState('')
  const [batteryPercentage, setBatteryPercentage] = useState('')

  const [selectedVehicleValuePresent, setselectedVehicleValuePresent] =
    useState({
      show: false,
      message: '',
    })

  const [batteryPercentageValuePresent, setBatteryPercentageValuePresent] =
    useState({
      show: false,
      message: '',
    })

  const handleBatteryPercentage = (percentage) => {
    if (percentage > 100) {
      console.log('Percentage value cannot exceed 100.')
      return
    }

    setBatteryPercentage(`${percentage}`)
  }

  useEffect(() => {
    if (!batteryPercentage || !selectedVehicle.kwh || batteryPercentage=="0") {
      setPaycost(0)
      // setInputCost(0)
      return
    }

    if (batteryPercentage > 100) {
      console.error('Percentage value cannot exceed 100.')
      return
    }

    const payCostInWh =
      (selectedVehicle.kwh * 1000 * (100 - batteryPercentage)) / 100
    const payCostInRupees = Math.ceil((CostofCharging / 1000) * payCostInWh)
    console.log('payCostInWhpayCostInWh', payCostInWh, payCostInRupees)
    setPaycost(payCostInRupees)
    setInputCost(payCostInRupees)
  }, [batteryPercentage, selectedVehicle])

  console.log('payCostInWh', selectedVehicle)

  const handlePaycost = () => {
    if (!selectedVehicle.kwh) {
      setselectedVehicleValuePresent((prev) => ({
        ...prev,
        show: true,
        message: 'Please Select Vehicle',
      }))
      return
    } else {
      setselectedVehicleValuePresent((prev) => ({
        ...prev,
        show: false,
        message: '',
      }))
    }
    if (!batteryPercentage) {
      setBatteryPercentageValuePresent((prev) => ({
        ...prev,
        show: true,
        message: 'Please Enter Battry Percenttage',
      }))
      return
    } else {
      setBatteryPercentageValuePresent((prev) => ({
        ...prev,
        show: false,
        message: '',
      }))
    }
    handlePayment()
    setTimeout(() => {
      onClose()
    }, 500)
    setBatteryPercentage("")
    setSelectedVehicle({name:"",model:"",kwh:""})
    setselectedVehicleValuePresent({message:"",show:false})
    setBatteryPercentageValuePresent({ show: false,
      message: ''})
  }

  return (
    <Modal
      // isVisible={true}
      isVisible={open}
      onSwipeComplete={onClose}
      swipeDirection={['down']}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}
    >
      <View style={styles.container}>
        <View style={styles.contents}>
          <View style={styles.cancelButton}>
            <TouchableOpacity onPress={onClose}>
              <Image source={require('../../assets/cancel.png')} />
            </TouchableOpacity>
          </View>
          <View style={styles.contentBox}>
            <Text style={styles.text}>
              Please choose your vehicle & enter your current battery percentage
              (%) in the vehicle
            </Text>
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={toggleModal}
            >
              <Text style={{ fontSize: 14, color: '#6C6C6C' }}>
              {
                  selectedVehicle.model || selectedVehicle.name 
                    ? selectedVehicle.model 
                      ? `${selectedVehicle.name} / ${selectedVehicle.model}`
                      : selectedVehicle.name
                    : 'Select Your Vehicle'
                }
              </Text>
              <AntDesign name="down" size={20} color="black" />
            </TouchableOpacity>
            {selectedVehicleValuePresent.show && (
              <Text style={{ color: 'red', marginLeft: 5 }}>
                {selectedVehicleValuePresent.message}
              </Text>
            )}
            {/* <View style={styles.pickerContainer}></View> */}

            {/* <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedVehicle}
                onValueChange={(itemValue) => setselectedVehicle(itemValue)}
                style={styles.picker}
                prompt="Select Your Vehicle"
              >
                <Picker.Item label="OLA S1X +" value="3" />
                <Picker.Item label="Ather" value="2.97" />
                <Picker.Item label="Tvs" value="3.4" />
                <Picker.Item label="Jetter" value="5.1" />
                <Picker.Item label="Bajaj Chetak" value="3.2" />
                <Picker.Item label="Jetter" value="2.08" />
              </Picker>
            </View> */}

            <View>
              <TextInput
                style={styles.inputbox}
                placeholder="Enter Your Battery Percentage (%)"
                placeholderTextColor={'#7D7B7B'}
                keyboardType="numeric"
                value={batteryPercentage}
                onChangeText={handleBatteryPercentage}
              />
              {batteryPercentageValuePresent.show && (
                <Text style={{ color: 'red', marginLeft: 5 }}>
                  {batteryPercentageValuePresent.message}
                </Text>
              )}
            </View>
            <View style={styles.CostCharging}>
              <Text style={styles.text}>Cost of Charging : </Text>
              <Text style={styles.text}>
                ₹{CostofCharging} per Kwh (per Unit)
              </Text>
            </View>
            <Text style={styles.text}>Amount of Full Charge - ₹{paycost}</Text>
            <Text style={styles.text}>
              Amount of charing units -{' '}
              {Math.round(chargingUnitsfromsetCost * 1000) / 1000} kwh{' '}
            </Text>

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

            <TouchableOpacity
              style={styles.payButtonContainer}
              onPress={handlePaycost}
            >
              <View style={styles.payButton}>
                <Text style={styles.payButtonText}>Pay </Text>
                {/* <Text style={styles.payButtonText}>₹ {paycost}</Text> */}
                <Text style={styles.payButtonText}>₹ {!rememberMe
                      ? paycost
                      : rememberMe &&
                        Number(paycost) - Number(walletValue) <= 0
                      ? 0
                      : rememberMe && Number(paycost) - Number(walletValue)}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View>
            <SetVehicale
              open={isModalVisible}
              onClose={toggleModal}
              setSelectedVehicle={setSelectedVehicle}
              selectedVehicle={selectedVehicle}
            />
          </View>

          <View
            style={[styles.bottomColorBox, { backgroundColor: '#C1E0C2' }]}
          />
        </View>
      </View>
    </Modal>
  )
}

export default SetCostRecommend

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  container: {
    flex: 1,
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
    marginVertical: 10,
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
    borderRadius: 14,
    borderColor: '#B7B7B7',
    borderWidth: 1,
  },
  text: {
    color: '#6C6C6C',
    fontSize: 15,
    marginBottom: 7,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    marginLeft: -10,
    height: 22,
  },
  rememberMeText: {
    fontSize: 14,
    color: '#6C6C6C',
  },
  payButtonContainer: {
    flex: 1,
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  payButton: {
    flexDirection: 'row',
    gap: 6,
    padding: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    color: '#fff',
    borderColor: '#118615',
    borderRadius: 8,
    backgroundColor: '#118615',
    alignItems: 'center',
    justifyContent: 'center',
    width: 280,
  },
  payButtonText: {
    color: '#fff',
  },
  pickerContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#464444',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  picker: {
    color: '#8A8989',
  },
  inputbox: {
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#464444',
    borderRadius: 8,
    backgroundColor: '#fff',
    height: 45,
    color: '#000000',
    marginTop: 10,
  },
  CostCharging: {
    marginTop: hp(1),
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomColorBox: {
    position: 'absolute',
    bottom: 0,
    height: hp(40),
    borderTopLeftRadius: 15,
    borderTopRightRadius: 60,
    width: wp(100),
    zIndex: -1,
  },
})
