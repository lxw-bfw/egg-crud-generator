# Egg CRUD 生成器 (`egg-gen`)

一个强大且可定制的命令行工具，专为您的 `egg.js` + `egg-mongoose` 项目自动化生成CRUD（增删改查）文件。从此告别重复的样板代码！

## ✨ 产品特性

-   **JSON驱动**: 在单个JSON文件中定义您的整个业务模型。
-   **全栈代码生成**: 一键生成 `Controller`、`Service`、`Model` 和 `Router` 文件。
-   **高度可定制**: 支持生成特殊的业务逻辑方法和路由。
-   **智能校验**: 根据您的模型字段，自动生成 `egg-validate` 校验规则。
-   **项目校验**: 确保只在合法的 `egg.js` + `egg-mongoose` 项目中运行。
-   **TypeScript构建**: 提供了一个健壮且易于维护的代码库。

## 🚀 安装

全局安装本工具，即可在您系统的任何位置使用：

```bash
npm install -g egg-crud-generator
```

## 💡 使用方法

本工具的核心命令是 `generate` (别名 `g`)。

```bash
egg-gen generate <configFile> [options]
```

### 参数

-   `<configFile>`: (必需) 指向您的模型定义JSON文件的路径。

### 选项

-   `-p, --project <projectPath>`: (可选) 指向您的目标egg.js项目的路径。如果未提供，则默认为当前工作目录。
-   `--help`: 显示命令的帮助信息。

### 使用示例

1.  首先，进入您的egg.js项目的根目录。
2.  创建一个 `article.json` 文件来定义您的“文章”模型。
3.  运行以下命令：

```bash
egg-gen g ./article.json
```

此命令将在您的项目中自动生成以下文件：
-   `app/controller/article.js`
-   `app/service/article.js`
-   `app/model/article.js`
-   同时，新的路由规则将被**追加**到 `app/router.js` 文件中。

## ⚙️ `model.json` 配置文件详解

这是本生成器的核心。以下是一个功能完备的配置示例：

```json
{
  "modelName": "Article",
  "modelDescription": "文章",
  "routeName": "article",
  "fields": [
    { "name": "title", "type": "String", "required": true, "description": "文章标题" },
    { "name": "content", "type": "String", "required": true, "description": "文章内容" },
    { "name": "authorId", "type": "ObjectId", "ref": "User", "description": "作者的用户ID" },
    { "name": "viewCount", "type": "Number", "default": 0, "description": "浏览量" },
    { "name": "isPublished", "type": "Boolean", "default": false, "description": "发布状态" },
    { "name": "tags", "type": "Array", "subType": "String", "description": "文章标签" }
  ],
  "specialControllers": [
    {
      "name": "publishArticle",
      "method": "POST",
      "route": "/publish/:id",
      "description": "发布一篇文章",
      "param": "id",
      "serviceMethod": "publish"
    }
  ],
  "specialServices": [
    {
      "name": "publish",
      "params": ["id"],
      "description": "用于发布文章的业务逻辑"
    }
  ]
}
```

### 字段定义说明

| 属性                 | 类型     | 是否必需 | 描述                                                                |
| -------------------- | -------- | -------- | ------------------------------------------------------------------- |
| `modelName`          | `string` | 是       | 您的模型名称，采用帕斯卡命名法（PascalCase），例如 "Article"。        |
| `modelDescription`   | `string` | 否       | 人类可读的描述，用于生成代码注释。                                    |
| `routeName`          | `string` | 是       | 用于URL的路由名称，全小写，例如 "article"。                           |
| `fields`             | `Array`  | 是       | 一个字段对象数组，用于定义Mongoose的Schema。                          |
| `specialControllers` | `Array`  | 否       | 一个对象数组，用于定义非RESTful标准的Controller方法。               |
| `specialServices`    | `Array`  | 否       | 一个对象数组，用于在Service层生成对应的特殊业务方法骨架。             |

#### `fields` 对象详解:

| 属性          | 类型      | 描述                                                                    |
| ------------- | --------- | ----------------------------------------------------------------------- |
| `name`        | `string`  | 字段名称。                                                              |
| `type`        | `string`  | Mongoose的Schema类型 (`String`, `Number`, `Boolean`, `Date`, `ObjectId`, `Array`)。 |
| `required`    | `boolean` | 字段是否必需。此项会影响自动生成的校验规则。                              |
| `default`     | `any`     | 字段的默认值。                                                          |
| `ref`         | `string`  | 当类型为 `ObjectId` 时，指定其引用的模型名称。                            |
| `subType`     | `string`  | 当类型为 `Array` 时，指定数组内元素的类型。                               |
| `description` | `string`  | 字段的描述，用于生成注释。                                                |

#### `specialControllers` & `specialServices` 对象详解:

这两个配置项允许您为超越简单CRUD的自定义业务逻辑生成代码骨架。生成器会在controller和service文件中创建相应的方法，您只需填充具体的业务实现即可。



## 📜 开源许可

本项目基于 [MIT](https://github.com/your-username/egg-crud-generator/blob/main/LICENSE) 许可开源。