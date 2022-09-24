import React from 'react'
import { UserInfoView } from '../../../api/server/user'
import BaseContainer from '../../../component/Container/BaseContainer'
import FastImage from 'react-native-fast-image'
import { StyleSheet, Text, View } from 'react-native'

interface UserSimpleInfoProps {
  userInfo: UserInfoView
}

const UserSimpleInfo: React.FC<UserSimpleInfoProps> = props => {
  const { userInfo } = props
  const getCreditColor = () => {
    if (userInfo.credit >= 90) {
      return 'green'
    } else if (userInfo.credit >= 80) {
      return 'yellow'
    } else {
      return 'red'
    }
  }
  return (
    <BaseContainer>
      <FastImage
        style={styles.avatar}
        source={
          userInfo.avatar
            ? { uri: userInfo.avatar }
            : require('../../../assets/img/avatar-boy.png')
        }
      />
      <View
        style={{
          justifyContent: 'center',
          alignSelf: 'center',
          alignItems: 'center',
        }}>
        <Text style={global.styles.blobText}>{userInfo.name}</Text>
        <Text style={styles.usernameText}>{userInfo.wtuUsername}</Text>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.infoDetailContainer}>
          <Text style={styles.labelText}>信誉分数: </Text>
          <Text style={{ color: getCreditColor() }}>{userInfo.credit}</Text>
        </View>
        <View style={styles.infoDetailContainer}>
          <Text style={styles.labelText}>居住寝室: </Text>
          <Text>{userInfo.bedroom}</Text>
        </View>
      </View>
    </BaseContainer>
  )
}
const styles = StyleSheet.create({
  avatar: {
    width: 64,
    height: 64,
    resizeMode: 'stretch',
    alignSelf: 'center',
  },
  usernameText: {
    fontSize: 12,
  },
  infoContainer: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoDetailContainer: {
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelText: {
    color: '#000',
  },
})

export default UserSimpleInfo
