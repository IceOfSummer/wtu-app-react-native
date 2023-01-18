import { RefreshHeader } from 'react-native-spring-scrollview'

export default class EmptyLoadingHeader extends RefreshHeader {
  static height: number = 100

  render() {
    return null
  }
}
