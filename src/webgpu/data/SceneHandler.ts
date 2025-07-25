import Renderer from "../lib/Renderer.ts";
import PreLoader from "../lib/PreLoader.ts";

import SceneObject3D from "./SceneObject3D.ts";

import ProjectData from "./ProjectData.ts";
import Model from "../lib/model/Model.ts";

import MathUtils from "../lib/MathUtils.ts";
import Animation from "../sceneEditor/timeline/animation/Animation.ts";
import AnimationChannel, {Key} from "../sceneEditor/timeline/animation/AnimationChannel.ts";
import {Quaternion, Vector3} from "@math.gl/core";

class SceneHandler {
    public scenesData: Array<any> = [];
    public sceneDataByID: Map<string, any> = new Map<string, any>();

    public sceneObjectsByLoadID: Map<string, SceneObject3D> = new Map<string, SceneObject3D>()

    public sceneObjectsByName: Map<string, SceneObject3D> = new Map<string, SceneObject3D>()
    allModels: Array<Model> = [];

  //  usedModels: Array<Model> = [];
   // usedModelsTrans: Array<Model> = [];
    root!: SceneObject3D;
    private renderer!: Renderer;
    private currentSceneID: string="";
    private sceneData: any;
    hitTestModels: Array<Model> = [];
    triggerModels: Array<SceneObject3D> = [];
    mouseHitModels: Array<Model> = [];

    sceneAnimations:Array<Animation>=[]

    async init(renderer: Renderer, preloader: PreLoader) {
        this.renderer = renderer;
        this.root = new SceneObject3D(renderer, "MainRoot")


        const response = await fetch("./scenes.json")

        let text = await response.text();
        let scenesIDS = JSON.parse(text);
        let pArray: Array<Promise<Response>> = []

        for (let folder of scenesIDS) {

            let file = "./scenes/" + folder
            let p = fetch(file)


            pArray.push(p);
        }
        await Promise.all(pArray);

        for (let pr of pArray) {

            let text = (await pr).text()
            await text.then((value) => {
                let sceneData = JSON.parse(value)
                this.scenesData.push(sceneData);
                this.sceneDataByID.set(sceneData.id, sceneData)

                //console.log("loadScenes")
            })
        }
    }

    getSceneIDByName(name:string){
            for(let s of this.scenesData){
                if(s.name==name)return s.id;
            }
            return ""
    }
    async setScene(sceneId: string) {
        //save currentscenes?
        ProjectData.setNewScene()

        this.root.removeAllChildren()
        this.allModels = [];

        this.hitTestModels =[];
        this.triggerModels =[];
        this.mouseHitModels =[];
        this.sceneAnimations=[];
        this.sceneObjectsByLoadID.clear()
        this.sceneObjectsByName.clear()


        this.sceneData = this.sceneDataByID.get(sceneId)

        this.currentSceneID = sceneId;
        if ( this.sceneData ) {

            this.parseSceneData( this.sceneData.scene,true)
            this.parseSceneAnimations( this.sceneData.animations)
        }


    }
    async addScene(sceneId: string) {
        this.sceneData = this.sceneDataByID.get(sceneId)
        this.currentSceneID = sceneId;
        if ( this.sceneData ) {

            this.parseSceneData( this.sceneData.scene,true)
            this.parseSceneAnimations( this.sceneData.animations)
        }
    }
    saveCurrentScene() {
        if(! this.sceneData){return }

        let sceneRoot =this.sceneObjectsByLoadID.get( this.sceneData.scene[0].id);
        if(!sceneRoot)return;
        let sData:Array<any> =[]
        sceneRoot.getObjectData(sData);

        this.sceneData.animations =[]
        for(let a of this.sceneAnimations){
            a.getAnimationData( this.sceneData.animations)
        }



        this.sceneData.scene =sData;
    }

    private parseSceneData(sceneData: any,isRoot:boolean) {

        for (let d of sceneData) {


            let sceneObj: SceneObject3D | null = null;

            if (d.meshId.length > 0 && d.projectId.length > 0) {
                sceneObj = ProjectData.getModel(d);

            } else if (d.isText) {

                sceneObj = ProjectData.makeSceneObjectWithText(d.label, d.text,d.textSpacing)
            } else {
                sceneObj = new SceneObject3D(this.renderer, d.label)
                sceneObj.UUID = d.id;

            }
            if (sceneObj) {

                // this.sceneModelsByName[sceneObj.label] =sceneObj

                sceneObj.setPosition(d.position[0], d.position[1], d.position[2])
                sceneObj.setRotation(d.rotation[0], d.rotation[1], d.rotation[2], d.rotation[3])
                sceneObj.setEditorValues()
                this.sceneObjectsByLoadID.set(d.id, sceneObj);

                let parent = this.sceneObjectsByLoadID.get(d.parentID)
                if (!parent) parent = this.root;
                parent.addChild(sceneObj)

                this.sceneObjectsByName.set(sceneObj.label,sceneObj)

                if (sceneObj.model) {
                    if (d.scale) {
                        sceneObj.model.setScale(d.scale[0], d.scale[1], d.scale[2])
                    }
                    sceneObj.setObjectData(d)


                    if (sceneObj.needsHitTest) {
                        this.hitTestModels.push(sceneObj.model);
                    }
                    if (sceneObj.needsTrigger) {
                        this.triggerModels.push(sceneObj);
                    }
                    if (sceneObj.needsMouseHit) {
                        this.mouseHitModels.push(sceneObj.model);
                    }


                        this.allModels.push(sceneObj.model);





                }// if(m.model)
            }
        }
    }

    addNewScene(name: string) {
        let uid = MathUtils.generateUUID()
        let uid2 = MathUtils.generateUUID()
        let sceneData:any={
            id:uid,
            name:name,
            "scene":[{"id":uid2,"needsHitTest":false,"label":"root","meshId":"","projectId":"","isText":false,"text":"","needsTrigger":false,"triggerRadius":0.2,"position":[0,0,0],"rotation":[0,0,0,1],"hitTriggerItem":0}],
            "animations":[]}
        this.scenesData.push(sceneData);
        this.sceneDataByID.set(sceneData.id, sceneData)
        return uid;
    }


    getSceneObject(name: string) {

        if(!this.sceneObjectsByName.has(name)){
            console.log(name+ " doesnt exist in level")

        }

        return this.sceneObjectsByName.get(name) as SceneObject3D;
    }

    private parseSceneAnimations(animations: any[]) {
if(!animations)return
        for(let anime of animations){

            let animation = new Animation(this.renderer, anime.label, this.sceneObjectsByLoadID.get(anime.rootID) as SceneObject3D)
            animation.frameTime = anime.frameTime;
            animation.numFrames = anime.numFrames;

            for (let channelData of anime.channels) {
                let channel = new AnimationChannel(this.sceneObjectsByLoadID.get(channelData.id) as SceneObject3D, channelData.type)

                for (let i = 0; i < channelData.frames.length; i++) {
                    let key = new Key()
                    key.frame = channelData.frames[i]
                    let keyData =channelData.values[i]
                    if(keyData){
                    if(keyData.length==3){
                        key.data =new Vector3( channelData.values[i]   )
                    } if(keyData.length==4){
                        key.data =new Quaternion( channelData.values[i]   )
                    }


                    channel.keys.push(key);}
                }
                channel.lastKeyIndex = channel.keys.length-1;
                animation.channels.push(channel)

            }
            this.sceneAnimations.push(animation)

           // let animation =new Animation(this.renderer,)

        }
    }
    addAnimation(animation:Animation){
     this.sceneAnimations.push(animation)

        }
   removeAnimation(animation:Animation){
       let i =  this.sceneAnimations.indexOf(animation)
       if(i>-1){
           this.sceneAnimations.splice(i,1)
       }

    }

}

export default new SceneHandler()
