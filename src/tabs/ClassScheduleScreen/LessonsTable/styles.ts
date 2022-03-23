import { StyleSheet } from 'react-native'

export const HEADER_HEIGHT = 20
export const PER_CLASS_HEIGHT = 50

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
    backgroundColor: 'skyblue',
    borderRadius: 10,
    width: '100%',
    height: '100%',
    padding: 3,
  },
  lessonText: {
    fontSize: global.styles.$font_size_sm,
    color: '#fff',
    textAlign: 'center',
  },
})
