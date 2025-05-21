import Renderer2D from "../../lib/twoD/Renderer2D.ts";

import Object2D from "../../lib/twoD/Object2D.ts";
import Sprite from "../../lib/twoD/Sprite.ts";
import Text from "../../lib/twoD/Text.ts";
import Renderer from "../../lib/Renderer.ts";
import {Textures} from "../../data/Textures.ts";
import FontPool from "../../lib/twoD/FontPool.ts";
import Font from "../../lib/twoD/Font.ts";
import LevelHandler from "../Levels/LevelHandler.ts";

export default class UI2D{
    private renderer2D: Renderer2D;
    private root: Object2D;


    constructor(renderer:Renderer,renderer2D:Renderer2D) {
        this.renderer2D=renderer2D
        this.root = renderer2D.root


        let sprite  =new Sprite(renderer,renderer.getTexture(Textures.BLUE_NOISE))
        this.root.addChild(sprite)
        sprite.x =200
        sprite.y =200
        sprite.scale =1
        let font = FontPool.getFont("bold") as Font;

        let text = new Text(renderer,font,35,"testing123 4")
        text.x =200
        text.y =200
        this.root.addChild(text)

        LevelHandler.
    }



}
