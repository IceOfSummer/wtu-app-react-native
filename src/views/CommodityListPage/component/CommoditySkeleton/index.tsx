import React from 'react'
import ContentLoader, { Rect } from 'react-content-loader/native'

const CommoditySkeleton: React.FC = () => {
  return (
    <ContentLoader
      speed={2}
      width={400}
      height={120}
      style={{ marginVertical: 5 }}
      viewBox="0 0 400 120"
      backgroundColor="#d7d6d6"
      foregroundColor="#c7c7c7">
      <Rect x="11" y="10" rx="5" ry="5" width="126" height="110" />
      <Rect x="155" y="11" rx="3" ry="3" width="344" height="26" />
      <Rect x="155" y="96" rx="3" ry="3" width="108" height="24" />
      <Rect x="277" y="96" rx="3" ry="3" width="124" height="24" />
      <Rect x="155" y="50" rx="3" ry="3" width="220" height="30" />
    </ContentLoader>
  )
}

export default CommoditySkeleton
