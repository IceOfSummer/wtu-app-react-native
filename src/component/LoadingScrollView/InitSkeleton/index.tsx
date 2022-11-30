import React from 'react'
import ContentLoader, { Rect } from 'react-content-loader/native'

const InitSkeleton: React.FC = () => {
  return (
    <ContentLoader
      speed={2}
      height={124}
      viewBox="0 0 400 124"
      backgroundColor="#d7d6d6"
      foregroundColor="#c7c7c7"
      style={{ width: '100%' }}>
      <Rect x="26" y="21" rx="5" ry="5" width="86" height="86" />
      <Rect x="155" y="22" rx="3" ry="3" width="221" height="16" />
      <Rect x="155" y="57" rx="3" ry="3" width="150" height="16" />
      <Rect x="155" y="89" rx="3" ry="3" width="80" height="16" />
      <Rect x="255" y="89" rx="3" ry="3" width="122" height="16" />
    </ContentLoader>
  )
}

export default InitSkeleton
