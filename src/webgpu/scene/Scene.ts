import Renderer from "../lib/Renderer.ts";
import MouseListener from "../lib/MouseListener.ts";
import CanvasRenderPass from "../CanvasRenderPass.ts";
import Camera from "../lib/Camera.ts";
import ModelRenderer from "../lib/model/ModelRenderer.ts";
import Object3D from "../lib/model/Object3D.ts";
import ModelPool from "./ModelPool.ts";
import UI from "../lib/UI/UI.ts";
import Ray from "../lib/Ray.ts";
import Outline from "./outline/Outline.ts";
import EditCursor from "./editCursor/EditCursor.ts";
import EditCamera from "./EditCamera.ts";
import SceneObject3D from "../shared/SceneObject3D.ts";
import {saveScene} from "../lib/SaveUtils.ts";


export enum ToolState {

    translate,
    rotate,
    scale,

}

export default class Scene {


    private renderer: Renderer;
    private camera: Camera;
    private modelRenderer: ModelRenderer;
    private root: SceneObject3D
    private modelPool: ModelPool;
    private mouseListener: MouseListener;
    private ray: Ray = new Ray();
    private currentModel: Object3D | null = null;
    private outline: Outline;
    private editCursor: EditCursor;
    private editCamera: EditCamera;

    private currentToolState: ToolState = ToolState.translate;
    public modelsByLoadID: { [id: string]: SceneObject3D } = {};


    constructor(renderer: Renderer, mouseListener: MouseListener, modelData: any, sceneData: any) {
        this.renderer = renderer;
        this.mouseListener = mouseListener;
        this.camera = new Camera(renderer);
        this.camera.cameraWorld.set(0.5, 0.3, 2)
        this.camera.cameraLookAt.set(0, 0.2, 0)
        this.camera.near = 0.1
        this.camera.fovy = 0.5
        this.modelPool = new ModelPool(renderer, modelData);
        this.modelRenderer = new ModelRenderer(renderer, "mainModels", this.camera)

        this.outline = new Outline(renderer, this.camera)
        this.editCursor = new EditCursor(renderer, this.camera, mouseListener, this.ray)
        this.editCamera = new EditCamera(renderer, this.camera, mouseListener, this.ray)
        this.root = new SceneObject3D(this.renderer, "root")
        this.root.setCurrentModel = this.setCurrentModel.bind(this);
        this.makeScene(sceneData);
        this.setCurrentToolState(ToolState.translate)
    }

    update() {
        this.camera.ratio = this.renderer.ratio

        //setScreenRay
        this.ray.setFromCamera(this.camera, this.mouseListener.getMouseNorm())

        //checkCameraInteraction
        let cursorNeeded = false
        cursorNeeded = this.editCamera.checkMouse();
        //check edit cursor
        if (!cursorNeeded) {
            cursorNeeded = this.editCursor.checkMouse()
        }
        //check modelSelect
        if (!cursorNeeded && this.mouseListener.isDownThisFrame && !UI.needsMouse()) {
            let intersections = this.ray.intersectModels(this.modelRenderer.models)
            if (intersections.length) {
                let m = intersections[0].model;
                this.setCurrentModel(m.parent as SceneObject3D)

            } else {
                this.setCurrentModel(null);
            }
        }

        this.editCursor.update()

    }

    public onUI() {
        if (UI.LButton("Save Scene")) {

            let data: Array<any> = []
            this.root.getSceneData(data);

            saveScene("scene1", JSON.stringify(data)).then()
        }


        UI.separator("Tools")


        this.editCursor.localSpace = UI.LBool("Translate local", true);
        if (UI.LButton("Translate", "", this.currentToolState != ToolState.translate)) this.setCurrentToolState(ToolState.translate);
        if (UI.LButton("Rotate", "", this.currentToolState != ToolState.rotate)) this.setCurrentToolState(ToolState.rotate);
        // if (UI.LButton("Scale", "", this.currentToolState!= ToolState.scale)) this.setCurrentToolState(ToolState.scale);


    }

    public onObjectUI() {
        UI.pushWindow("scene")
        this.root.onUI()

        if (this.currentModel){
            UI.separator(this.currentModel.label.toUpperCase(), true)
            let selectedModel =UI.LSelect("models",this.modelPool.modelSelect)
            if(UI.LButton("Add +")){
                let  m =this.modelPool.getModelByName(selectedModel);

                m.setCurrentModel = this.setCurrentModel.bind(this);
                this.currentModel.addChild(m)
                this.setCurrentModel(m);
                if(m.model)    this.modelRenderer.addModel(m.model)
            }
            this.currentModel.onDataUI()

        }


        UI.popWindow()
    }

    setCurrentModel(value: SceneObject3D | null) {
        if (value) {
            this.currentModel = value;
            this.outline.setCurrentModel(value.model)
            this.editCursor.setCurrentModel(this.currentModel);
        } else {
            this.currentModel = null;
            this.outline.setCurrentModel(null)
            this.editCursor.setCurrentModel(null);
        }

    }

    draw() {
        this.outline.draw()
        this.editCursor.draw();
    }

    drawInCanvas(pass: CanvasRenderPass) {
        this.modelRenderer.draw(pass);
        this.outline.drawFinal(pass);
        this.editCursor.drawFinal(pass);
    }

    private makeScene(data: any) {

        for (let d of data) {


            if (d.label == "root") {
                this.modelsByLoadID[d.id] = this.root;
                continue;
            }

            let  m =this.modelPool.getModelByName(d.model,d.label);
            m.setPosition(d.position[0],d.position[1],d.position[2])
            m.setRotation(d.rotation[0],d.rotation[1],d.rotation[2],d.rotation[3])
            this.modelsByLoadID[d.id] =m;
            this.modelsByLoadID[d.parentID].addChild(m)
            m.setCurrentModel = this.setCurrentModel.bind(this);
            if(m.model)    this.modelRenderer.addModel(m.model)
            // if(m.model)
        }


    }

    private setCurrentToolState(toolState: ToolState) {
        this.currentToolState = toolState;
        this.editCursor.setToolState(this.currentToolState);
    }
}