import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  outer: {
    margin: 5,
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  headerContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: 10,
    borderBottomColor: global.styles.$border_color,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
