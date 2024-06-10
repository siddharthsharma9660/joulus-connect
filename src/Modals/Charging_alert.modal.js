import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Easing,
  
} from 'react-native';
import Modal from 'react-native-modal';

const ChargingAlertModal = ({
  visible,
  onClose,
  energyConsumed,
  cost,
  time,
  showChargingCompleted,
  words,
  currentWordIndex,
  shouldAnimate,
  isPowerCutTextVisible
}) => {
  // const words = ['Payment Successful', 'Starting..', 'Charging Started'];
  // const [currentWordIndex, setCurrentWordIndex] = useState(0);
  // const [shouldAnimate, setShouldAnimate] = useState(true);
  // const fadeAnim = new Animated.Value(0);
  // const slideAnim = new Animated.Value(100);

  // const animateNextWord = () => {
  //   setShouldAnimate(true);
  //   setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
  // };

  useEffect(() => {
    // const interval = setInterval(animateNextWord, 3000)
    
    // return () => clearInterval(interval)
  }, []);

  // useEffect(() => {
  //   if (shouldAnimate) {
  //     Animated.sequence([
  //       Animated.parallel([
  //         Animated.timing(slideAnim, {
  //           toValue: 0,
  //           duration: 100, // Decreased slide-in duration
  //           easing: Easing.out(Easing.exp),
  //           useNativeDriver: true,
  //         }),
  //         Animated.timing(fadeAnim, {
  //           toValue: 1,
  //           duration: 500,
  //           easing: Easing.out(Easing.exp),
  //           useNativeDriver: true,
  //         }),
  //       ]),
  //       Animated.delay(1500),
  //       Animated.parallel([
  //         Animated.timing(slideAnim, {
  //           toValue: -100,
  //           duration: 500,
  //           easing: Easing.in(Easing.exp),
  //           useNativeDriver: true,
  //         }),
  //         Animated.timing(fadeAnim, {
  //           toValue: 0,
  //           duration: 500,
  //           easing: Easing.in(Easing.exp),
  //           useNativeDriver: true,
  //         }),
  //       ]),
  //     ]).start(() => {
  //       // setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
  //       // setShouldAnimate(false)
  //     });
  //   }
  // }, [shouldAnimate]);

  return (
    <Modal
      isVisible={visible}
      onSwipeComplete={onClose}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}
      animationIn="fadeIn"
      animationOut="fadeOut"
      animationOutTiming={300}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={styles.modalContainer}
      >
        {showChargingCompleted ? (
          <View style={styles.contentContainer}>
            <Text style={styles.heading}>{isPowerCutTextVisible?"Charging Stopped":"Charging Complete"}</Text>
            {/* <Text style={styles.heading}>Charging Stopped </Text> */}
            <View style={styles.horizontalLine} />
           {isPowerCutTextVisible? <Text style={{color:"black",fontSize:12,height:25,borderColor:"black",marginTop:-12,color: '#717171'}}>By Power Cut Or WiFi Down</Text>:""}

            <View>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Energy Consumed</Text>
                <Text style={[styles.fieldColon, { marginLeft: 0 }]}>:</Text>
                {/* <Text style={styles.fieldValue}>{energyConsumed}</Text> */}
                <Text style={styles.fieldValue}>{ Math.round(energyConsumed * 100) / 100}</Text>
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Cost of charging</Text>
                <Text style={[styles.fieldColon, { marginLeft: 11 }]}>:</Text>
                {/* <Text style={styles.fieldValue}>{cost}</Text> */}
                <Text style={styles.fieldValue}>{ Math.round(cost * 1000) / 1000}</Text>
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Time taken</Text>
                <Text style={[styles.fieldColon, { marginLeft: 46 }]}>:</Text>
                <Text style={styles.fieldValue}>{time}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.okButton}>
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.contentContainer}>
            <Text style={styles.heading} >
            Charging Status
            </Text>
            <View style={styles.horizontalLine} />
            <View style={styles.textContainer}>
              <View style={styles.wordContainer}>
                <Animated.View
                  style={{
                    // opacity: fadeAnim,
                    // transform: [{ translateY: slideAnim }],
                  }}
                >
                  <Text style={styles.fieldLabel}>
                    {shouldAnimate ? words[currentWordIndex] : ''}
                  </Text>
                </Animated.View>
              </View>
              <ActivityIndicator
                style={styles.activityIndicator}
                size="large"
                color="#118615"
              />
            </View>
          </View>
        )}
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  contentContainer: {
    width: '75%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
    borderColor: 'green',
    borderWidth: 2,
  },
  heading: {
    color: '#717171',
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 5,
  },
  horizontalLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#DBDBDB',
    width: '66%',
    marginBottom: 15,
  },
  fieldContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  fieldLabel: {
    color: '#717171',
    fontWeight: '600',
    marginRight: 10,
  },
  fieldColon: {
    color: '#717171',
    fontWeight: '600',
    marginHorizontal: 5,
  },
  fieldValue: {
    color: '#000',
  },
  okButton: {
    backgroundColor: 'green',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginTop: 10,
  },
  okButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  textContainer: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordContainer: {
    padding: 10,
    overflow: 'hidden',
    width: '100%',
    alignItems: 'center',
  },
});

export default ChargingAlertModal;
