import { StyleSheet } from 'react-native'

export const DRAWER_BAR_HEIGHT = 60

export default StyleSheet.create({
  drawerTableTitle: {
    textAlign: 'center',
    color: global.styles.$primary_color,
    height: 30,
  },
  upIconsContainer: {
    height: 20,
    alignItems: 'center',
  },
  drawerContainerStyle: {
    paddingVertical: 10,
    width: '100%',
    backgroundColor: '#fff',
    borderTopStartRadius: 15,
    borderTopEndRadius: 15,
    position: 'absolute',
    left: 0,
  },
  popupDrawerContainer: {
    width: '100%',
    height: '100%',
  },
  drawerBar: {
    height: DRAWER_BAR_HEIGHT,
  },
})
