# 组件列表

这里介绍一些APP使用的组件(包括自己封装的和第三方库). 一些不是很复杂的组件写的不是很详细。

[TOC]

## Drawer(抽屉)

✈️[Drawer](component/Drawer/index.tsx)

**说明**:

从底部出现的抽屉组件，已经具备**自适应高度**的功能.

**参数**

|   属性名    |    类型     |   说明   |
|:--------:|:---------:|:------:|
|  style   | ViewStyle | 内容容器样式 |
| children | ReactNode |  容器内容  |

**可用方法**
- `showDrawer`: 打开抽屉
- `closeDrawer`: 关闭抽屉(用户也可以主动点击非内容区域关闭)

**其它**

该组件可以配合其它组件完成更多功能。

### 底部菜单
✈️[BottomMenu](component/Drawer/BottomMenu/index.tsx)

参数:

|   属性名    |       类型        |     说明      |
|:--------:|:---------------:|:-----------:|
| onSelect |    OnSelect     | 当某个选项被选中后触发 |
|  items   | Array<MenuItem> |    菜单内容     |
|  title   |     string      |    菜单标题     |

### 选择器
✈️[Picker](component/Drawer/Picker/index.tsx)

参数:

|    属性名     |           类型           |     说明     |
|:----------:|:----------------------:|:----------:|
|   items    | string &brvbar; number |   选择器项目    |
|  onSelect  | (index:number) => void | 被选中后触发的回调  |
| initSelect |         number         | 初始时选择哪一个项目 |
|   title    |         string         |     标题     |

## Loading(加载)

✈️[Loading](component/Loading/index.tsx)

**说明**:

全屏加载组件，该组件已经以单例的模式挂载在最外层了，直接调用其静态方法就可以实现全屏加载。

**可用方法**
- `showLoading`: 开始加载
- `hideLoading`: 停止加载

示例:
```javascript
// 开始加载
Loading.showLoading()
Loading.showLoading('加载中...')

// 停止加载
Loading.hideLoading()
```

## Icons(字体图标)

✈️[Loading](component/Icons/index.tsx)

*吐槽: 这里当初脑抽用了复数，但想到要改的时候用到的地方太多了又不好改*

**说明**:

查看可用字体图标: ✈️[index.html](assets/fonts/demo_index.html) (可能需要拉到本地后才能看)

示例:

```jsx
<Icons iconText="&amp;#xe611;" />
```

**参数**

|     属性名      |     类型     |      说明       |
|:------------:|:----------:|:-------------:|
|   iconText   |   string   |     字符图标      |
|     size     |   number   |     图标大小      |
|    color     |   string   |     图标颜色      |
| parseUnicode |  boolean   | 是否主动解析Unicode |
|   onPress    | () => void |    当被点击时触发    |

注: 当`iconText`的值没有被主动被解析为Unicode(比如`&amp;#xe611;`，这个时候被认作了一个字符串，而非某一个字符)，
就需要将`parseUnicode`的值设置为true来主动解析Unicode

## Input(表单组件)

Input这个名字并没有被封装为一个组件，它代表了一类组件。

### useFormChecker(表单检查)
✈️[useFormChecker](component/Input/index.ts)

**说明**:

为了方便检查表单而设置，**只能管理继承了InputComponent**的组件.

**示例**:

```javascript
const [name, setName] = useState()
const [email, setEmail] = useState()

const nameInputRef = useRef(null)
const emailInputRef = useRef(null)

useFormChecker([
  {
      name: '姓名',
      ref: nameInputRef,
      minLength: 2,
      maxLength: 4,
  },
  {
      name: '邮箱',
      ref: emailInputRef,
      allowEmpty: true,
      check: (text: string, name: string) => {
        // checkIsEmail需要自己实现
        if (!checkIsEmail(text)) {
          return name + '格式不正确'
        }
        return undefined
      }
  }
])
```

### SimpleInput(简单输入框)

✈️[SimpleInput](component/Input/SimpleInput/index.tsx)

**说明**:

简单的字符输入框。

**参数**:

|       属性名       |           类型           |             说明             |
|:---------------:|:----------------------:|:--------------------------:|
| textInputProps  |     TextInputProps     | 内部TextInput的props(部分属性不可用) |
|   rowTipText    |         string         |       为输入框最右边添加提示文字        |
| rowTipTextStyle |       TextStyle        |           提示文字样式           |
|  onChangeText   | (text: string) => void |        当输入框内容改变时触发         |
|      style      |       ViewStyle        |           输入框样式            |

注：TextInput以下属性不可用
- `style`
- `ref`
- `onFocus`
- `onBlur`
- `onChangeText`: 请使用组件提供的onChangeText
- `placeholderTextColor`

**方法**

-`showErrorText`: 在输入框旁边显示错误文字(当用户修改任意内容后自动消失)

### ImageUploadContainer(图片上传)

✈️[ImageUploadContainer](component/Input/ImageUploadContainer/index.tsx)

**说明**:

图片上传容器。

**参数**:

|          属性名           |       类型        |           说明            |
|:----------------------:|:---------------:|:-----------------------:|
|         title          |     string      |          容器标题           |
|         limit          |     number      |        最多可以上传多少张        |
|       tipMessage       |     string      | 提示文字(会在标题旁显示一个问号，点击后显示) |
|        tipTitle        |     string      |          提示标题           |
| imagePreviewResizeMode | ImageResizeMode |         预览图缩放模式         |
|          uid           |     number      |     当前正在上传图片的用户uid      |

**方法**:

方法有很多，但是这里直接说图片上传流程：

1. 首先调用`bindUploadSign`绑定上传所需签名

    获取方式可见: [getUserSpaceUploadSign](api/server/cos/index.ts)

2. 确定所有图片都绑定完毕后调用`uploadImage`方法
    
## AutoCollapsible(折叠窗)

✈️[AutoCollapsible](component/AutoCollapsible/index.tsx)

## Button(按钮)

这里有两个实现:

✈️[ColorfulButton](component/Button/ColorfulButton/index.tsx)

✈️[PrimaryButton](component/Button/PrimaryButton/index.tsx)

推荐使用第一个，第二个在按钮大小上总是会有莫名其妙的BUG

## Cards(卡片)

卡片只在[设置界面](views/SettingsPage/index.tsx)里使用过，可以参照里面的使用方式使用。
