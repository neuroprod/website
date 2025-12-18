import Object2D from "./Object2D.ts";
import Renderer from "../Renderer.ts";

import RenderPass from "../RenderPass.ts";
import UniformGroup from "../material/UniformGroup.ts";
import Font from "./Font.ts";
import TextMesh from "./TextMesh.ts";
import TextMaterial from "./TextMaterial.ts";
import { Vector2, Vector4 } from "@math.gl/core";
import Rect from "./Rect.ts";
import Material from "../material/Material.ts";

export default class Text extends Object2D {

    material: Material;
    mesh: TextMesh;
    width: number = 0;

    private mousePosLocal: Vector4 = new Vector4()
    private rect: Rect = new Rect()
    height: number = 0;
    size: number;
    font: Font;
    alpha = 1;
    constructor(renderer: Renderer, font: Font, size: number = 25, text: string = "testText") {
        super();

        this.id = text
        this.size = size;
        this.font = font
        this.mesh = new TextMesh(renderer)

        this.setText(text)


        this.material = new TextMaterial(renderer, "text2DMAt")
        this.material.setTexture("texture", font.texture)

    }
    setText(text: string, HAlignCenter = false, VAlignCenter = false) {

        this.mesh.setText(text, this.font, this.size, HAlignCenter, VAlignCenter)
        this.rect.min.set(this.mesh.min.x, this.mesh.min.y)
        this.rect.max.set(this.mesh.max.x, this.mesh.max.y)
        this.width = this.mesh.max.x;
        this.height = this.mesh.max.y;
    }

    public updateInt() {
        this.material.setUniform("alpha", this.alpha)
        this.material.setUniform("worldMatrix", this.worldMatrix)
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
    checkMouseHit(mousePos: Vector2) {
        this.mousePosLocal.set(mousePos.x, mousePos.y, 0, 1)
        this.mousePosLocal.applyMatrix4(this._worldMatrixInv)
        if (this.rect.contains(this.mousePosLocal)) {
            return this
        }
        return null;
    }

}





