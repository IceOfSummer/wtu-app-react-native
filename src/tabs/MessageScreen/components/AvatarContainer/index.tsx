import React from 'react'
import { StyleSheet, View } from 'react-native'
import Avatar from '../../../../component/Container/Avatar'

interface AvatarContainerProps {
  uids: number[]
}

const AvatarContainer: React.FC<AvatarContainerProps> = props => {
  if (props.uids.length === 0) {
    return null
  }
  return (
    <View>
      {props.uids.length === 1 ? (
        <SingleAvatar uid={props.uids[0]} />
      ) : (
        <DoubleAvatar uid1={props.uids[0]} uid2={props.uids[1]} />
      )}
    </View>
  )
}

interface SingleAvatarProps {
  uid: number
}

const SingleAvatar: React.FC<SingleAvatarProps> = props => {
  return <Avatar uid={props.uid} />
}

interface DoubleAvatarProps {
  uid1: number
  uid2: number
}

const DoubleAvatar: React.FC<DoubleAvatarProps> = props => {
  return (
    <View style={styles.avatarContainer}>
      <Avatar size={34} styles={styles.firstAvatar} uid={props.uid1} />
      <Avatar size={34} styles={styles.secondAvatar} uid={props.uid2} />
    </View>
  )
}

const styles = StyleSheet.create({
  firstAvatar: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  secondAvatar: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  avatarContainer: {
    width: 50,
    height: 50,
  },
})

export default AvatarContainer
