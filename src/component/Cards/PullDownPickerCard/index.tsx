import React, { useRef } from 'react'
import SimpleCard from '../SimpleCard'
import { StyleSheet, Text, View } from 'react-native'
import Drawer from '../../Drawer'
import Picker from '../../Drawer/Picker'

interface PullDownPickerCardProps<T extends string | number> {
  title: string
  pickerTitle: string
  pickerData: Array<T>
  currentIndex?: number
  onSelect: (index: number, data: T) => void
  text: string | number
}

function PullDownPickerCard<T extends string | number>(
  props: PullDownPickerCardProps<T>
) {
  const drawer = useRef<Drawer>(null)
  const showPicker = () => {
    drawer.current?.showDrawer()
  }

  const onSelect = (index: number) => {
    props.onSelect?.(index, props.pickerData[index])
    drawer.current?.closeDrawer()
  }

  return (
    <View>
      <SimpleCard
        onTap={showPicker}
        title={props.title}
        right={<Text>{props.text}</Text>}
      />
      <Drawer ref={drawer} style={styles.drawer}>
        <Picker
          title={'选择' + props.title}
          items={props.pickerData}
          onSelect={onSelect}
          initSelect={props.currentIndex}
        />
      </Drawer>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  drawer: {
    padding: 15,
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

export default PullDownPickerCard
