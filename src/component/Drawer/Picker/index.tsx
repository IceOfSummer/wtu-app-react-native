import React, { useRef, useState } from 'react'
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import { SpringScrollView } from 'react-native-spring-scrollview'
import { getLogger } from '../../../utils/LoggerUtils'

interface PickerProps<T extends string | number> {
  items: T[]
  onSelect?: (index: number) => void
  initSelect?: number
  title: string
}

const logger = getLogger('/component/Drawer/Picker')
const OPACITY_MAP = [1, 0.5, 0.3, 0.1, 0.05]
/**
 * 每个ITEM的高度
 */
const ITEM_HEIGHT = 50
function Picker<T extends string | number>(props: PickerProps<T>) {
  const { height } = useWindowDimensions()
  const [currentSelect, setCurrentSelect] = useState<number>(
    props.initSelect ?? 0
  )
  const scroll = useRef<SpringScrollView>(null)
  const TOP_HEIGHT = height / 4
  const CONTAINER_HEIGHT = height / 2
  const onMomentumScrollEnd = () => {
    const scrollRef = scroll.current
    if (!scrollRef) {
      return
    }
    const target = getCurrentPoint()
    scrollRef.scrollTo({ x: 0, y: target * ITEM_HEIGHT }, true).catch(e => {
      logger.error('scrollTo throws error: ' + e.message)
    })
    setCurrentSelect(target)
  }

  const onScroll = () => {
    setCurrentSelect(getCurrentPoint())
  }

  function getCurrentPoint(): number {
    const scrollRef = scroll.current
    if (!scrollRef) {
      return 0
    }
    const offset = Math.max(scrollRef._contentOffset.y + ITEM_HEIGHT / 2, 0)
    return Math.min(Math.floor(offset / ITEM_HEIGHT), props.items.length - 1)
  }

  const getOpacity = (selfIndex: number): number => {
    const gap = Math.abs(selfIndex - currentSelect)
    const op = OPACITY_MAP[gap]
    return op ?? 0
  }

  const submit = () => {
    props.onSelect?.(currentSelect)
  }

  return (
    <View>
      <View style={style.header}>
        <Text style={style.title}>选择{props.title}</Text>
        <Text style={style.submit} onPress={submit}>
          确定
        </Text>
      </View>
      <View style={{ height: CONTAINER_HEIGHT, overflow: 'hidden' }}>
        <View style={[style.line, { top: TOP_HEIGHT }]} />
        <SpringScrollView
          initialContentOffset={{
            x: 0,
            y: (props.initSelect ?? 0) * ITEM_HEIGHT,
          }}
          onScroll={onScroll}
          ref={scroll}
          onMomentumScrollEnd={onMomentumScrollEnd}>
          <View style={{ height: TOP_HEIGHT }} />
          {props.items.map((value, index) => (
            <Text
              style={[style.item, { opacity: getOpacity(index) }]}
              key={value}>
              {value}
            </Text>
          ))}
          <View style={{ height: TOP_HEIGHT - ITEM_HEIGHT }} />
        </SpringScrollView>
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  item: {
    width: '100%',
    height: ITEM_HEIGHT,
    textAlignVertical: 'center',
    textAlign: 'center',
    color: global.colors.textColor,
  },
  line: {
    position: 'absolute',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: global.colors.borderColor,
    height: ITEM_HEIGHT,
    width: '100%',
  },
  header: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: global.colors.textColor,
    fontSize: global.styles.$font_size_base,
  },
  submit: {
    color: global.colors.primaryColor,
    fontSize: global.styles.$font_size_base,
  },
})

export default Picker
