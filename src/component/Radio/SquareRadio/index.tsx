import React from 'react'
import BaseRadio, { RadioProps } from '../BaseRadio'

const SquareRadio: React.FC<RadioProps> = props => {
  return (
    <BaseRadio
      {...props}
      selectedIconText="&#xe722;"
      notSelectIconText="&#xe720;"
    />
  )
}
export default SquareRadio
