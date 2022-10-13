import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: global.styles.$spacing_col_lg,
    paddingHorizontal: global.styles.$spacing_col_lg,
  },
  headerTextOuter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
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
  linkText: {
    marginVertical: global.styles.$spacing_col_sm,
    color: '#fff',
    textDecorationLine: 'underline',
    fontSize: global.styles.$font_size_sm,
    textAlign: 'center',
  },
})
