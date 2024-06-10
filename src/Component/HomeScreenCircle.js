import { StyleSheet, Text } from 'react-native'
import React from 'react'
import {
  responsiveHeight as hp,
  responsiveWidth as wp,
} from 'react-native-responsive-dimensions'
import LinearGradient from 'react-native-linear-gradient'

const HomeScreenCircles = () => {
  return (
    <LinearGradient colors={['#118615', '#118615']} style={styles.circle1}>
      <LinearGradient colors={['#118615', '#118615']} style={styles.circle2}>
        <LinearGradient
          colors={['#118615', '#118615']}
          style={styles.circle3}
        ></LinearGradient>
      </LinearGradient>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  circle1: {
    height: wp(50),
    width: wp(50),
    borderRadius: wp(50) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.04,
  },
  circle2: {
    backgroundColor: 'transparent',
    height: wp(42),
    width: wp(42),
    borderRadius: wp(42) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle3: {
    backgroundColor: 'transparent',
    height: wp(33),
    width: wp(33),
    borderRadius: wp(33) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default HomeScreenCircles
