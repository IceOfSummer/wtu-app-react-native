# 消息管理

[toc]

该目录下为消息管理(展示)的一些代码。

## 主要实现

首先`AbstractMessage`类是**所有**消息的抽象基类([AbstractMessage.tsx](AbstractMessage.ts)文件里)，如果想让消息显示在用户界面上，首先应该实现该类。

建议所有的实现类中包含一个静态常量：

```typescript
import AbstractMessage from "./AbstractMessage";

class YourMessage extends AbstractMessage {
    // please add this property
    public static readonly MESSAGE_TYPE = 0
}

```
如果你的消息不需要被解析（例如是运行时生成的），你可以忽略该操作。

具体的例子可见[TimeMessage.tsx](system/TimeMessage.tsx)，这是一个用于在消息界面生成时间的例子，它是在运行时动态创建的。
### 消息解码

在消息解码之前先了解消息的组成：
```plain
§messageType§content
```
`messageType`：消息类型

`content`：代表消息的内容

`§`：分隔符
___

[MessageManager.ts](MessageManager.ts)负责消息的解析，其主要原理如下：

首先在[AbstractMessage.tsx](AbstractMessage.ts)中有一个`ChatMessageFactory`类型：
```typescript
export type ChatMessageFactory = (content: string, chatMessage: ChatMessage) => AbstractMessage
```

自定义的消息若想要被解析，则需要实现该方法，在该方法中创建消息的实例。

之后在[MessageManager.ts](MessageManager.ts)进行“注册”：
```typescript
const messageFactoryMapping: Array<ChatMessageFactory> = []
// add here
messageFactoryMapping[YourMessage.MESSAGE_TYPE] = YourFactory
```

你可以在[MessageManager.ts](MessageManager.ts)的`parseMessage`方法中找到具体的解析步骤，每次消息在获取类型后，直接根据数组来调用对应的方法来创建实例

### 消息编码

消息编码你需要实现`AbstractMessage`中的`encodeMsg`方法。

在这里你只需要关注消息正文的编码即可，其它的内容将会在外部自动完成。
如果你不想对消息进行编码（即没有必要发送给服务器）**你可以让它返回一个空串**，外部操作在检查到空串后会自动阻止到该消息发送到服务器。

### 消息展示

最关键的消息容器：[MessageArea](component/MessageContainer.tsx)。这个组件会将加载的`AbstractMessage`展示到屏幕上。

`MessageContainer`组件则是负责渲染头像框等组件。如果你不需要渲染头像框，可以将`AbstractMessage#_hideAvatar`设置为false。

最后调用你实现的`render`方法来展示具体的消息。



## 已经实现消息

|                文件名(.tsx)                |      简要说明      | 消息类型(索引) | 能否发送到服务器 |
|:---------------------------------------:|:--------------:|:--------:|:--------:|
|  [TimeMessage](system/TimeMessage.tsx)  |   显示时间的一条消息    |    ×     |    ×     |
| [NormalMessage](chat/NormalMessage.tsx) | 普通消息(或解析失败的消息) |    0     |    √     |

