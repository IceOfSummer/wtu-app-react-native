import React from 'react'
import FastImage, { FastImageProps } from 'react-native-fast-image'
import { Image, View } from 'react-native'
import LottieView from 'lottie-react-native'
interface BetterImageProps {
  imageProp: FastImageProps
  uri: string
  width?: number | string
  height?: number | string
}

enum LoadingStatus {
  LOADING,
  LOAD_FAIL,
  LOAD_DONE,
}

interface BetterImageState {
  status: LoadingStatus
}

export default class BetterImage extends React.Component<
  BetterImageProps,
  BetterImageState
> {
  static defaultProps = {
    width: '100%',
    height: '100%',
  }

  state: BetterImageState = {
    status: LoadingStatus.LOADING,
  }

  onLoadError() {
    this.setState({
      status: LoadingStatus.LOAD_FAIL,
    })
  }

  onLoadEnd() {
    if (this.state.status !== LoadingStatus.LOAD_FAIL) {
      this.setState({
        status: LoadingStatus.LOAD_DONE,
      })
    }
  }

  constructor(props: BetterImageProps) {
    super(props)
    this.onLoadError = this.onLoadError.bind(this)
    this.onLoadEnd = this.onLoadEnd.bind(this)
  }

  render() {
    const { status } = this.state
    const isLoading = status === LoadingStatus.LOADING
    const isFail = status === LoadingStatus.LOAD_FAIL
    const style = {
      width: this.props.width ?? '100%',
      height: this.props.height ?? '100%',
    }
    return (
      <View style={style}>
        <View style={{ flex: 1 }}>
          <FastImage
            {...this.props.imageProp}
            source={{ uri: this.props.uri, cache: FastImage.cacheControl.web }}
            onError={this.onLoadError}
            onLoadEnd={this.onLoadEnd}
            style={[this.props.imageProp.style, style]}
          />
        </View>
        {isLoading ? (
          <LottieView
            autoPlay
            loop
            style={{ flex: 1 }}
            source={require('../../../assets/lottie/image_loading.json')}
          />
        ) : null}
        {isFail ? (
          <View
            style={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              style={{ width: '50%', height: '50%' }}
              source={require('../../../assets/img/image_load_fail.png')}
            />
          </View>
        ) : null}
      </View>
    )
  }
}
