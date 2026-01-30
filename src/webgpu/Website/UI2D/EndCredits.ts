import Renderer from "../../lib/Renderer.ts";
import Object2D from "../../lib/twoD/Object2D.ts";
import FontPool from "../../lib/twoD/FontPool.ts";
import Font from "../../lib/twoD/Font.ts";
import Text from "../../lib/twoD/Text.ts";
import { Vector4 } from "@math.gl/core";
import gsap from "gsap";
import GameModel from "../GameModel.ts";
import LevelHandler from "../Levels/LevelHandler.ts";

export default class EndCredits{

root: Object2D;
    renderer: Renderer;
color = new Vector4(1,1,0,1)
    tl!: gsap.core.Timeline;



constructor(renderer:Renderer){
this.renderer =renderer;
    this.root  =new Object2D();
   let font = FontPool.getFont("bold") as Font;

let hAlign =false
 let pos =100;
 let thanks = new Text(renderer, font, 35, "Thanks for playing!",hAlign);
thanks.material.setUniform("color",this.color)
thanks.y=pos
  this.root.addChild(thanks)


  pos +=60;
 let music = new Text(renderer, font, 25, "Music",hAlign);
 music.material.setUniform("color",this.color)
 music.y=pos
  this.root.addChild(music)

pos+=30
  let musicA = new Text(renderer, font, 30, "Julia Florida",hAlign);
 musicA.material.setUniform("color",this.color)
 musicA.y=pos
 this.root.addChild(musicA)
 pos+=30
  let musicB = new Text(renderer, font, 20, "Agustin Pio Barrios Mangore\npreformed by: Edson Lopes",hAlign);
 musicB.material.setUniform("color",this.color)
 musicB.y=pos
 this.root.addChild(musicB)
 
pos+=80

 let writing = new Text(renderer, font, 25, "Additional Writing",hAlign);
writing.material.setUniform("color",this.color)
 writing.y=pos
  this.root.addChild(writing)
pos+=30
  let  writingA = new Text(renderer, font, 20, "Alex Bard",hAlign);
  writingA.material.setUniform("color",this.color)
  writingA.y=pos
 this.root.addChild( writingA)


pos+=60
 let testers = new Text(renderer, font, 25, "Playtesters",hAlign);
testers.material.setUniform("color",this.color)
 testers.y=pos
  this.root.addChild(testers)
pos+=30
  let  testersA = new Text(renderer, font, 20, "Rinus Temmerman\nCorneel Temmerman",hAlign);
  testersA.material.setUniform("color",this.color)
  testersA.y=pos
 this.root.addChild( testersA)


 pos+=70
  let  link = new Text(renderer, font, 30, "Check out the Portfolio\npart of the site",hAlign);
 link.material.setUniform("color",this.color)
 link.y=pos
 this.root.addChild( link)
 link.onClick = () => {

                LevelHandler.setLevel("Home")
            }
           link.rollOver = () => {
                GameModel.renderer.setCursor(true)

            }
           link.rollOut = () => {
                GameModel.renderer.setCursor(false)

            }
this.hide();
}
update() {
   if(!this.root.visible)return;
if(GameModel.happyEnd ==true){
 this.root.x =30
}else{
 this.root.x = this.renderer.htmlWidth/2 +this.renderer.htmlHeight/8
}
  
  
}
show(){
  this.root.visible =true
  this.tl =gsap.timeline()
  let time =0
for(let f of this.root.children){

this.tl.to(f,{alpha:1,duration:2,ease:"power2.inOut"},time)
  time+=0.3
}
}
hide() {
    this.root.visible =false
    if(this.tl) this.tl.clear();
    for(let f of this.root.children){

    f.alpha =0.0
}

}


}