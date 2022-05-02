import React, { useState } from 'react'
import { Pressable } from 'react-native'
import Icons from '../Icons'

export interface RadioProps {
  value?: boolean
  onChange?: (status: boolean) => void
  size?: number
}

interface ButtonTextIcon {
  notSelectIconText: string
  selectedIconText: string
}

const Radio: React.FC<RadioProps & ButtonTextIcon> = props => {
  const [status, setStatus] = useState(!!props.value)

  const onChange = () => {
    props.onChange?.(!status)
    setStatus(!status)
  }

  return (
    <Pressable onPress={onChange}>
      {status ? (
        <Icons
          iconText={props.selectedIconText}
          color={global.styles.$primary_color}
          size={props.size}
        />
      ) : (
        <Icons
          iconText={props.notSelectIconText}
          size={props.size}
          color={global.styles.$primary_color}
        />
      )}
    </Pressable>
  )
}

export default Radio
