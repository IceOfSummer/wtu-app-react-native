interface GlobalStyleValues {
  $primary_color: string
  $success_color: string
  $warning_color: string
  $error_color: string
  $info_color: string
  $text_color: string
  $text_placeholder: string
  $text_disable: string
  $bg_color: string
  $bg_color_grey: string
  $bg_color_hover: string
  $bg_color_mask: string
  $border_color: string
  $font_size_sm: number
  $font_size_base: number
  $font_size_lg: number
  $font_size_title: number
  $font_size_subtitle: number
  $font_size_paragraph: number
  $spacing_col_sm: number
  $spacing_col_base: number
  $spacing_col_lg: number
  $spacing_row_sm: number
  $spacing_row_base: number
  $spacing_row_lg: number
  $loading_bg_color: string
}

interface GlobalStyleSheet {
  h1: TextStyle
  h2: TextStyle
  centerText: TextStyle
  textContent: TextStyle
  baseContainer: ViewStyle
  flexRow: ViewStyle
  flexRowCenter: ViewStyle
  blobText: TextStyle
  primaryTipText: TextStyle
  errorTipText: TextStyle
  flexRowJustBetween: ViewStyle
  flexRowJustAround: ViewStyle
}

interface AppConstant {
  downloadUrl: string
  homePageUrl: string
}

interface UtilFunction {
  /**
   * 若data存在，则返回data，若不存在则返回backup
   * 等价与 data ? data : backup
   * @param data
   * @param backup
   */
  assert: <T = any>(data?: T, backup: T) => T
}

declare namespace global {
  let styles: GlobalStyleValues & GlobalStyleSheet
  let constant: AppConstant
  let util: UtilFunction
}
