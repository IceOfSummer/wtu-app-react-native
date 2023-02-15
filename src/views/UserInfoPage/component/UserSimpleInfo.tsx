import React from 'react'
import { UserInfoQueryType } from '../../../api/server/user'
import BaseContainer from '../../../component/Container/BaseContainer'
import { StyleSheet, Text, View } from 'react-native'
import Avatar from '../../../component/Container/Avatar'
import BaseContainer2 from '../../../component/Container/BaseContainer2'

interface UserSimpleInfoProps {
  userInfo: UserInfoQueryType
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
    <React.Fragment>
      <BaseContainer>
        <View style={styles.avatar}>
          <Avatar uid={props.userInfo.userId} size={64} />
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
          }}>
          <Text style={styles.name}>{userInfo.nickname}</Text>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.infoDetailContainer}>
            <Text style={styles.labelText}>信誉分数: </Text>
            <Text style={{ color: getCreditColor() }}>{userInfo.credit}</Text>
          </View>
          <View style={styles.infoDetailContainer}>
            <Text style={styles.labelText}>班级: </Text>
            <Text>{userInfo.className}</Text>
          </View>
        </View>
      </BaseContainer>
      <BaseContainer2 title="个性签名">
        <Text>{userInfo.signature}</Text>
      </BaseContainer2>
    </React.Fragment>
  )
}
const styles = StyleSheet.create({
  name: {
    color: global.colors.textColor,
    fontSize: global.styles.$font_size_base,
  },
  avatar: {
    resizeMode: 'stretch',
    alignSelf: 'center',
  },
  usernameText: {
    fontSize: 12,
  },
  infoContainer: {
    marginTop: 4,
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
