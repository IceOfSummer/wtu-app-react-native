import { StyleSheet } from 'react-native'

export const PULL_DOWN_AREA_HEIGHT = 60

export default StyleSheet.create({
  cardOuter: {
    paddingTop: 10,
    paddingHorizontal: 20,
    width: '100%',
    height: '100%',
  },
  cardContainer: {
    borderRadius: 15,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  cardTitleText: {
    color: global.styles.$primary_color,
  },
  classScheduleContainer: {
    height: '100%',
  },
  pullDownArea: {
    height: PULL_DOWN_AREA_HEIGHT,
    width: '100%',
    backgroundColor: '#fff',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  pullDownText: {
    textAlign: 'center',
    color: global.styles.$primary_color,
    marginBottom: PULL_DOWN_AREA_HEIGHT / 4,
  },
})
