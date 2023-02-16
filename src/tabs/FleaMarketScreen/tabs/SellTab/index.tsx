import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import HighPerformanceScrollView from '../../../../component/LoadingScrollView/HighPerformanceScrollView'
import {
  AcquisitionQuery,
  queryNewlyAcquisition,
} from '../../../../api/server/acquisition'
import useMaxIdPage from '../../../../hook/useMaxIdPage'
import Toast from 'react-native-root-toast'
import useNav from '../../../../hook/useNav'
import { ACQUISITION_PAGE } from '../../../../router'
import Icons from '../../../../component/Icons'
import BaseContainer from '../../../../component/Container/BaseContainer'
import Avatar from '../../../../component/Container/Avatar'
import { formatTimestampSimply } from '../../../../utils/DateUtils'
import { DETAIL_PAGE } from '../../../../views/AcquisitionPage'
import { StackActions, useNavigation } from '@react-navigation/native'

const SIZE = 6

const SellTab: React.FC = () => {
  const page = useMaxIdPage(queryNewlyAcquisition, value => value.id, SIZE)

  useEffect(() => {
    page.next().catch(e => {
      Toast.show('加载失败: ' + e.message)
    })
  }, [])
  return (
    <View style={styles.container}>
      <HighPerformanceScrollView
        {...page}
        onEndReachedThreshold={0.1}
        onLoadMore={page.next}
        onRefresh={page.refresh}
        keyExtractor={value => value.id.toString()}
        renderItem={props => <AcquisitionItem {...props} />}
      />
      <SubmitButton />
    </View>
  )
}

interface AcquisitionItemProps {
  item: AcquisitionQuery
}

const AcquisitionItem: React.FC<AcquisitionItemProps> = ({ item }) => {
  const nav = useNavigation()

  const onPress = () => {
    nav.dispatch(
      StackActions.push(ACQUISITION_PAGE, {
        screen: DETAIL_PAGE,
        params: {
          acquisitionId: item.id,
          nickname: item.nickname,
        },
      })
    )
  }
  return (
    <BaseContainer onPress={onPress}>
      <View style={styles.itemHeader}>
        <Avatar uid={item.ownerId} size={40} />
        <Text style={styles.nameText}>{item.nickname}</Text>
      </View>
      <Text style={styles.acquisitionTitle}>{item.title}</Text>
      <View style={styles.itemBottom}>
        <Text>
          预期价格: <Text>{item.expectPrice || '当面议价'}</Text>
        </Text>
        <Text style={styles.timeText}>
          {formatTimestampSimply(item.createTime)}
        </Text>
      </View>
    </BaseContainer>
  )
}

const SubmitButton: React.FC = () => {
  const nav = useNav()
  const onPress = () => {
    nav.push(ACQUISITION_PAGE)
  }
  return (
    <Pressable style={styles.buttonContainer} onPress={onPress}>
      <Icons iconText="&#xe625;" color="#fff" size={25} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  buttonContainer: {
    position: 'absolute',
    backgroundColor: global.colors.primaryColor,
    padding: 10,
    borderRadius: 50,
    bottom: 15,
    right: 15,
  },
  text: {
    color: '#fff',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    color: global.colors.textColor,
    fontSize: global.styles.$font_size_base,
    marginHorizontal: 5,
  },
  acquisitionTitle: {
    color: global.colors.textColor,
    fontSize: global.styles.$font_size_lg,
    marginVertical: 6,
  },
  timeText: {
    textAlign: 'right',
  },
  itemBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})

export default SellTab
