import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

interface EmptyProps {
  name?: Displayable
}

const Empty: React.FC<EmptyProps> = props => {
  return (
    <View style={styles.emptyContainer}>
      <Image
        resizeMode="stretch"
        style={styles.emptyImage}
        source={require('../../../assets/img/empty.png')}
      />
      <Text>{props.name}</Text>
    </View>
  )
}
Empty.defaultProps = {
  name: '没有更多数据了',
}

const styles = StyleSheet.create({
  emptyImage: {
    width: 300,
    height: 300,
  },
  emptyContainer: {
    alignItems: 'center',
  },
})
export default Empty
