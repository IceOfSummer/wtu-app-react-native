import { TextStyle, ViewStyle } from 'react-native'
import config from '../../config.json'
const gStyleValues: GlobalStyleValues = {
  $primary_color: '#007aff',
  $success_color: '#4cd964',
  $warning_color: '#f0ad4e',
  $error_color: '#dd524d',
  $info_color: '#999',
  $text_color: '#333',
  $text_placeholder: '#808080',
  $text_disable: '#c0c0c0',
  $bg_color: '#fff',
  $bg_color_grey: '#f5f6fa',
  $bg_color_hover: '#f1f1f1',
  $bg_color_mask: 'rgba(0, 0, 0, 0.4)',
  $border_color: '#c8c7cc',
  $font_size_sm: 12,
  $font_size_base: 16,
  $font_size_lg: 22,
  $font_size_title: 24,
  $font_size_subtitle: 22,
  $font_size_paragraph: 18,
  $spacing_col_sm: 4,
  $spacing_col_base: 10,
  $spacing_col_lg: 16,
  $spacing_row_sm: 8,
  $spacing_row_base: 15,
  $spacing_row_lg: 20,
  $loading_bg_color: '#00000080',
}
type StyleSheetTypes = Record<keyof GlobalStyleSheet, TextStyle | ViewStyle>

const gStyleSheet: StyleSheetTypes = {
  h1: {
    textAlign: 'center',
    fontSize: gStyleValues.$font_size_lg,
    color: gStyleValues.$primary_color,
    paddingVertical: 8,
  },
  h2: {
    fontSize: gStyleValues.$font_size_base,
    color: gStyleValues.$text_color,
    paddingVertical: 6,
  },
  centerText: {
    textAlign: 'center',
  },
  textContent: {
    fontSize: gStyleValues.$font_size_sm,
    color: gStyleValues.$text_color,
    paddingVertical: 4,
  },
  baseContainer: {
    paddingHorizontal: gStyleValues.$spacing_row_base,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blobText: {
    fontWeight: 'bold',
    fontSize: gStyleValues.$font_size_sm,
    color: gStyleValues.$text_color,
    paddingVertical: 4,
  },
  primaryTipText: {
    color: gStyleValues.$primary_color,
    paddingVertical: 4,
    fontSize: gStyleValues.$font_size_sm,
    textAlign: 'center',
  },
  errorTipText: {
    color: gStyleValues.$error_color,
    fontSize: gStyleValues.$font_size_sm,
    paddingVertical: 4,
    textAlign: 'center',
  },
  flexRowJustBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flexRowJustAround: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
}

const defaultThemeColors = {
  primaryColor: '#007aff',
  success_color: '#4cd964',
  warning_color: '#f0ad4e',
  error_color: '#dd524d',
  backgroundColor: '#f5f6fa',
  boxBackgroundColor: '#fff',
  textColor: '#000',
  infoTextColor: '#999',
  borderColor: '#c8c7cc',
  statusBarColor: '#fff',
  shallowBoxBackgroundColor: 'rgb(240, 240, 240)',
}
global.colors = defaultThemeColors

const configType = __DEV__ ? config.debug : config.release

global.constant = {
  downloadUrl: 'https://xds.fit/wtuapp/app/',
  homePageUrl: 'https://github.com/HuPeng333/wtu-app-react-native.git',
  sessionCookieName: 'SESSION',
  ...configType,
}
global.styles = Object.assign(gStyleValues, gStyleSheet)

global.util = {
  assert: (data, backup) => (data ? data : backup),
}

export default {}
