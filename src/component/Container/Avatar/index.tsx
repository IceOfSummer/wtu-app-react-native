import React, { useState } from 'react'
import { Pressable, ViewStyle } from 'react-native'
import FastImage from 'react-native-fast-image'
import { useNavigation } from '@react-navigation/native'
import { UseNavigationGeneric, USER_INFO_PAGE } from '../../../router'
import Environment from '../../../utils/Environment'

const URL_PREFIX = Environment.cdnUrl + '/avatar/'
interface AvatarProps {
  /**
   * @deprecated 请使用uid属性
   */
  uri?: number
  size?: number
  onPress?: () => void
  uid?: number
  styles?: ViewStyle
}

const LENGTH = 48
const Avatar: React.FC<AvatarProps> = props => {
  const [fail, setFail] = useState(false)
  const nav = useNavigation<UseNavigationGeneric>()
  const uid = props.uri ? props.uri : props.uid
  const onError = () => {
    setFail(true)
  }
  const toUserInfo = () => {
    if (uid) {
      nav.navigate(USER_INFO_PAGE, { id: uid })
    }
  }
  const uri = uid ? URL_PREFIX + uid + '.webp' : undefined
  return (
    <Pressable
      onPress={props.onPress ?? toUserInfo}
      style={[
        {
          width: global.util.assert(props.size, LENGTH),
          height: global.util.assert(props.size, LENGTH),
          overflow: 'hidden',
          borderRadius: 50,
        },
        props.styles,
      ]}>
      {fail ? (
        <FastImage
          source={require('../../../assets/img/avatar.png')}
          style={{ width: '100%', height: '100%' }}
        />
      ) : (
        <FastImage
          onError={onError}
          source={uri ? { uri } : require('../../../assets/img/avatar.png')}
          style={{ width: '100%', height: '100%' }}
        />
      )}
    </Pressable>
  )
}

/**
 * @deprecated
 */
export const getAvatarUrl = (uid: number) => uid

export default Avatar
