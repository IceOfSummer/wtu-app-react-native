interface GlobalStyleValues {
  /**
   * @deprecated 不利于主题化，已弃用
   * @see themeSlice.ts
   */
  $primary_color: string
  /**
   * @deprecated 不利于主题化，已弃用
   * @see themeSlice.ts
   */
  $success_color: string
  /**
   * @deprecated 不利于主题化，已弃用
   * @see themeSlice.ts
   */
  $warning_color: string
  /**
   * @deprecated 不利于主题化，已弃用
   * @see themeSlice.ts
   */
  $error_color: string
  /**
   * @deprecated 不利于主题化，已弃用
   * @see themeSlice.ts
   */
  $info_color: string
  /**
   * @deprecated 不利于主题化，已弃用
   * @see themeSlice.ts
   */
  $text_color: string
  /**
   * @deprecated 不利于主题化，已弃用
   * @see themeSlice.ts
   */
  $text_placeholder: string
  /**
   * @deprecated 不利于主题化，已弃用
   * @see themeSlice.ts
   */
  $text_disable: string
  /**
   * @deprecated 不利于主题化，已弃用
   * @see themeSlice.ts
   */
  $bg_color: string
  /**
   * @deprecated 不利于主题化，已弃用
   * @see themeSlice.ts
   */
  $bg_color_grey: string
  /**
   * @deprecated 不利于主题化，已弃用
   * @see themeSlice.ts
   */
  $bg_color_hover: string
  /**
   * @deprecated 不利于主题化，已弃用
   * @see themeSlice.ts
   */
  $bg_color_mask: string
  /**
   * @deprecated 不利于主题化，已弃用
   * @see themeSlice.ts
   */
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
  /**
   * @deprecated 不利于主题化，已弃用
   * @see themeSlice.ts
   */
  $loading_bg_color: string
}

type ThemeColors = {
  primaryColor: string
  success_color: string
  warning_color: string
  error_color: string
  backgroundColor: string
  boxBackgroundColor: string
  textColor: string
  infoTextColor: string
  borderColor: string
  statusBarColor: string
  shallowBoxBackgroundColor: string
}

type Colors = ThemeColors

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
  successTipText: TextStyle
  infoTipText: TextStyle
  errorTipText: TextStyle
  flexRowJustBetween: ViewStyle
  flexRowJustAround: ViewStyle
}

interface AppConstant {
  downloadUrl: string
  homePageUrl: string
  serverBaseUrl: string
  chatServerHost: string
  chatServerPort: number
  cdnServer: string
  /**
   * 存储用户凭据的cookie名称
   */
  sessionCookieName: string
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

declare var colors: ThemeColors
declare var styles: GlobalStyleValues & GlobalStyleSheet
declare var constant: AppConstant
declare var util: UtilFunction
