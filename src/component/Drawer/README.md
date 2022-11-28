# Drawer

所有Drawer组件统一使用[NavigationDrawer](./NavigationDrawerWrapper)组件，使用方法请看[]()

## 替换原因
关于Drawer组件，在开发中一共用过三种：

### 反面案例
- 原生`Drawer`组件，使用原生代码实现。使用十分方便，基本直接用API调用即可，但拓展性很差，无法自定义。
- 全屏`Drawer`，使用一个外层`View`包裹整个内容，然后根据手势或者API调用弹出Drawer。使用起来也还行，但在代码逻辑上有点难受，
因为Drawer应该是一个独立的组件，而不应该去包括整个其它组件。
- 自制的`Drawer`，就在[index.tsx](index.tsx)下，原理是先用绝对定位将元素隐藏在屏幕下方，最后再使用动画控制Drawer的显示和退出，
缺点就是使用了Modal组件，退出动画如果过慢，会导致用户的点击事件无效，但如果过快，会导致动画不流畅。

### 最佳实践

[Stack Navigator#transparent-modals](https://reactnavigation.org/docs/stack-navigator/#transparent-modals)

`react-navigation`其实已经给了我们解决方案，我们只需要简单的定义一个二级路由界面即可。
这里主要说Drawer页面的处理。

首先就是要获取屏幕的高度：[React Native获取手机的各种高度](https://www.cnblogs.com/bbcfive/p/11123075.html)。

我们直接让我们的内容元素绝对定位，然后将其top值设置为屏幕高度:

```tsx
import {View} from "react-native";

<View 
  style={{
  position: 'absolute',
  top: deviceHeight,
  width: '100%',
}}>
  {/* ... */}
</View>
```

这样在打开屏幕的时候内容元素就是隐藏的了。

之后你需要监听内容元素的高度，然后利用`transform`将其平移到视图中：
```tsx

const transY = useRef(new Animated.Value(0)).current
const onLayout = ({ nativeEvent }: LayoutChangeEvent) => {
  console.log(nativeEvent)
  Animated.spring(transY, {
    toValue: -nativeEvent.layout.height,
    useNativeDriver: true,
    bounciness: 0,
  }).start()
}

...

<Animated.View
    onLayout={onLayout}
    style={{
      position: 'absolute',
      top: deviceHeight,
      width: '100%',
      transform: [{ translateY: transY }],
    }}>
    {/* ... */}
</Animated.View>
```

这样我们的Drawer就完成了。即使是动态增加内容，平移的值也会自动调整。

关于退出，需要在退出前将平移的值设置为0，给人一种滑出的效果。
