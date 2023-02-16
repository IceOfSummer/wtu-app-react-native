import React, { useEffect, useState } from 'react'
import { ResponseTemplate } from '../../../../api/server/types'
import usePage from '../../../../hook/usePage'
import {
  Acquisition,
  takeDownAcquisition,
} from '../../../../api/server/acquisition'
import { LoadingScrollView } from '../../../../component/LoadingScrollView'
import { StyleSheet, Text, View } from 'react-native'
import ConditionHideContainer from '../../../../component/Container/ConditionHideContainer'
import { formatTimestampSimply } from '../../../../utils/DateUtils'
import BaseContainer from '../../../../component/Container/BaseContainer'
import Button from 'react-native-button'
import { useNavigation } from '@react-navigation/native'
import { NavigationProp } from '@react-navigation/core/src/types'
import { ACQUISITION_PAGE } from '../../../../router'
import { DETAIL_PAGE } from '../../../AcquisitionPage'
import { useStore } from 'react-redux'
import { ReducerTypes } from '../../../../redux/counter'
import Loading from '../../../../component/Loading'
import Toast from 'react-native-root-toast'
import NativeDialog from '../../../../native/modules/NativeDialog'

interface PageAdapterProps {
  request: (
    page: number,
    size: number
  ) => Promise<ResponseTemplate<Acquisition[]>>
  isActive: boolean
}

const PageAdapter: React.FC<PageAdapterProps> = props => {
  const page = usePage<Acquisition>(props.request, 5)

  useEffect(() => {
    page.loadMore().catch(() => null)
  }, [])
  return (
    <LoadingScrollView
      dataLength={page.data.length}
      onRequireLoad={page.loadMore}
      {...page}>
      {page.data.map(value => (
        <AcquisitionItem
          item={value}
          key={value.id}
          controlButton={props.isActive}
        />
      ))}
      <ConditionHideContainer hide={!page.empty}>
        <Text style={global.styles.infoTipText}>到底了~</Text>
      </ConditionHideContainer>
    </LoadingScrollView>
  )
}

interface AcquisitionItemProps {
  item: Acquisition
  controlButton?: boolean
}

const AcquisitionItem: React.FC<AcquisitionItemProps> = props => {
  const [active, setActive] = useState(props.controlButton ?? false)
  const store = useStore<ReducerTypes>()
  const nav = useNavigation<NavigationProp<any>>()
  const check = () => {
    const nickname = store.getState().serverUser.userInfo?.nickname
    nav.navigate(ACQUISITION_PAGE, {
      screen: DETAIL_PAGE,
      params: { acquisitionId: props.item.id, nickname },
    })
  }
  const takeDown = () => {
    NativeDialog.showDialog({
      title: '取消收购',
      message: '确认取消收购吗?',
      onConfirm: () => {
        Loading.showLoading()
        takeDownAcquisition(props.item.id)
          .then(() => {
            setActive(false)
          })
          .catch(e => {
            Toast.show('请求失败，' + e.message)
          })
          .finally(() => {
            Loading.hideLoading()
          })
      },
    })
  }

  return (
    <BaseContainer style={styles.itemContainer} onPress={check}>
      <Text style={styles.title}>{props.item.title}</Text>
      <View style={styles.subContainer}>
        <View>
          <Text style={styles.expectPriceText}>
            <Text style={{ color: global.colors.textColor }}>预期价格: </Text>
            {props.item.expectPrice || '当面议价'}
          </Text>
          <Text style={styles.expectPriceText}>
            <Text style={{ color: global.colors.textColor }}>当前状态: </Text>
            {active ? (
              <Text style={{ color: global.colors.primaryColor }}>有效</Text>
            ) : (
              <Text style={{ color: global.colors.error_color }}>已完成</Text>
            )}
          </Text>
        </View>
        <Text>{formatTimestampSimply(props.item.createTime)}</Text>
      </View>
      <ConditionHideContainer
        hide={!active}
        style={styles.buttonGroupContainer}>
        <Button containerStyle={styles.takeDownButton} onPress={takeDown}>
          <Text style={styles.buttonText}>取消收购</Text>
        </Button>
      </ConditionHideContainer>
    </BaseContainer>
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    marginVertical: 6,
  },
  title: {
    color: global.colors.textColor,
    fontSize: global.styles.$font_size_lg,
  },
  subContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  expectPriceText: {
    color: global.colors.primaryColor,
  },
  buttonGroupContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  takeDownButton: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: global.colors.error_color,
    borderRadius: 15,
    overflow: 'hidden',
  },
  buttonText: {
    color: global.colors.error_color,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
})

export default PageAdapter
