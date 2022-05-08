import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  appTitleText: {
    fontSize: global.styles.$font_size_sm,
    color: global.styles.$text_color,
    marginTop: 4,
  },
  appContainer: {
    alignItems: 'center',
    width: '25%',
  },
  cardContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
  },
  blockOuter: {
    padding: 10,
  },
  appOuter: {
    flexDirection: 'row',
    marginVertical: global.styles.$spacing_col_base,
    justifyContent: 'flex-start',
  },
  cardHeader: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerText: {
    fontSize: global.styles.$font_size_sm,
  },
  appImage: {
    width: 36,
    height: 36,
  },
})
