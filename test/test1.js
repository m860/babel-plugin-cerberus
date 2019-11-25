/**
 * @author Jean.h.ma 2019-11-22
 */
import * as React from "react"
import {Text} from "react-native"
import df from "dateformat"
import {get as getPath} from "object-path"

export default function () {
    const people = {
        name: "Hello"
    };
    return <Text>{getPath(people, "name")}:{df(new Date(), "yyyy-mm-dd")}</Text>
}