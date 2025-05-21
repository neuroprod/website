import UniformGroup from "../material/UniformGroup.ts";
import Renderer from "../Renderer.ts";
import {Matrix4, Vector3} from "@math.gl/core";

export default class Camera2D extends UniformGroup{

    private projection = new Matrix4()
    private viewProjection = new Matrix4()
    private view:Matrix4 =new Matrix4()
    constructor(renderer:Renderer) {
        super(renderer,"camera2D",true);
        this.addUniform("viewProjectionMatrix",this.projection)
        this.view.lookAt({
            eye: new Vector3(0,0,1),
            center: new Vector3(0,0,0),
            up: new Vector3(0,1,0),
        });
    }



    setSize(width: number, height: number){

        this.projection.ortho({
            left: 0,
            right: width,
            bottom: height,
            top: 0,
            near: -10,
            far: 10,
        })
        this.viewProjection.identity()
        this.viewProjection.multiplyRight(this.projection);
        this.viewProjection.multiplyRight(this.view);
        this.setUniform("viewProjectionMatrix", this.viewProjection)
    }


}
