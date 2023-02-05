import React from 'react'
import BottomMenu, { MenuItem } from './index'
import {
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker'
import Toast from 'react-native-root-toast'
import Drawer from '../index'

const IMAGE_PICK_MENU: Array<MenuItem> = [
  { name: '拍摄新照片', icon: '&#xe663;' },
  { name: '从图库选择', icon: '&#xe63e;' },
]

export type ImageProperty = {
  path: string
  /**
   * 描述符, 如`png`
   */
  descriptor: string
  /**
   * 文件类型，如`image/png`
   */
  contentType: string
  originFilepath?: string
}

interface ImagePickMenuProps {
  /**
   * @param paths 保证长度至少为一
   */
  onSelect?: (paths: ImageProperty[]) => void
}

export default class ImagePickMenu extends React.Component<
  ImagePickMenuProps,
  any
> {
  drawer = React.createRef<Drawer>()

  public showDrawer() {
    this.drawer.current?.showDrawer()
  }

  pickerCallback(response: ImagePickerResponse) {
    if (!response.errorCode) {
      const assets = response.assets
      if (!assets) {
        return
      }
      const images: Array<ImageProperty> = []
      for (let i = 0; i < assets.length; i++) {
        const img = assets[i]
        if (img.type && img.uri) {
          images.push({
            path: img.uri,
            descriptor: img.type.substring(img.type.lastIndexOf('/') + 1),
            contentType: img.type,
            originFilepath: img.originFilepath!,
          })
        }
      }
      if (images.length) {
        this.props.onSelect?.(images)
      }
    }
  }
  onSelect(index: number) {
    if (index === 0) {
      launchCamera({ mediaType: 'photo' })
        .then(this.pickerCallback)
        .catch(e => {
          Toast.show('打开相机失败: ' + e.message)
        })
        .finally(() => {
          this.drawer.current?.closeDrawer()
        })
    } else if (index === 1) {
      launchImageLibrary({ selectionLimit: 1, mediaType: 'photo' })
        .then(this.pickerCallback)
        .catch(e => {
          Toast.show('打开图库失败: ' + e.message)
        })
        .finally(() => {
          this.drawer.current?.closeDrawer()
        })
    }
  }

  constructor(props: ImagePickMenuProps) {
    super(props)
    this.onSelect = this.onSelect.bind(this)
    this.pickerCallback = this.pickerCallback.bind(this)
  }

  render() {
    return (
      <Drawer ref={this.drawer}>
        <BottomMenu
          onSelect={this.onSelect}
          items={IMAGE_PICK_MENU}
          title="选择图片"
        />
      </Drawer>
    )
  }
}
