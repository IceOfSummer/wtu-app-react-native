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
import { SignInfo, uploadFile } from '../../../api/server/cos'

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
type ImageRes = ImageResource & {
  // 是否已经上传
  uploaded?: boolean
  // 绑定的签名，用于上传
  sign?: SignInfo
}

interface ImageUploadContainerState {
  selectedImage: Array<ImageRes>
}

type ImageResource = {
  fileName: string
  uri: string
  filetype: string
}

/**
 * 图片上传组件
 * <p>
 * 在上传图片到服务器前，应该先调用`bindUploadSign()`来绑定上传签名，之后直接调用`uploadImage()`就可以开始自动上传了
 */
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

  /**
   * 获取还未上传的图片
   */
  public getNotUploadedImages(): Array<ImageRes> {
    const arr: Array<ImageRes> = []
    this.state.selectedImage.forEach(value => {
      if (!value.uploaded) {
        arr.push(value)
      }
    })
    return arr
  }

  public getUploadedImageCount(): number {
    let count = 0
    for (let i = 0, len = this.state.selectedImage.length; i < len; i++) {
      count += i
    }
    return count
  }

  /**
   * 上传所选的图片
   * @param token token
   * @param progressCallback 进度条回调
   */
  public async uploadImage(
    token: string,
    progressCallback?: (current: number, total: number) => void
  ) {
    logger.info('started upload image')
    const images = this.getNotUploadedImages()
    for (let i = 0; i < images.length; i++) {
      const value = images[i]
      logger.info('uploading image ' + i)
      if (value.sign) {
        progressCallback?.(i, images.length)
        await uploadFile(value.uri, value.sign, token, value.filetype)
        value.uploaded = true
      } else {
        logger.error('missing sign in image: ' + value + ', can not upload')
      }
    }
  }

  /**
   * 绑定上传签名
   * @param signInfos 上传签名，长度应和{@link ImageUploadContainer#getNotUploadedImages()}的返回值的长度相等
   * @param start 从signInfos的哪个索引开始绑定
   */
  public bindUploadSign(signInfos: SignInfo[], start = 0) {
    const images = this.getNotUploadedImages()
    const infoLen = signInfos.length - start
    let len = images.length < infoLen ? images.length : infoLen
    for (let i = 0; i < len; i++) {
      images[i].sign = signInfos[start++]
    }
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
          if (value.uri && value.fileName && value.type) {
            uris.push({
              uri: value.uri,
              fileName: value.fileName,
              filetype: value.type,
            })
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
        <View>{this.props.children}</View>
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
