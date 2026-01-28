
import { Textures } from "../../data/Textures";
import Renderer from "../../lib/Renderer";
import FontPool from "../../lib/twoD/FontPool";
import Object2D from "../../lib/twoD/Object2D";
import Sprite from "../../lib/twoD/Sprite";
import Text from "../../lib/twoD/Text.ts";
import Font from "../../lib/twoD/Font";
import GameModel from "../GameModel.ts";
export default class Toggle extends Object2D {
    infoText: Text;


    constructor(renderer: Renderer) {
        super();
        let f = FontPool.getFont("bold") as Font;
        this.infoText = new Text(renderer, f, 20, "Fish Sticks");
        this.infoText.y = -10;
        this.infoText.x = 40;
        this.infoText.alpha = 0.7;
        this.addChild(this.infoText);

        let toggleBack = new Sprite(renderer, renderer.getTexture(Textures.TOGGLE_BACK));
        toggleBack.sx = toggleBack.sy = 0.5;
        toggleBack.alpha = 0.4;
        this.addChild(toggleBack);

        let toggleBtn = new Sprite(renderer, renderer.getTexture(Textures.SLIDER_BUTTON));
        toggleBtn.sx = toggleBtn.sy = 0.5;
        toggleBtn.x = -9;
  toggleBtn.mouseEnabled =false


        this.addChild(toggleBtn);
        toggleBack.rollOver = () => {
            renderer.setCursor(true);
        }
        toggleBack.rollOut = () => {
            renderer.setCursor(false);
        }
        toggleBack.onClick = () => {
            if (toggleBtn.x < 0) {
                //turn on
                toggleBtn.x = 9;
               
            this.infoText.setText("Fish Fingers")
            GameModel.fishFingers=true;
            } else {
                //turn off
                toggleBtn.x = -9;
                this.infoText.setText("Fish Sticks")
                   GameModel.fishFingers=false;

            }
        }
    }
}
