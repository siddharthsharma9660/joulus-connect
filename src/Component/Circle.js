import { StyleSheet, Text, Platform } from 'react-native';
import React from 'react';
import {
  responsiveHeight as hp,
  responsiveWidth as wp,
} from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient';

const Circle = () => {
  return (
    <LinearGradient colors={['#118615', '#118615']} style={styles.circle1}>
      <LinearGradient colors={['#118615', '#118615']} style={styles.circle2}>
        <LinearGradient colors={['#118615', '#118615']} style={styles.circle3}>
          <LinearGradient
            colors={['#118615', '#118615']}
            style={styles.circle4}
          >
            <LinearGradient
              colors={['#118615', '#118615']}
              style={styles.circle5}
            ></LinearGradient>
          </LinearGradient>
        </LinearGradient>
      </LinearGradient>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  circle1: {
    height: wp(100),
    width: wp(100),
    borderRadius: wp(100) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: Platform.select({
      ios: 0.08, // iOS specific opacity
      android: 0.06, // Android specific opacity
    }),
  },
  circle2: {
    backgroundColor: 'transparent',
    height: wp(85),
    width: wp(85),
    borderRadius: wp(85) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle3: {
    backgroundColor: 'transparent',
    height: wp(70),
    width: wp(70),
    borderRadius: wp(70) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle4: {
    backgroundColor: 'transparent',
    height: wp(55),
    width: wp(55),
    borderRadius: wp(55) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle5: {
    backgroundColor: 'transparent',
    height: wp(40),
    width: wp(40),
    borderRadius: wp(40) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Circle;
