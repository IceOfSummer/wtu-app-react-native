import React from 'react'
import {
  Image,
  ImageResizeMode,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import Icons from '../../Icons'
import {
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker'
import BottomMenu from '../../Drawer/BottomMenu'
import Drawer, { DrawerComponent } from '../../Drawer'
import NativeDialog, {
  quickShowErrorTip,
} from '../../../native/modules/NativeDialog'
import { getLogger } from '../../../utils/LoggerUtils'
import useNav from '../../../hook/useNav'
import { FULL_SCREEN_IMAGE_PAGE } from '../../../router'

const logger = getLogger('/component/Container/ImageUploadContainer')

interface ImageUploadContainerProps {
  title: string
  /**
   * 最多可以传多少张
   */
  limit?: number
  tipMessage?: string
  tipTitle?: string
  imagePreviewResizeMode?: ImageResizeMode
}
interface ImageUploadContainerState {
  selectedImage: Array<ImageResource>
}

type ImageResource = {
  fileName: string
  uri: string
}
export default class ImageUploadContainer extends React.Component<
  ImageUploadContainerProps,
  ImageUploadContainerState
> {
  state: ImageUploadContainerState = {
    selectedImage: [],
  }

  drawer = React.createRef<DrawerComponent>()

  static defaultProps: Partial<ImageUploadContainerProps> = {
    limit: 5,
  }

  public getSelectedImage() {
    return this.state.selectedImage
  }

  addImage() {
    this.drawer.current?.openDrawer()
  }

  onBottomMenuSelect(index: number) {
    let response: Promise<ImagePickerResponse>
    this.drawer.current?.closeDrawer()
    if (index === 0) {
      logger.info('trying to launch camera')
      response = launchCamera({ mediaType: 'photo' })
    } else if (index === 1) {
      logger.info('trying to launch image library')
      response = launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
      })
    } else {
      return
    }
    response
      .then(result => {
        if (result.didCancel) {
          return
        }
        if (result.errorCode) {
          quickShowErrorTip('获取图片失败', result.errorMessage ?? '未知原因')
          return
        }
        const uris: Array<ImageResource> = []
        result.assets?.forEach(value => {
          if (value.uri && value.fileName) {
            uris.push({ uri: value.uri, fileName: value.fileName })
          }
        })
        this.setState({
          selectedImage: this.state.selectedImage.concat(uris),
        })
      })
      .catch(e => {
        quickShowErrorTip('获取图片失败', e.message)
        logger.error('launch failed: ' + e.message)
      })
  }

  onImageDelete(inx: number) {
    NativeDialog.showDialog({
      title: '删除图片',
      message: '确认删除吗?',
      onConfirm: () => {
        this.setState({
          selectedImage: this.state.selectedImage.filter(
            (value, index) => index !== inx
          ),
        })
      },
    })
  }

  showTip() {
    NativeDialog.showDialog({
      title: this.props.tipTitle ?? this.props.title,
      message: this.props.tipMessage ?? '',
      hideCancelBtn: true,
    })
  }

  constructor(props: ImageUploadContainerProps) {
    super(props)
    this.addImage = this.addImage.bind(this)
    this.onBottomMenuSelect = this.onBottomMenuSelect.bind(this)
    this.onImageDelete = this.onImageDelete.bind(this)
    this.showTip = this.showTip.bind(this)
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {this.props.title}({this.state.selectedImage.length}/
            {this.props.limit})
          </Text>
          {this.props.tipMessage ? (
            <Icons
              style={styles.tipIconStyle}
              onPress={this.showTip}
              iconText="&#xe601;"
              size={18}
            />
          ) : null}
        </View>
        <View style={styles.imagesContainer}>
          {this.state.selectedImage.map((value, index) => (
            <ImagePreview
              {...value}
              key={value.fileName}
              index={index}
              onDelete={this.onImageDelete}
              resizeMode={this.props.imagePreviewResizeMode}
            />
          ))}
          {this.state.selectedImage.length >= this.props.limit! ? null : (
            <Pressable style={styles.addContainer} onPress={this.addImage}>
              <Icons iconText="&#xe625;" size={50} />
            </Pressable>
          )}
        </View>
        <Drawer drawerRef={this.drawer}>
          <BottomMenu
            onSelect={this.onBottomMenuSelect}
            items={[
              { name: '使用相机拍摄', icon: '&#xe663;' },
              { name: '从图库中选择', icon: '&#xe63e;' },
            ]}
            title="选择图片"
          />
        </Drawer>
      </View>
    )
  }
}

interface ImagePreviewProps extends ImageResource {
  index: number
  onDelete: (index: number) => void
  resizeMode?: ImageResizeMode
}

const ImagePreview: React.FC<ImagePreviewProps> = props => {
  const nav = useNav()
  const preview = () => {
    nav.push(FULL_SCREEN_IMAGE_PAGE, { index: 0, images: [{ url: props.uri }] })
  }
  return (
    <Pressable onPress={preview}>
      <Image
        source={{ uri: props.uri }}
        width={100}
        height={100}
        resizeMode={props.resizeMode}
        style={styles.imagePreview}
      />
      <Pressable
        style={styles.closeButton}
        onPress={() => props.onDelete(props.index)}>
        <Icons iconText="&#xe612;" color={global.colors.textColor} />
      </Pressable>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: global.styles.$spacing_col_base,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  title: {
    color: global.colors.textColor,
    fontSize: global.styles.$font_size_base,
  },
  tipIconStyle: {
    marginLeft: 4,
  },
  addContainer: {
    backgroundColor: global.colors.shallowBoxBackgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    width: 100,
    height: 100,
  },
  imagesContainer: {
    marginVertical: global.styles.$spacing_col_base,
    flexDirection: 'row',
  },
  imagePreview: {
    width: 100,
    height: 100,
  },
  closeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 50,
    position: 'absolute',
    bottom: 6,
    right: 6,
    padding: 2,
  },
})
