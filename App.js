import React from 'react';
import { StyleSheet, Text, View , TextInput } from 'react-native';
import Routes from './src/routes';

export default function App() {
  return (
    <Routes />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7159c1',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    color: '#ffffff',
    fontWeight: 'bold',
  }
});
