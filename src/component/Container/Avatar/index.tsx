import React, { useState } from 'react'
import { Pressable } from 'react-native'
import FastImage from 'react-native-fast-image'
import config from '../../../../config.json'

const cdn = __DEV__ ? config.debug.cdnServer : config.release.cdnServer

interface AvatarProps {
  uri?: string
  size?: number
  onPress?: () => void
}

const LENGTH = 50
const Avatar: React.FC<AvatarProps> = props => {
  const [fail, setFail] = useState(false)
  const onError = () => {
    setFail(true)
  }
  return (
    <Pressable
      onPress={props.onPress}
      style={{
        width: global.util.assert(props.size, LENGTH),
        height: global.util.assert(props.size, LENGTH),
        overflow: 'hidden',
        borderRadius: 50,
      }}>
      {fail ? (
        <FastImage
          source={require('../../../assets/img/avatar.png')}
          style={{ width: '100%', height: '100%' }}
        />
      ) : (
        <FastImage
          onError={onError}
          source={
            props.uri
              ? { uri: props.uri }
              : require('../../../assets/img/avatar.png')
          }
          style={{ width: '100%', height: '100%' }}
        />
      )}
    </Pressable>
  )
}

export const getAvatarUrl = (uid: number) => `http://${cdn}/avatar/${uid}.webp`

export default Avatar
