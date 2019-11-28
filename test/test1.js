/**
 * @author Jean.h.ma 2019-11-22
 */
import * as React from "react"
import {Text, View, Image} from "react-native"
import df from "dateformat"
import {get as getPath} from "object-path"
import imageSource1 from "./logo.png"

const imageSource2 = require("./logo.png");

export default function () {
    const people = {
        name: "Hello"
    };
    return (
        <View>
            <Text>{getPath(people, "name")}:{df(new Date(), "yyyy-mm-dd")}</Text>
            <Image source={require("./logo.png")}/>
        </View>
    )
}