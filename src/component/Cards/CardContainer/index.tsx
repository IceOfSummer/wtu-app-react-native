import React from 'react'
import { StyleSheet, View } from 'react-native'

const CardContainer: React.FC = props => {
  return (
    <View style={styles.cardOuter}>
      <View style={styles.cardContainer}>{props.children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  cardOuter: {
    padding: 10,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
})

export default CardContainer
