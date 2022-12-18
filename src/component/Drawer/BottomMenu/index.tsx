import React from 'react'
import { Text, View } from 'react-native'
import Icons from '../../Icons'
import Button from 'react-native-button'

interface BottomMenuProps {
  onSelect: OnSelect
  items: Array<MenuItem>
  title: string
}
export type OnSelect = (index: number, item?: MenuItem) => void

export type MenuItem = {
  icon?: string
  name: string
}

const BottomMenu: React.FC<BottomMenuProps> = props => {
  /**
   * 选择一个目录项, 并关闭目录
   * @param index 选择的目录项索引, <b>若为-1则没有选</b>
   */
  const selectMenu = (index: number) => {
    if (index >= 0) {
      props.onSelect(index, props.items[index])
    } else {
      props.onSelect(index)
    }
  }

  return (
    <View style={{ paddingVertical: 10 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 18,
          paddingVertical: 10,
        }}>
        <Text style={{ fontSize: 20, color: global.styles.$text_color }}>
          {props.title}
        </Text>
        <Icons
          onPress={() => selectMenu(-1)}
          iconText="&#xe612;"
          size={18}
          color={global.styles.$text_color}
        />
      </View>
      <View>
        {props.items.map((value, index) => (
          <Button
            onPress={() => selectMenu(index)}
            key={index}
            containerStyle={{
              width: '100%',
            }}
            childGroupStyle={{
              width: '100%',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderColor: global.styles.$border_color,
              }}>
              <Icons
                iconText={value.icon}
                size={26}
                parseUnicode
                color={global.colors.textColor}
              />
              <Text
                style={{
                  fontSize: 16,
                  marginStart: 10,
                  fontWeight: 'normal',
                  color: global.colors.textColor,
                }}>
                {value.name}
              </Text>
            </View>
          </Button>
        ))}
      </View>
    </View>
  )
}

export default BottomMenu
