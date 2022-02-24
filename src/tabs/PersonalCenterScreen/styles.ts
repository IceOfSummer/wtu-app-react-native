import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: global.styles.$bg_color,
    padding: global.styles.$spacing_col_sm,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTextView: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
})
