# babel配置

## 配置文件

babel有两种并行的配置读取方式：

- 全局配置文件
    - `babel.config.json`或者其他等价后缀名的文件
- 局部配置文件
    - `.babelrc.json`或者其他等价后缀名的文件
    - 存在`babel`配置的`package.json`文件

### 全局配置文件

babel会从配置的`root`项中寻找`babel.config.json`或者其等价文件，默认是命令运行的当前目录。
例如，有个项目结构如下：

```
root
│   babel.config.js    
│   package.json    
└───packages
│       └───react-project
│                │  package.json
│                │  webpack.config.js
```

在`root`目录下运行编译命令，则会在`root`目录寻找配置文件；在`react-project`目录下运行编译命令，则会在`react-project`目录寻找配置文件(当然这是找不到的)

当然，我们也可以通过显示地修改配置中`configFile`项，来重新指定全局配置文件

### 局部配置文件

babel会从当前正在编译的文件所在目录向上寻找`.babelrc.json`或者其他等价文件。我们可以使用局部配置来重置全局配置。但是，有一些必须注意的事项：

- 一旦遇到`package.json`文件，整个查找过程将中止，因此局部配置文件适用于独立的package
- 正在编译的文件必须在配置项`babelrcRoots`设置的目录下，否则查找过程将会跳过该文件

这意味着：

- `.babelrc.json`必须存在于自己的package中
- `.babelrc.json`所在的package如果不在Babel的`root`或者配置项`babelrcRoots`中，将会被忽略

## @babel/preset-env

`@babel/preset-env`是一套es6插件预置合集，能够根据你配置的运行环境自动决定要转义的代码

### useBuiltIns

该配置决定了`@babel/preset-env`如何处理polyfills
`useBuiltIns`有三个值：`entry`|`usage`|`false`，默认是`false`

当使用`entry`|`usage`时，`@babel/preset-env`会在文件中直接添加关于`core-js`的引用，所以需要安装`core-js`模块

```bash
npm install core-js@3 --save
```

#### useBuiltIns:entry

使用这个配置将会根据配置的运行环境，替换入口文件中：`import "core-js/stable"`和`import "regenerator-runtime/runtime"`语句，因此需要有一个入口文件，并显示引用以上内容

#### useBuiltIns:usage

会在每个文件顶部，根据配置的运行环境，结合文件内容引入相应的`polyfill`

#### useBuiltIns:false

不自动为每个文件添加polyfill，以及不将`import "core-js"`和`import "@babel/polyfill"`转换为独立的polyfill

### core-js

指定`core-js`版本，以及是否开启对提案中的内容进行转换
`core-js`的值：`2`|`3`|`{ version: 2 | 3, proposals: boolean }`，默认值是`2`

这个选项只对`useBuiltIns:entry`和`useBuiltIns:usage`生效，用于指定`@babel/preset-env`插入正确的`core-js`版本
默认`core-js`是不对提案内容进行支持的，如果想要支持提案内容，有以下方式配置：

- `useBuiltIns:entry`：可以在入口文件直接引入[提案polyfill](https://github.com/zloirock/core-js/tree/master/packages/core-js/proposals)，比如：`import "core-js/proposals/string-replace-all"`
- `useBuiltIns:usage`：需要将`proposals`设置为`true`，即：`{ version: 2 | 3, proposals: true }`

# eslint配置

## 配置文件

eslint有两种使用配置文件的方式：

- 第一种方式通过使用`.eslintrc.*`或`package.json`配置文件。eslint将自动从待检测文件所在目录开始，逐级向上查找父目录，直到根目录或者指定了`root:true`的配置文件
- 第二种方式通过命令行，将配置文件路径直接传递给`CLI`，例如：

```bash
eslint -c myconfig.json myfiletotest.js
```

### 优先级

假设有如下目录结构：

```
your-project
├── .eslintrc
├── lib
│ └── source.js
└─┬ tests
  ├── .eslintrc
  └── test.js
```

在`/lib`目录下的文件将使用项目根目录的`.eslintrc`，当遍历到`tests`目录时，它下面的文件除了使用根目录的`.eslintrc`外，还将使用`tests`目录下自身的`.eslintrc`,
最终的配置项是二者的组合，并且最靠近待检测文件的`.eslintrc`优先

假如同层目录下有多个配置文件，它们的优先级依次如下：

1. .eslintrc.js
2. .eslintrc.cjs
3. .eslintrc.yaml
4. .eslintrc.yml
5. .eslintrc.json
6. .eslintrc
7. package.json

前面的优先级的文件一旦使用，后面的文件将被忽略

# webpack配置

## resolve

`resolve`用于设置webpack如何解析模块

```
{
    resolve: {
        modules: ['node_modules'], // 指定webpack从哪个目录解析模块
        extensions: ['.js', 'jsx'], // 依次解析指定后缀名文件
        alias: { // 为引用的模块设置别名，指定其查找目录
            Utilities: path.resolve(__dirname, 'src/utilities/'),
        },
    }
}
```

### resolve.modules 

`resolve.modules`指定webpack从哪个目录解析模块，可以设置绝对路径和相对路径

- 绝对路径：只在指定的目录查找文件
- 相对路径：会从当前目录开始，依次查找其父级目录，直到找到文件为止
