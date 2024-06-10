// HeaderWithArrow.js

import React from 'react'
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import App_top_Header from '../../Component/App_top_Header'

const AllSupport = ({ navigation }) => {
  const Number = '6377650430'
  const handlePhoneCall = () => {
    // Phone number jise call karna hai
    const phoneNumber = `tel:${Number}`

    // Linking API ka istemal phone call karne ke liye
    Linking.openURL(phoneNumber)
  }
  const handleOpenWhatsApp = () => {
    // WhatsApp number
    const phoneNumber = `whatsapp://send?phone=${Number}`

    // Linking API ka istemal WhatsApp khole ke liye
    Linking.openURL(phoneNumber)
  }
  const talktoexpert = () => {
    navigation.navigate('chatsupport')
  }
  return (
    <View style={styles.container}>
     <App_top_Header
        title={'Support'}
        navigation={navigation}
        color={'#C1E0C2'}
      />
      <View style={styles.formcontent}>
        <View>
          <TouchableOpacity onPress={handlePhoneCall}>
            <View style={styles.contactButton}>
              <MaterialCommunityIcons
                name="phone"
                size={24}
                color="#118615"
                style={styles.contactIcon}
              />
              <Text style={styles.contactText}>Call</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleOpenWhatsApp}>
            <View style={styles.contactButton}>
              <FontAwesome
                name="whatsapp"
                size={24}
                color="#118615"
                style={styles.contactIcon}
              />
              <Text style={styles.contactText}>WhatsApp</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View style={styles.contactButton}>
              <MaterialCommunityIcons
                name="email"
                size={24}
                color="#118615"
                style={styles.contactIcon}
              />
              <Text style={styles.contactText}>Email</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <TouchableOpacity
            style={styles.sendMessageButton}
            onPress={talktoexpert}
          >
            <Text style={styles.sendMessageText}>Talk to our expert</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'flex-start',
    // flexDirection: 'column',
    // padding: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 6,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 10,
  },
  headerText: {
    fontSize: 18,
    marginLeft: 130,
    fontWeight: '600',
    fontSize: 30,
  },
  formcontent: {
    flex: 1,
    paddingHorizontal: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  contactButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
    padding: 10,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#118615',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    // marginLeft: 10,
    // width: 318,
    // elevation: 5,
  },
  contactIcon: {
    marginRight: 15,
    marginLeft: 12,
  },
  contactText: {
    fontSize: 18,
    marginLeft: 10,
    color: 'black',
  },
  sendMessageButton: {
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
  sendMessageText: {
    fontSize: 20,
    color: '#fff',
  },
})

export default AllSupport
