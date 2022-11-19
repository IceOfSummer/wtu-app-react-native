import React from 'react'
import { Animated, StyleSheet } from 'react-native'
import Divider from '../Divider'

interface AnimatedDividerProps {
  width?: number | string
}

/**
 * 带动画的分隔条，使用active和blur方法来激活动画
 */
export default class AnimatedDivider extends React.Component<
  AnimatedDividerProps,
  {}
> {
  state = {}

  bottomDividerWidth = new Animated.Value(0)

  constructor(props: AnimatedDividerProps) {
    super(props)
  }

  public active() {
    Animated.spring(this.bottomDividerWidth, {
      toValue: 1,
      useNativeDriver: true,
      bounciness: 0,
    }).start()
  }

  public blur() {
    Animated.spring(this.bottomDividerWidth, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 0,
    }).start()
  }

  render() {
    return (
      <React.Fragment>
        <Divider width={this.props.width} style={styles.dividerContainer} />
        <Animated.View
          style={[
            styles.activeDivider,
            {
              width: this.props.width,
              transform: [{ scaleX: this.bottomDividerWidth }],
            },
          ]}
        />
      </React.Fragment>
    )
  }
}

const styles = StyleSheet.create({
  dividerContainer: {
    position: 'absolute',
    bottom: 0,
  },
  activeDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: global.colors.primaryColor,
  },
})
