import Object2D from "./Object2D.ts";
import Texture from "../textures/Texture.ts";
import Mesh from "../mesh/Mesh.ts";
import Material from "../material/Material.ts";
import Renderer from "../Renderer.ts";
import SpriteMaterial from "./SpriteMaterial.ts";
import Plane from "../mesh/geometry/Plane.ts";
import RenderPass from "../RenderPass.ts";
import UniformGroup from "../material/UniformGroup.ts";

export default class Sprite extends Object2D {
    private texture: Texture;
    private mesh: Mesh
    private material: Material
   public width: number;
    public height: number;
    public text: string ="";


    constructor(renderer: Renderer, texture: Texture) {
        super();


        this.texture = texture;
        this.width = this.texture.options.width
        this.height = this.texture.options.height

        this.mesh = new Plane(renderer, this.width, this.height,1,1,false)
        this.material = new SpriteMaterial(renderer)
        this.material.setTexture("texture", texture)

    }


   public updateInt(){

     this.material.setUniform("worldMatrix",this.worldMatrix)
    }
    public drawInt(pass: RenderPass) {

        this.material.makePipeLine(pass);
        const passEncoder = pass.passEncoder
        passEncoder.setPipeline(this.material.pipeLine);

        // @ts-ignore
        for (let i = 0; i < this.material.uniformGroups.length; i++) {
            // @ts-ignore
            let label = this.material.uniformGroups[i].label;
            let uniformGroup: UniformGroup;

                        if (label == "camera2D") {


                        } else if (label == "model") {

                        } else {
                            // @ts-ignore
                            uniformGroup = this.material.uniformGroups[i];

                            passEncoder.setBindGroup(i, uniformGroup.bindGroup);
                        }
            //con


        }


        // @ts-ignore
        for (let attribute of this.material.attributes) {
            let buffer = this.mesh.getBufferByName(attribute.name);

            if (buffer) {
                passEncoder.setVertexBuffer(
                    attribute.slot,
                    buffer,
                )
            } else {

                console.log("buffer not found", attribute.name)

            }
        }

        if (this.mesh.hasIndices) {

            passEncoder.setIndexBuffer(this.mesh.indexBuffer, this.mesh.indexFormat);
            passEncoder.drawIndexed(
                this.mesh.numIndices,
                1,
                0,
                0
            );
        }

    }

}
