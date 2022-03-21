import React from 'react'
import { Text, View } from 'react-native'
import styles from './styles'
import Icons from '../../../component/Icons'

const LessonsTable: React.FC = () => {
  return (
    <View style={styles.lessonsTableContainer}>
      <View>
        <View style={styles.upIconsContainer}>
          <Icons iconText="&#xec0b;" />
        </View>
        <Text style={styles.lessonsTableTitle}>课程一览</Text>
      </View>
      <View style={styles.header}>
        <View style={styles.sidebar}>
          <View style={styles.sidebarBlock}>
            <Text style={styles.sidebarText}>1</Text>
            <Text style={styles.sidebarText}>08:00</Text>
            <Text style={styles.sidebarText}>08:45</Text>
          </View>
          <View style={styles.sidebarBlock}>
            <Text style={styles.sidebarText}>2</Text>
            <Text style={styles.sidebarText}>08:50</Text>
            <Text style={styles.sidebarText}>09:35</Text>
          </View>
          <View style={styles.sidebarBlock}>
            <Text style={styles.sidebarText}>3</Text>
            <Text style={styles.sidebarText}>09:55</Text>
            <Text style={styles.sidebarText}>10:40</Text>
          </View>
          <View style={styles.sidebarBlock}>
            <Text style={styles.sidebarText}>4</Text>
            <Text style={styles.sidebarText}>10:45</Text>
            <Text style={styles.sidebarText}>11:30</Text>
          </View>
          <View style={styles.sidebarBlock}>
            <Text style={styles.sidebarText}>5</Text>
            <Text style={styles.sidebarText}>11:35</Text>
            <Text style={styles.sidebarText}>12:20</Text>
          </View>
          <View style={styles.sidebarBlock}>
            <Text style={styles.sidebarText}>6</Text>
            <Text style={styles.sidebarText}>14:00</Text>
            <Text style={styles.sidebarText}>14:45</Text>
          </View>
          <View style={styles.sidebarBlock}>
            <Text style={styles.sidebarText}>7</Text>
            <Text style={styles.sidebarText}>14:50</Text>
            <Text style={styles.sidebarText}>15:35</Text>
          </View>
          <View style={styles.sidebarBlock}>
            <Text style={styles.sidebarText}>8</Text>
            <Text style={styles.sidebarText}>15:55</Text>
            <Text style={styles.sidebarText}>16:40</Text>
          </View>
          <View style={styles.sidebarBlock}>
            <Text style={styles.sidebarText}>9</Text>
            <Text style={styles.sidebarText}>16:45</Text>
            <Text style={styles.sidebarText}>17:30</Text>
          </View>
          <View style={styles.sidebarBlock}>
            <Text style={styles.sidebarText}>10</Text>
            <Text style={styles.sidebarText}>19:00</Text>
            <Text style={styles.sidebarText}>19:45</Text>
          </View>
          <View style={styles.sidebarBlock}>
            <Text style={styles.sidebarText}>11</Text>
            <Text style={styles.sidebarText}>19:50</Text>
            <Text style={styles.sidebarText}>20:35</Text>
          </View>
          <View style={styles.sidebarBlock}>
            <Text style={styles.sidebarText}>12</Text>
            <Text style={styles.sidebarText}>20:40</Text>
            <Text style={styles.sidebarText}>21:35</Text>
          </View>
        </View>
        <Text style={styles.headerText}>星期一</Text>
        <Text style={styles.headerText}>星期二</Text>
        <Text style={styles.headerText}>星期三</Text>
        <Text style={styles.headerText}>星期四</Text>
        <Text style={styles.headerText}>星期五</Text>
        <Text style={styles.headerText}>星期六</Text>
        <Text style={styles.headerText}>星期日</Text>
      </View>
      <View />
    </View>
  )
}

export default LessonsTable
