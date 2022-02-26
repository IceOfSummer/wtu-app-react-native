import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  closeBtn: {
    alignItems: 'flex-end',
    marginTop: global.styles.$spacing_col_base,
    marginRight: global.styles.$spacing_col_base,
  },
  headerTextOuter: {
    marginStart: global.styles.$spacing_col_base,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: global.styles.$primary_color,
    fontSize: global.styles.$font_size_lg,
  },
  captchaInputBlock: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  captchaInput: {
    width: 200,
  },
  captchaImage: {
    width: 150,
    height: 60,
  },
  blockOuter: {
    padding: 20,
  },
  loginBtn: {
    borderRadius: 20,
    height: 50,
    backgroundColor: global.styles.$primary_color,
    overflow: 'hidden',
  },
  textToCenter: {
    alignItems: 'center',
  },
})
