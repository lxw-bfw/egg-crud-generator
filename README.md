# Egg CRUD Generator (`egg-gen`)

English | [中文](README.zh.md)

A powerful and customizable CLI tool to automate CRUD (Create, Read, Update, Delete) file generation for your `egg.js` + `egg-mongoose` projects. Say goodbye to repetitive boilerplate code!

## ✨ Features

-   **JSON-driven**: Define your entire business model in a single JSON file.
-   **Full Stack Generation**: Generates `Controller`, `Service`, `Model`, and `Router` files in one go.
-   **Customizable**: Supports generating special business logic methods and routes.
-   **Smart Validation**: Auto-generates `egg-validate` rules based on your model fields.
-   **Project Validation**: Ensures it runs only on valid `egg.js` + `egg-mongoose` projects.
-   **Built with TypeScript**: Provides a robust and maintainable codebase.

## 🚀 Installation

Install it globally to use it anywhere on your system:

```bash
npm install -g egg-crud-generator
```

## 💡 Usage

The primary command is `generate` (or its alias `g`).

```bash
egg-gen generate <configFile> [options]
```

### Arguments

-   `<configFile>`: (Required) The path to your model definition JSON file.

### Options

-   `-p, --project <projectPath>`: (Optional) The path to your target egg.js project. If not provided, it defaults to the current working directory.
-   `--help`: Display help for command.

### Example

1.  Navigate to your egg.js project's root directory.
2.  Create a `article.json` file to define your "Article" model.
3.  Run the command:

```bash
egg-gen g ./article.json
```

This will generate the following files inside your project:
-   `app/controller/article.js`
-   `app/service/article.js`
-   `app/model/article.js`
-   It will also append the new routes to `app/router.js`.

## ⚙️ The `model.json` Configuration File

This is the heart of the generator. Here is a full-featured example:

```json
{
  "modelName": "Article",
  "modelDescription": "文章",
  "routeName": "article",
  "fields": [
    { "name": "title", "type": "String", "required": true, "description": "Article title" },
    { "name": "content", "type": "String", "required": true, "description": "Article content" },
    { "name": "authorId", "type": "ObjectId", "ref": "User", "description": "Author's User ID" },
    { "name": "viewCount", "type": "Number", "default": 0, "description": "Number of views" },
    { "name": "isPublished", "type": "Boolean", "default": false, "description": "Publication status" },
    { "name": "tags", "type": "Array", "subType": "String", "description": "Article tags" }
  ],
  "specialControllers": [
    {
      "name": "publishArticle",
      "method": "POST",
      "route": "/publish/:id",
      "description": "Publish an article",
      "param": "id",
      "serviceMethod": "publish"
    }
  ],
  "specialServices": [
    {
      "name": "publish",
      "params": ["id"],
      "description": "Business logic to publish an article"
    }
  ]
}
```

### Field Definitions:

| Property             | Type      | Required | Description                                                              |
| -------------------- | --------- | -------- | ------------------------------------------------------------------------ |
| `modelName`          | `string`  | Yes      | The name of your model in PascalCase (e.g., "Article").                  |
| `modelDescription`   | `string`  | No       | A human-readable description for comments.                               |
| `routeName`          | `string`  | Yes      | The route name in lowercase, used for URLs (e.g., "article").            |
| `fields`             | `Array`   | Yes      | An array of field objects defining the Mongoose schema.                  |
| `specialControllers` | `Array`   | No       | An array of objects to define non-RESTful controller methods.            |
| `specialServices`    | `Array`   | No       | An array of objects to define corresponding special service methods.     |

#### `fields` Object:

| Property      | Type      | Description                                                    |
| ------------- | --------- | -------------------------------------------------------------- |
| `name`        | `string`  | Field name.                                                    |
| `type`        | `string`  | Mongoose schema type (`String`, `Number`, `Boolean`, `Date`, `ObjectId`, `Array`). |
| `required`    | `boolean` | If the field is required. Auto-generates validation rules.     |
| `default`     | `any`     | Default value for the field.                                   |
| `ref`         | `string`  | For `ObjectId` type, specifies the referenced model name.      |
| `subType`     | `string`  | For `Array` type, specifies the type of elements in the array. |
| `description` | `string`  | A description for comments.                                    |

#### `specialControllers` & `specialServices` Objects:

These allow you to generate skeletons for custom business logic beyond simple CRUD. The generator will create corresponding methods in the controller and service files, which you can then fill in.



## 📜 License

This project is [MIT](https://github.com/your-username/egg-crud-generator/blob/main/LICENSE) licensed.