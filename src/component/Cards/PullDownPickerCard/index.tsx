import React from 'react'
import SimpleCard from '../SimpleCard'
import { Pressable, Text } from 'react-native'
import PickDialog from '../../../native/modules/PickDialog'

interface PullDownPickerCardProps<T extends string | number> {
  title: string
  pickerTitle: string
  pickerData: Array<T>
  pickerCurrent: T
  onSelect: (index: number, data: T) => void
}

function PullDownPickerCard<T extends string | number>(
  props: PullDownPickerCardProps<T>
) {
  const showPicker = () => {
    let active = 0
    const data = props.pickerData.map((value, index) => {
      if (value === props.pickerCurrent) {
        active = index
      }
      return value.toString()
    })
    PickDialog.showPicker({
      title: props.pickerTitle,
      recipes: data,
      activeIndex: active,
      onSelect: index => props.onSelect(index, props.pickerData[index]),
    })
  }
  return (
    <SimpleCard
      onTap={showPicker}
      title={props.title}
      right={
        <Pressable>
          <Text>{props.pickerCurrent}</Text>
        </Pressable>
      }
    />
  )
}

export default PullDownPickerCard
