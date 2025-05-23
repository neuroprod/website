import Renderer from "../../lib/Renderer.ts";
import Object2D from "../../lib/twoD/Object2D.ts";
import FontPool from "../../lib/twoD/FontPool.ts";
import Font from "../../lib/twoD/Font.ts";
import Text from "../../lib/twoD/Text.ts";
import LevelHandler from "../Levels/LevelHandler.ts";

export default class Menu {
    menuRoot = new Object2D()
    private renderer: Renderer;
    private width: number;

    private items: Array<Text> = []
private space =10;
    constructor(renderer: Renderer) {
        this.renderer = renderer;


        let font = FontPool.getFont("bold") as Font;
        let size = 0;
        let count = 0;
        for (let item of LevelHandler.navigationLevels) {
            let text = new Text(renderer, font, 35, item)
            text.x = size
            text.y = 0
            size += text.width + this.space;
            this.menuRoot.addChild(text)
            text.onClick = () => {

                LevelHandler.setLevel(item)
            }
            this.items.push(text)
            count++
            if (count != LevelHandler.navigationLevels.length) {
                let slash = new Text(renderer, font, 35, "/")
                slash.x = size
                slash.mouseEnabled =false
                size += slash.width + this.space;
                this.menuRoot.addChild(slash)
            }

        }
        this.width = size;


    }


    update() {
        this.menuRoot.x = this.renderer.width - this.width-this.space*2
        this.menuRoot.y = 10
    }

    setLevel(key: string) {
        let found = false;
        for (let i of this.items) {
            if (i.id == key) {
                ///
                i.mouseEnabled =false
                found = true;
            } else {
                i.mouseEnabled =true
            }
        }
        if (!found) {
            this.hide()
        } else {
            this.show()
        }
    }

    private hide() {
        this.menuRoot.visible = false
    }

    private show() {
        this.menuRoot.visible = true
    }
}
