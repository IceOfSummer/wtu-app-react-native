import PubSub from 'pubsub-js'

/**
 * dispatch, 为防止循环依赖，单独从store.ts抽离出来
 */
const storeDispatch = (data: any) => {
  PubSub.publish('ReduxStoreDispatch', data)
}

export default storeDispatch
