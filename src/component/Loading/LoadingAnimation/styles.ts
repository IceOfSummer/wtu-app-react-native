import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  loading: {
    width: 50,
    height: 50,
    borderColor: global.styles.$primary_color,
    borderWidth: 3,
    borderRadius: 50,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    width: 15,
    height: 15,
    marginBottom: 43.5,
    backgroundColor: 'skyblue',
    borderRadius: 50,
    resizeMode: 'cover',
  },
})
