import React, { useEffect, useState } from 'react'
import { RouteProp, useRoute } from '@react-navigation/native'
import { AcquisitionSubmitPageRoute } from '../../index'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import LoadingView from '../../../../component/Loading/LoadingView'
import {
  Acquisition,
  queryAcquisitionById,
} from '../../../../api/server/acquisition'
import Toast from 'react-native-root-toast'
import Avatar from '../../../../component/Container/Avatar'
import RichTextPresentView from '../../../../component/Container/RichTextPresentView'
import KVTextContainer from '../../../../component/Container/KVTextContainer'

const DetailPage: React.FC = () => {
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const route =
    useRoute<RouteProp<AcquisitionSubmitPageRoute, '/acquisitionPage/detail'>>()
  const [data, setData] = useState<Acquisition | undefined>()

  const loadData = () => {
    if (loading) {
      return
    }
    setLoading(true)
    queryAcquisitionById(route.params.acquisitionId)
      .then(r => {
        setData(r.data)
        console.log(r.data)
        setSuccess(true)
      })
      .catch(e => {
        Toast.show('加载失败，' + e.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <LoadingView
      loadCallback={loadData}
      isLoading={loading}
      success={success}
      style={styles.container}>
      {data ? <Detail {...data} {...route.params} /> : null}
    </LoadingView>
  )
}

const Detail: React.FC<Acquisition> = props => {
  console.log(props.description)
  return (
    <ScrollView style={{ height: '100%' }}>
      <Text style={styles.title}>{props.title}</Text>
      <View style={styles.avatarContainer}>
        <Avatar uid={props.ownerId} size={40} />
        <Text style={styles.nameText}>{props.nickname}</Text>
      </View>
      <KVTextContainer
        style={styles.textContainer}
        name="预期价格"
        value={props.expectPrice || '当面议价'}
        fontSize={global.styles.$font_size_base}
      />
      <KVTextContainer
        style={styles.textContainer}
        name="联系方式"
        value={props.contract}
        fontSize={global.styles.$font_size_base}
      />
      <View>
        <Text style={styles.descriptionText}>描述:</Text>
      </View>
      {props.description && props.description.length > 0 ? (
        <RichTextPresentView content={props.description} />
      ) : (
        <Text>没有提供描述...</Text>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: global.colors.boxBackgroundColor,
  },
  title: {
    fontSize: global.styles.$font_size_lg,
    color: global.colors.textColor,
    marginBottom: 8,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    color: global.colors.textColor,
    marginLeft: 4,
  },
  priceText: {
    color: global.colors.primaryColor,
    marginVertical: 8,
  },
  descriptionText: {
    color: global.colors.textColor,
    fontSize: global.styles.$font_size_base,
  },
  textContainer: {
    marginVertical: 6,
  },
})

export default DetailPage
