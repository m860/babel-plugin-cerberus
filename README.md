# cerberus-transform

(babel-plugin)cerberus转换工具

[ASTExplorer](https://astexplorer.net/)在线调试工具

[Babel插件开发手册](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md)

[babel-types API](https://babeljs.io/docs/en/babel-types)

## Usage

> NOTE:默认情况下`react`,`react-native`会被替换

```json
{
  "plugins": ["@cerberus/transform"]
}
```

如果需要替换自己的模块可以设置`modules`参数

```json
{
  "plugins": [["@cerberus/transform",{"modules": ["dateformat"]}]]
}
```

> NOTE: `modules`中设置的module名字和npm保持一致，在`Cerberus`库中导出的名字也必须一致。


## Examples

```
// input
import * as React from "react"
import React2 from "react"
import {memo,useState} from "react"
import {useRef as ur} from "react"
import {Text} from "react-native"
import df from "dateformat"
import {get as getPath} from "object-path"

// output
const React = $React$;
const React2 = $React$;
const memo = $React$.memo;
const useState = $React$.useState;
const ur = $React$.useRef;
const Text = $ReactNative$.Text;
const df = $Modules$["dateformat"];
const getPath = $Modules$["object-path"].get;
```

## TODO

- [ ] 处理`require("*.png")`,如果是资源文件需要进行重定向到`http`
    ```js 
    // input
    <Image source={require("logo.png")}/>
    // output
    <Image source={{uri:`${$MODULES$.BASE_URL}/${require("logo.png")}`}}/>
    ```