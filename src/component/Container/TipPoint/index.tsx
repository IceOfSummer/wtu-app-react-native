import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface TipPointProps {
  count?: number
}

const TipPoint: React.FC<TipPointProps> = props => {
  const cnt = Math.min(props.count ?? 0, 99)
  if (props.count && props.count > 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{cnt}</Text>
      </View>
    )
  } else {
    return null
  }
}

const LENGTH = 19
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    minWidth: LENGTH,
    minHeight: LENGTH,
    borderRadius: LENGTH,
    marginHorizontal: 4,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
  },
})

export default TipPoint
