
import UniformGroup from "./UniformGroup.ts";
import Camera from "../Camera.ts";
import Renderer from "../Renderer.ts";
import ModelTransform from "../model/ModelTransform.ts";
import Camera2D from "../twoD/Camera2D.ts";

export default class DefaultUniformGroups {


    private static camera: UniformGroup;
    private static modelTransform: UniformGroup;
    private static camera2D: Camera2D;
    static getCamera(renderer:Renderer){
        if(!this.camera) this.camera =new Camera(renderer)
        return this.camera;
    }

    static getModelTransform(renderer: Renderer) {
        if(!this.modelTransform) this.modelTransform =new ModelTransform(renderer)
        return this.modelTransform;
    }
    static getCamera2D(renderer:Renderer){
        if(!this.camera2D) this.camera2D =new Camera2D(renderer)
        return this.camera2D;
    }
}
