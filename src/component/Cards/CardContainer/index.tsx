import React from 'react'
import { StyleSheet, View } from 'react-native'

const CardContainer: React.FC = props => {
  return (
    <View style={styles.blockOuter}>
      <View style={styles.cardContainer}>{props.children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  blockOuter: {
    padding: 10,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
})

export default CardContainer
