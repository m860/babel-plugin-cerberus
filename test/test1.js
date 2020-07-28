/**
 * @flow
 */
import * as React from "react"
import {Text, View, Image,Animated} from "react-native"
import df from "dateformat"
import {get as getPath} from "object-path"
import imageSource1 from "./logo.png"

const imageSource2 = require("./logo.png");

// skip
const a=$MODULES$.resolveAsset(require("./logo.png"))

export default function () {
    const people = {
        name: "Hello"
    };

    const a=["test"].map((item)=>{
        return <Text key={item}>{item}</Text>
    })

    const b=<Text>b</Text>
    return (
        <View>
            <Text>{getPath(people, "name")}:{df(new Date(), "yyyy-mm-dd")}</Text>
            <Image source={require("./logo.png")}/>
        </View>
    )
}

const demo2=React.memo<*>(function(){
    return <Text>demo2</Text>
})
