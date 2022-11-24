# Router

该目录下管理整个APP的路由，可用的路径可以参考类型[index.tsx](./index.tsx)`#RouterTypes`。

该接口，键为路由的名称，值为必须要传递的参数。

## 其它

### 在非组件下使用路由
正常情况下，只能在组件内才能进行路由操作，但有些时候不得不在非组件内进行路由操作。

因此利用`pubsub`来订阅相关事件以实现在外部进行路由跳转。

基础代码在[tabs](../tabs/index.tsx)下：
```ts
const NAVIGATION_EVENT_KEY = 'navigation'

type Nav = {
  path: string
  param: any
}

/**
 * 在非组件中进行路由push操作
 * @param args
 */
export const navigationPush = <RouteName extends keyof RouterTypes>(
  ...args: FunctionArgType<RouteName>
) => {
  pubsub.publish(NAVIGATION_EVENT_KEY, { path: args[0], param: args[1] })
}

const TabBar = () => {
  const nav = useNavigation<any>()
  useEffect(() => {
    pubsub.subscribe(NAVIGATION_EVENT_KEY, (message, data: Nav) => {
      nav.navigate(data.path, data.path)
    })
  }, [])
  
  // ...
  
}

```
只需要引入`navigationPush`方法即可在外部进行路由跳转。

### useNav

由于`react-navigation`对于路由`replace`操作比较麻烦，没有显式定义API以供调用，因此在该hook中对`replace`操作进行了封装。
