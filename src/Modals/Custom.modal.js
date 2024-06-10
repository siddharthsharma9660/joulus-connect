import React from 'react'
import {
  StyleSheet,
  Image,
  View,
  BackHandler,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native'
import Modal from 'react-native-modal'

const CustomModal = ({
  visible,
  onClose,
  children,
  isModal,
  onRescanClick,
}) => {
  console.log('ismodal', isModal)
 

  return (
    <Modal
      isVisible={visible}
      onSwipeComplete={onClose}
      //   swipeDirection={['down']}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}
      animationIn="fadeIn"
      animationOut="fadeOut"
      animationOutTiming={300}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.contentContainer}>
            {!isModal ? (
              <>
                <Text
                 style={{ color: '#717171', fontWeight: "800", fontSize: 30 }}
                >
                  {children}
                </Text>
                <Image
                  source={require('../assets/Union.png')}
                  style={styles.imageStyle}
                />
              </>
            ) : (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',

                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: '#717171',
                      fontSize: 18,
                      textAlign: 'center',
                    }}
                  >
                    {children}
                  </Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.ScanButton}>
                  <Text style={styles.ScanButtonText}>Scan again</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

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
    height: 200,
    width: '75%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    borderColor: 'green',
    borderWidth: 2,
  },
  imageStyle: {
    width: 40,
    height: 40,
    padding: 10,
    resizeMode: 'contain',
    position: 'absolute',
    bottom: 10,
    right: 16,
  },
  ScanButton: {
    backgroundColor: 'green',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginTop: 10,
  },
  ScanButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
})

export default CustomModal
