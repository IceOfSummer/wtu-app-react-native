import React from 'react'
import { ProcessedCommodity } from '../../../../api/server/commodity'
import Drawer from '../../../../component/Drawer'
import { StyleSheet, Text, View } from 'react-native'
import KVTextContainer from '../../../../component/Container/KVTextContainer'
import { CommodityStatus } from '../../../../api/server/types'

interface CommodityDetailDrawerProps {
  commodity?: ProcessedCommodity
  drawerRef: React.RefObject<Drawer>
}

const CommodityDetailDrawer: React.FC<CommodityDetailDrawerProps> = props => {
  const { commodity } = props
  return (
    <Drawer ref={props.drawerRef}>
      {commodity ? <Content commodity={commodity} /> : null}
    </Drawer>
  )
}

interface ContentProps {
  commodity: ProcessedCommodity
}

const Content: React.FC<ContentProps> = props => {
  const { commodity } = props
  return (
    <View style={styles.drawerContainer}>
      <Text style={styles.title}>{commodity.name}</Text>
      <KVTextContainer name="价格" value={commodity.price} />
      <KVTextContainer name="交易地点" value={commodity.tradeLocation} />
      <KVTextContainer
        name="状态"
        value={
          commodity.status === CommodityStatus.STATUS_ACTIVE
            ? '可用'
            : '已经下架'
        }
      />
      <Text style={styles.remarkTitle}>备注: </Text>
      <Text style={styles.descriptionText}>{commodity.description}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  drawerContainer: {
    padding: 15,
  },
  title: {
    ...global.styles.blobText,
    fontSize: 15,
    marginBottom: 10,
  },
  remarkTitle: {
    fontSize: global.styles.$font_size_sm,
    marginTop: 5,
  },
  descriptionText: {
    color: global.colors.textColor,
  },
})

export default CommodityDetailDrawer
