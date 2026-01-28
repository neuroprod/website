import Renderer from "../../lib/Renderer";
import DefaultTextures from "../../lib/textures/DefaultTextures.ts";
import Font from "../../lib/twoD/Font";
import FontPool from "../../lib/twoD/FontPool";
import Object2D from "../../lib/twoD/Object2D";
import Sprite from "../../lib/twoD/Sprite.ts";
import Text from "../../lib/twoD/Text.ts";
import SoundHandler from "../SoundHandler.ts";
import Slider from "./Slider.ts";
import Toggle from "./Toggle.ts";
import gsap from "gsap";
export default class SettingHolder {

    root: Object2D
    musicSlider: Slider;
    soundFXSlider: Slider;
    LanguageToggle: Toggle;
    closeButton: Sprite;
 
    constructor(renderer: Renderer) {

        this.root = new Object2D()
        this.root.x = 70
        this.root.y = 50;
        this.root.visible = false
        let font = FontPool.getFont("bold") as Font;

        let pos = 0
        let textMusic = new Text(renderer, font, 30, "Music")
        this.root.addChild(textMusic);
        this.musicSlider = new Slider(renderer);
        this.musicSlider.y = pos + 16;
        this.musicSlider.x = 300;
        this.musicSlider.onUpdate = (value: number) => {
            //update music volume
            SoundHandler.setMusicVolume(value);
        }
        this.root.addChild(this.musicSlider);

        pos += 40;
        let textSoundFX = new Text(renderer, font, 30, "Sound FX")
        textSoundFX.y = pos;
        this.soundFXSlider = new Slider(renderer);
        this.soundFXSlider.y = pos + 16;
        this.soundFXSlider.x = 300;
        this.soundFXSlider.onUpdate = (value: number) => {
            //update sound fx volume
            SoundHandler.setSoundFXVolume(value);
        }
        this.root.addChild(this.soundFXSlider);
        this.root.addChild(textSoundFX);

        pos += 40;
        let textLanguage = new Text(renderer, font, 30, "Language")
        textLanguage.y = pos;
        this.root.addChild(textLanguage);
        this.LanguageToggle = new Toggle(renderer);
        this.LanguageToggle.y = pos + 16;
        this.LanguageToggle.x = 150 + 23;
        this.root.addChild(this.LanguageToggle);
        let btnSize = 30;
        this.closeButton = new Sprite(renderer, DefaultTextures.getTransparent(renderer));
        this.closeButton.sx = btnSize;
        this.closeButton.sy = btnSize;
        this.closeButton.x = 500;
        this.closeButton.y = 15;

        this.closeButton.mouseEnabled = true;
        this.root.addChild(this.closeButton);
        this.closeButton.onClick = () => {
            this.root.visible = false;
        }
        this.closeButton.rollOver = () => {
            renderer.setCursor(true);
            this.closeButton.r = 0;

           gsap.to(this.closeButton, { r: Math.PI , duration: 0.3, ease: "power1.inOut" });
        }
        this.closeButton.rollOut = () => {
            renderer.setCursor(false);
            
        }
let lineThickness = 2 ;
        let line1 = new Sprite(renderer, DefaultTextures.getWhite(renderer));
        line1.sx = 1;
        line1.sy = lineThickness / btnSize;
        line1.r = Math.PI / 4;
        line1.mouseEnabled = false;
        this.closeButton.addChild(line1);


        let line2 = new Sprite(renderer, DefaultTextures.getWhite(renderer));
        line2.sx = 1;
        line2.sy = lineThickness / btnSize;
        line2.r = -Math.PI / 4;
        line2.mouseEnabled = false;

        this.closeButton.addChild(line2);
    }
    update() {
        this.musicSlider.updateF();
        this.soundFXSlider.updateF();
       
    }

}