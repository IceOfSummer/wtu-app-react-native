import React from 'react'
import { UserInfoView } from '../../../api/server/user'
import BaseContainer from '../../../component/Container/BaseContainer'
import { StyleSheet, Text, View } from 'react-native'
import Avatar, { getAvatarUrl } from '../../../component/Container/Avatar'

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
      <View style={styles.avatar}>
        <Avatar uri={getAvatarUrl(props.userInfo.uid)} size={64} />
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignSelf: 'center',
          alignItems: 'center',
        }}>
        <Text style={global.styles.blobText}>{userInfo.name}</Text>
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
