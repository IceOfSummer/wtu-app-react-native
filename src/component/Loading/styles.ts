import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  loadMask: {
    backgroundColor: '#00000040',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
  },
})
