import React from 'react';
import { View, StyleSheet, Modal, ActivityIndicator } from 'react-native';

const BlurredModalWithLoader = ({ visible, isLoading }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.container}>
        <View style={styles.blurBackground} />
        <View style={styles.loaderContainer}>
          {isLoading && <ActivityIndicator size="large" color="#118615" />}
        </View>
        {/* You can add additional UI components here */}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent white background
    filter: 'blur(5px)', // Apply blur filter
  },
  loaderContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BlurredModalWithLoader;
