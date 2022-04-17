import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  blockOuter: {
    paddingHorizontal: 50,
    marginVertical: 5,
  },
  cardContainer: {
    paddingHorizontal: 10,
    paddingTop: 15,
    paddingBottom: 20,
    borderRadius: 10,
  },
  textTitle: {
    color: '#58ff96',
    fontSize: global.styles.$font_size_sm,
  },
  textContent: {
    color: '#d8dbdf',
    textAlign: 'center',
  },
  classNameTitle: {
    textAlign: 'center',
    color: '#fff',
    fontSize: global.styles.$font_size_base,
  },
})
