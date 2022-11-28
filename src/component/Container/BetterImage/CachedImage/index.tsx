import React, { useEffect, useRef, useState } from 'react'
import { Image, ImageStyle, Platform, StyleProp } from 'react-native'
import { getLogger } from '../../../../utils/LoggerUtils'

interface CachedImageProps {
  uri: string
  onLoadSuccess: () => void
  onLoadFail: () => void
  style: StyleProp<ImageStyle>
}

let CachedImage: React.FC<CachedImageProps>
const logger = getLogger('/component/Container/BetterImage/CachedImage')

if (Platform.OS === 'ios') {
  // 理论上IOS也可以用Android的实现，不过IOS自带缓存
  CachedImage = props => {
    const fail = useRef(false)
    return (
      <Image
        style={props.style}
        source={{ uri: props.uri, cache: 'force-cache' }}
        onError={() => (fail.current = true)}
        onLoadEnd={() =>
          fail.current ? props.onLoadFail() : props.onLoadSuccess()
        }
      />
    )
  }
} else {
  CachedImage = props => {
    const [loadDone, setLoadDone] = useState(false)
    useEffect(() => {
      // 找缓存
      if (!Image.queryCache) {
        logger.error('Image.queryCache is undefined!')
        return
      }
      Image.queryCache([props.uri])
        .then(async result => {
          if (result[props.uri]) {
            setLoadDone(true)
            props.onLoadSuccess()
          } else {
            const status = await Image.prefetch(props.uri)
            if (status) {
              setLoadDone(true)
              props.onLoadSuccess()
            } else {
              props.onLoadFail()
            }
          }
        })
        .catch(e => {
          logger.error('query cache failed: ' + e.message)
          props.onLoadFail()
        })
    }, [])

    if (loadDone) {
      return (
        <Image
          {...props}
          source={Image.resolveAssetSource({ uri: props.uri })}
        />
      )
    } else {
      return null
    }
  }
}

export default CachedImage
