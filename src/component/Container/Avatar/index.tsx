import React, { useState } from 'react'
import { View } from 'react-native'
import FastImage from 'react-native-fast-image'
import config from '../../../../config.json'

const cdn = __DEV__ ? config.debug.cdnServer : config.release.cdnServer

interface AvatarProps {
  uri: string
}

const LENGTH = 50
const Avatar: React.FC<AvatarProps> = props => {
  const [fail, setFail] = useState(false)
  const onError = () => {
    setFail(true)
  }
  return (
    <View
      style={{
        width: LENGTH,
        height: LENGTH,
        overflow: 'hidden',
        borderRadius: 50,
      }}>
      {fail ? (
        <FastImage
          source={require('../../../assets/img/avatar-boy.png')}
          style={{ width: '100%', height: '100%' }}
        />
      ) : (
        <FastImage
          onError={onError}
          source={{ uri: props.uri }}
          style={{ width: '100%', height: '100%' }}
        />
      )}
    </View>
  )
}

export const getAvatarUrl = (uid: number) => `http://${cdn}/avatar/${uid}.webp`

export default Avatar
