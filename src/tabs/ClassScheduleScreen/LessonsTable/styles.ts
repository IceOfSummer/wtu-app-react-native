import { StyleSheet } from 'react-native'

export const HEADER_HEIGHT = 20
export const PER_CLASS_HEIGHT = 45

export default StyleSheet.create({
  lessonsTableContainer: {
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 12,
    textAlign: 'center',
    height: HEADER_HEIGHT,
  },
  sidebarText: {
    fontSize: 10,
    textAlign: 'center',
  },
  sidebar: {
    marginTop: HEADER_HEIGHT,
    justifyContent: 'flex-start',
  },
  sidebarBlock: {
    height: PER_CLASS_HEIGHT,
    justifyContent: 'center',
  },
  upIconsContainer: {
    height: 20,
    alignItems: 'center',
  },
  lessonItem: {
    position: 'absolute',
  },
  lessonItemContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    paddingTop: 5,
    overflow: 'hidden',
  },
  lessonText: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  linkText: {
    textDecorationLine: 'underline',
    color: global.styles.$primary_color,
    textAlign: 'center',
  },
  tipText: {
    textAlign: 'center',
  },
})
