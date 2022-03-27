import { Theme } from '@react-navigation/native'

const defaultTheme: Theme = {
  dark: true,
  colors: {
    primary: global.styles.$primary_color,
    background: '#f5f6fa',
    border: global.styles.$border_color,
    text: global.styles.$text_color,
    card: '#fff',
    notification: '#fff',
  },
}
export default defaultTheme
