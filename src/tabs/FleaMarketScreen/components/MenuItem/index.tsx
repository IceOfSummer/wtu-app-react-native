import React from 'react'
import { ColorValue, Image, StyleSheet, Text, View } from 'react-native'
import { Link } from '@react-navigation/native'

interface MenuItemProps {
  image: any
  name: string
  to: string
  backgroundColor?: ColorValue
  scale?: boolean
}

/**
 * 菜单项
 */
const MenuItem: React.FC<MenuItemProps> = props => {
  return (
    <View style={styles.menuOuterContainer}>
      <Link to={props.to}>
        <View style={styles.menuContainer}>
          <View style={styles.imageContainer}>
            <View
              style={[
                styles.imageBackground,
                {
                  backgroundColor: props.backgroundColor
                    ? props.backgroundColor
                    : 'pink',
                },
              ]}
            />
            <Image
              source={props.image}
              style={props.scale ? styles.imageScaleStyle : styles.image}
            />
          </View>
          <Text style={styles.text}>{props.name}</Text>
        </View>
      </Link>
    </View>
  )
}

const CONTAINER_LENGTH = 50
const CONTAINER_HEIGHT = 80

const styles = StyleSheet.create({
  menuOuterContainer: {
    borderColor: 'skyblue',
    width: CONTAINER_LENGTH,
    height: CONTAINER_HEIGHT,
  },
  menuContainer: {
    width: CONTAINER_LENGTH,
    height: CONTAINER_HEIGHT,
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    width: CONTAINER_LENGTH,
    height: CONTAINER_LENGTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBackground: {
    position: 'absolute',
    width: CONTAINER_LENGTH,
    height: CONTAINER_LENGTH,
    borderRadius: 50,
    transform: [{ scaleY: 0.8 }, { translateY: CONTAINER_LENGTH / 10 }],
  },
  image: {
    width: CONTAINER_LENGTH,
    height: CONTAINER_LENGTH,
    resizeMode: 'contain',
  },
  imageScaleStyle: {
    width: CONTAINER_LENGTH - 10,
    height: CONTAINER_LENGTH - 10,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 12,
    color: global.styles.$text_color,
    textAlign: 'center',
  },
})

export default MenuItem
