import { View } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { FULL_SCREEN_IMAGE_PAGE, UseRouteGeneric } from '../../router'
import React from 'react'
import ImageViewer from 'react-native-image-zoom-viewer'

const FullScreenImagePage: React.FC = () => {
  const route = useRoute<UseRouteGeneric<typeof FULL_SCREEN_IMAGE_PAGE>>()
  const nav = useNavigation()
  return (
    <View style={{ flex: 1 }}>
      <ImageViewer
        onClick={() => nav.goBack()}
        index={route.params.index}
        menuContext={{ saveToLocal: '保存到本地', cancel: '取消' }}
        imageUrls={route.params.images}
      />
    </View>
  )
}
export default FullScreenImagePage
