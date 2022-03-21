import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  lessonsTableContainer: {
    backgroundColor: '#fff',
    borderTopStartRadius: 15,
    borderTopEndRadius: 15,
    padding: 10,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    flexGrow: 1,
    fontSize: 12,
    textAlign: 'center',
    height: 20,
  },
  sidebarText: {
    fontSize: 10,
    textAlign: 'center',
  },
  sidebar: {
    marginTop: 20,
  },
  sidebarBlock: {
    margin: 5,
  },
  lessonsTableTitle: {
    textAlign: 'center',
    color: global.styles.$primary_color,
    height: 30,
  },
  upIconsContainer: {
    height: 20,
    alignItems: 'center',
  },
})
