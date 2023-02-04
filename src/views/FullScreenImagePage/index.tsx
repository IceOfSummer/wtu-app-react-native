import { View } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { FULL_SCREEN_IMAGE_PAGE, UseRouteGeneric } from '../../router'
import React, { useRef, useState } from 'react'
import ImageViewer from 'react-native-image-zoom-viewer'
import BottomMenu, { MenuItem } from '../../component/Drawer/BottomMenu'
import Drawer from '../../component/Drawer'
import { saveImageToLocal } from '../../utils/CameraUtil'
import Toast from 'react-native-root-toast'
import { getLogger } from '../../utils/LoggerUtils'

const ITEMS: MenuItem[] = [{ name: '保存到本地', icon: '&#xe748;' }]

const logger = getLogger('/views/FullScreenImagePage')

const FullScreenImagePage: React.FC = () => {
  const route = useRoute<UseRouteGeneric<typeof FULL_SCREEN_IMAGE_PAGE>>()
  const [currentIndex, setCurrentIndex] = useState(route.params.index)
  const nav = useNavigation()
  const drawer = useRef<Drawer>(null)
  const onSelect = (index: number) => {
    if (index === 0) {
      const target = route.params.images[currentIndex ?? 0]
      saveImageToLocal(target.url)
        .then(() => {
          Toast.show('保存图片成功!')
        })
        .catch(e => {
          Toast.show('保存失败: ' + e.message)
          logger.error(
            'save image failed: ' + e.message + '. url: ' + target.url
          )
        })
    }
    drawer.current?.closeDrawer()
  }

  const onLongPress = () => {
    drawer.current?.showDrawer()
    console.log('press')
  }

  return (
    <View style={{ flex: 1 }}>
      <ImageViewer
        onChange={setCurrentIndex}
        onClick={() => nav.goBack()}
        onLongPress={onLongPress}
        saveToLocalByLongPress={false}
        index={route.params.index}
        imageUrls={route.params.images}
      />
      <Drawer ref={drawer}>
        <BottomMenu onSelect={onSelect} items={ITEMS} title="图片选项" />
      </Drawer>
    </View>
  )
}
export default FullScreenImagePage
