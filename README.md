# cerberus-babel-plugin-transform

cerberus转换工具

## Install

`npm i -D @m860/cerberus-babel-plugin-transform`

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


## Option

```flow js
type Option={
    /**
     * 不需要被打包的公共模块
     */
    modules?:Array<string>,
    /**
     * 需要处理的资源文件的正则表达式，默认：/\.(gif|png|jpeg|jpg|svg)$/i 
     */
    resourceTest?:?RegExp
};
```

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
const React = $REACT$;
const React2 = $REACT$;
const memo = $REACT$.memo;
const useState = $REACT$.useState;
const ur = $REACT$.useRef;
const Text = $REACTNATIVE$.Text;
const df = $MODULES$["dateformat"];
const getPath = $MODULES$["object-path"].get;
```

<!--

[ASTExplorer](https://astexplorer.net/)在线调试工具

[Babel插件开发手册](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md)

[babel-types API](https://babeljs.io/docs/en/babel-types)

## TODO

- [ ] 处理`require("*.png")`,如果是资源文件需要进行重定向到`http`
    ```js 
    // input
    <Image source={require("logo.png")}/>
    // output
    <Image source={{uri:`${$MODULES$.BASE_URL}/${require("logo.png")}`}}/>
    ```
- [ ] `modules`支持别名设置
    ```
    // 例如
    {
        modules:[
            {
                name:"dateformat",
                exportName:"df"
            }
        ]
    }
    ```
-->