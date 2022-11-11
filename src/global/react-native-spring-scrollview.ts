declare module 'react-native-spring-scrollview' {
  export interface SpringScrollView {
    /**
     * 内容区的高度
     */
    _contentHeight: number
    /**
     * 当前滚动条的偏移
     */
    _contentOffset: { x: number; y: number }
    /**
     * 容器高度
     */
    _height: number
  }
}

export default {}
