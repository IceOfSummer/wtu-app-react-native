import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  headerContainer: {
    paddingTop: 30,
    paddingBottom: 100,
    paddingHorizontal: 20,
  },
  headerText: {
    color: '#fff',
  },
  headerTitleText: {
    fontSize: global.styles.$font_size_lg,
  },
  headerTipText: {
    marginTop: 5,
    fontSize: global.styles.$font_size_sm,
  },
  fastLinkContainer: {
    backgroundColor: '#fff',
    width: '90%',
    alignSelf: 'center',
    position: 'relative',
    top: -60,
    padding: 30,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  messageCardContainer: {
    borderRadius: 8,
  },
})
