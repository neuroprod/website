import TextureLoader from "../textures/TextureLoader.ts";
import PreLoader from "../PreLoader.ts";
import Renderer from "../Renderer.ts";
import Font from "./Font.ts";

class FontPool{
    private fontMap:Map<string,Font> =new Map()

    constructor() {
    }



    loadFont(renderer:Renderer,preloader:PreLoader,name:string){

        let font =new Font();

       preloader.startLoad()
        let fontTexture = new TextureLoader(renderer, "fonts/"+name+".png")
        fontTexture.onComplete = () => {
            preloader.stopLoad()
        }
        preloader.startLoad()
        this.loadFile("fonts/"+name+".json").then((data)=>{

            font.setData(data,fontTexture)
            this.fontMap.set(name,font)
            preloader.stopLoad()
        })




    }
    getFont(name:string){
        return this.fontMap.get(name)

    }
    async loadFile(file:string){

        const response = await fetch( file)

        let text = await response.text();
        return JSON.parse(text);



    }


}
export default new FontPool()
