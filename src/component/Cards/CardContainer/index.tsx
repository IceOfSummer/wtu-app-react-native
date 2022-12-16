import React from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

interface CardContainerProps {
  style?: ViewStyle
}

const CardContainer: React.FC<CardContainerProps> = props => {
  return (
    <View style={[styles.blockOuter, props.style]}>
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
