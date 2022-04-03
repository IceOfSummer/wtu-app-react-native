import React, { useRef } from 'react'
import { PullDownPickerRefAttribute } from '../../PullDownPicker'
import SimpleCard from '../SimpleCard'
import { View } from 'react-native'
import PullDownPicker from '../../PullDownPicker'

interface PullDownPickerCardProps<T = string | number> {
  title: string
  pickerTitle: string
  pickerData: Array<T>
  pickerCurrent: T
  onSelect: (index: number, data: T) => void
}

const PullDownPickerCard: React.FC<PullDownPickerCardProps> = props => {
  const picker = useRef<PullDownPickerRefAttribute>(null)
  return (
    <SimpleCard
      onTap={() => picker.current?.open?.()}
      title={props.title}
      right={
        <View>
          <PullDownPicker
            ref={picker}
            title={props.pickerTitle}
            data={props.pickerData}
            current={props.pickerCurrent}
            onSelect={props.onSelect}
          />
        </View>
      }
    />
  )
}
export default PullDownPickerCard
