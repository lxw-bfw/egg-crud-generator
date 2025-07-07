// src/types/config.ts

// 定义 Mongoose 支持的基础 Schema 类型
type MongooseSchemaType =
  | 'String'
  | 'Number'
  | 'Boolean'
  | 'Date'
  | 'ObjectId'
  | 'Array'
  | 'Object';

// 定义 HTTP 请求方法类型
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * 定义模型字段的接口。
 * Corresponds to the `fields` object in the configuration.
 */
export interface ModelField {
  /**
   * Field name.
   * 字段名称。
   */
  name: string;

  /**
   * Mongoose schema type (`String`, `Number`, `Boolean`, `Date`, `ObjectId`, `Array`).
   * Mongoose的Schema类型。
   */
  type: MongooseSchemaType;

  /**
   * If the field is required. Auto-generates validation rules.
   * 字段是否必需。此项会影响自动生成的校验规则。
   */
  required?: boolean;

  /**
   * Default value for the field.
   * 字段的默认值。
   */
  default?: any;

  /**
   * For `ObjectId` type, specifies the referenced model name.
   * 当类型为 `ObjectId` 时，指定其引用的模型名称。
   */
  ref?: string;

  /**
   * For `Array` type, specifies the type of elements in the array.
   * 当类型为 `Array` 时，指定数组内元素的类型。
   */
  subType?: MongooseSchemaType;

  /**
   * A description for comments.
   * 字段的描述，用于生成注释。
   */
  description?: string;
}

/**
 * 定义特殊Controller方法的接口。
 * Corresponds to the `specialControllers` object in the configuration.
 */
export interface SpecialController {
  /**
   * Method name (e.g., 'publishArticle').
   * 方法名称。
   */
  name: string;

  /**
   * HTTP request method.
   * HTTP请求方法。
   */
  method: HttpMethod;

  /**
   * Relative path mounted after the base route (e.g., '/publish/:id').
   * 挂载在基础路由后的相对路径。
   */
  route: string;

  /**
   * A description for comments.
   * 方法的描述，用于生成注释。
   */
  description?: string;

  /**
   * If the route has a parameter (like :id), specify it here.
   * 如果路由中有参数（如:id），在此处指定参数名。
   */
  param?: string;

  /**
   * The name of the service layer method that this controller method calls.
   * 该Controller方法调用的Service层的方法名。
   */
  serviceMethod: string;
}

/**
 * 定义特殊Service方法的接口。
 * Corresponds to the `specialServices` object in the configuration.
 */
export interface SpecialService {
  /**
   * Method name (e.g., 'publish').
   * 方法名称。
   */
  name: string;

  /**
   * An array of parameters for the method.
   * 方法的参数列表。
   */
  params: string[];

  /**
   * A description for comments.
   * 方法的描述，用于生成注释。
   */
  description?: string;
}

/**
 * 定义模型配置文件 (model.json) 的主接口。
 * This is the main interface for the entire configuration file.
 */
export interface ModelConfig {
  /**
   * The name of your model in PascalCase (e.g., "Article").
   * 您的模型名称，采用帕斯卡命名法。
   */
  modelName: string;

  /**
   * A human-readable description for comments.
   * 人类可读的描述，用于生成代码注释。
   */
  modelDescription?: string;

  /**
   * The route name in lowercase, used for URLs (e.g., "article").
   * 用于URL的路由名称，全小写。
   */
  routeName: string;

  /**
   * An array of field objects defining the Mongoose schema.
   * 一个字段对象数组，用于定义Mongoose的Schema。
   */
  fields: ModelField[];

  /**
   * An array of objects to define non-RESTful controller methods.
   * (可选) 一个对象数组，用于定义非RESTful标准的Controller方法。
   */
  specialControllers?: SpecialController[];

  /**
   * An array of objects to define corresponding special service methods.
   * (可选) 一个对象数组，用于在Service层生成对应的特殊业务方法骨架。
   */
  specialServices?: SpecialService[];
}
