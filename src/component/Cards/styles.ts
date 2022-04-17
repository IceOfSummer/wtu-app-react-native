import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  blockOuter: {
    paddingHorizontal: global.styles.$spacing_row_base,
    paddingVertical: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  text: {
    fontSize: global.styles.$font_size_base,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: global.styles.$border_color,
    flexGrow: 1,
    paddingVertical: global.styles.$spacing_row_base,
  },
})
