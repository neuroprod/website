import {BaseLevel} from "./BaseLevel.ts";
import LevelHandler from "./LevelHandler.ts";


export default class NavigationLevel extends BaseLevel{

    public lockNavigation =false;
    constructor() {
        super()
    }
    init() {

        super.init();
        this.lockNavigation =false
    }
    configScene(){
        let wh = window.innerHeight *3;
        let app = document.getElementById("app")
        if (app) app.style.height = wh + "px"
        window.scrollTo(0, window.innerHeight);
        document.body.style.overflowY = "visible"
        document.body.style.overflowX = "hidden"
    }
    update(){

        if(window.scrollY==window.innerHeight*2 && !this.lockNavigation){
            //LevelHandler.setLevel("Start")
            this.lockNavigation=true
            LevelHandler.setNextNavigationLevel()
            let wh = window.innerHeight ;
            let app = document.getElementById("app")
            if (app) app.style.height = wh + "px"
            document.body.style.overflow = "hidden"
            window.scrollTo(0, 0);
        }
        if(window.scrollY==0 && !this.lockNavigation){
           // LevelHandler.setLevel("Start")
            this.lockNavigation=true
            LevelHandler.setPrevNavigationLevel()
            let wh = window.innerHeight ;
            let app = document.getElementById("app")
            if (app) app.style.height = wh + "px"
            document.body.style.overflow = "hidden"
            window.scrollTo(0, 0);
        }
    }
    destroy() {
        window.scrollTo(0, 0);
    }

}
