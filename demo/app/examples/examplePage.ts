import { NavigationButton } from "tns-core-modules/ui/action-bar/action-bar"
import { Frame, EventData, View } from "tns-core-modules/ui/frame/frame"
import { alert, prompt } from "~/nativescript-material-components/dialogs"
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array"
import * as http from "tns-core-modules/http"
import { isAndroid, isIOS } from "tns-core-modules/platform"
const builder = require("ui/builder")

function getObjectClass(obj) {
    if (typeof obj != "object" || obj === null) return false
    else return /(\w+)\(/.exec(obj.constructor.toString())[1]
}

interface DataItem {
    title: string
}

class Model {
    private _dataItems: ObservableArray<DataItem>
    public get dataItems() {
        if (!this._dataItems) {
            this.initDataItems()
        }
        return this._dataItems
    }

    private initDataItems() {
        if (!this._dataItems) {
            this._dataItems = new ObservableArray<DataItem>()

            for (let i = 1; i <= 50; i++) {
                this._dataItems.push({ title: `item ${i}` })
            }
        }
    }
    constructor(public title) {}
    onTap(args: EventData) {
        const obj = args.object as View
        const objId = obj.id
        console.log("tapped", getObjectClass(obj), objId)
        switch (objId) {
            case "alert": {
                alert("this is test Alert!")
                break
            }
            case "prompt": {
                prompt({
                    message: "this is test Prompt!",
                    okButtonText: "OK",
                    cancelButtonText: "Cancel",
                    title: "title?"
                })
                break
            }
            case "bottomsheet1": {
                obj.showBottomSheet({
                    view: "examples/bottomsheetinner1",
                    context: {},
                    closeCallback: objId => {
                        alert(`bottomsheet closed ${objId}`)
                    }
                })
                break
            }
            case "bottomsheet2": {
                obj.showBottomSheet({
                    view: "examples/bottomsheetinner2",
                    trackingScrollView: "listview",
                    context: {
                        dataItems: this.dataItems
                    },
                    closeCallback: objId => {
                        alert(`bottomsheet closed ${objId}`)
                    }
                })
                break
            }
        }
    }
}

export function onNavigatingTo(args) {
    const page = args.object
    const context = page.navigationContext

    page.bindingContext = new Model(context.example)

    try {
        const theModule = require("./" + context.example)
        console.log(
            "trying to load onNavigatingTo for",
            "examples/" + context.example
        ),
            theModule
        if (theModule && theModule.onNavigatingTo) {
            theModule.onNavigatingTo(args)
        }
    } catch (e) {
        // console.log('error', e)
    }

    const container = page.getViewById("container")
    const component = builder.load({
        path: "examples",
        name: context.example
    })

    container.addChild(component)
}

export function onBack(args) {
    const navigationButton = args.object as NavigationButton
    const frame = navigationButton.page.frame as Frame
    frame.goBack()
}