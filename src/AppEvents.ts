import { ServerUserInfo } from './redux/types/serverUserTypes'

/**
 * 事件列表，<b>事件的参数只能使用一个！</b>
 */
interface Events {
  /**
   * 当登录完成时
   * @param currentUserInfo 当前的用户信息
   * @param previousUserInfo 之前的用户信息
   */
  onLoginDone: (data: {
    currentUserInfo: ServerUserInfo
    previousUserInfo?: ServerUserInfo
  }) => void
  /**
   * 当用户切换时，当第一次启动APP时，若用户登录了，也会触发
   */
  onUserChange: (userInfo: ServerUserInfo) => void
  /**
   * 数据库初始化完毕事件
   */
  onDatabaseInitDone: () => void
  /**
   * 当注销登录时(无论是主动还是被动)
   */
  onLogout: () => void
  /**
   * 在数据库马上就要执行完前(此时数据库可用，该事件只是提供了一个更高的优先级)
   */
  beforeDatabaseInitDone: () => void
  /**
   * app数据库检查完毕(此时数据库可能不可用)
   */
  appDatabaseCheckDone: () => void
  /**
   * 当APP启动时
   */
  onAppLaunch: () => void
}

export default class AppEvents {
  private static readonly KEY_PREFIX = 'AppEvents'

  private static getEventKey(event: keyof Events) {
    return AppEvents.KEY_PREFIX + event
  }

  public static trigger<T extends keyof Events>(
    event: T,
    ...args: Parameters<Events[T]>
  ) {
    PubSub.publish(AppEvents.getEventKey(event), args)
  }

  public static subscribe<T extends keyof Events>(
    event: T,
    callback: (...args: Parameters<Events[T]>) => void
  ) {
    return PubSub.subscribe(AppEvents.getEventKey(event), (message, data) => {
      // @ts-ignore
      callback(data)
    })
  }

  public static subscribeOnce<T extends keyof Events>(
    event: T,
    callback: (...args: Parameters<Events[T]>) => void
  ) {
    return PubSub.subscribeOnce(
      AppEvents.getEventKey(event),
      (message, data) => {
        // @ts-ignore
        callback(data)
      }
    )
  }
}
