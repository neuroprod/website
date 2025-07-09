import { Vector4 } from "@math.gl/core";
import DefaultUniformGroups from "../../../../lib/material/DefaultUniformGroups";
import Material from "../../../../lib/material/Material";
import { ShaderType } from "../../../../lib/material/ShaderTypes";
import UniformGroup from "../../../../lib/material/UniformGroup";

export default class ButterShadowMaterial extends Material {

    setup() {
        this.addAttribute("aPos", ShaderType.vec3);

        this.addVertexOutput("world", ShaderType.vec3)


        this.addUniformGroup(DefaultUniformGroups.getCamera(this.renderer));
        this.addUniformGroup(DefaultUniformGroups.getModelTransform(this.renderer));
        let uniforms = new UniformGroup(this.renderer, "uniforms");
        this.addUniformGroup(uniforms, true);
        uniforms.addUniform("angle", new Vector4())

    }

    getShader(): string {
        return /* wgsl */ `
///////////////////////////////////////////////////////////   

${this.getVertexOutputStruct()}   
${this.getShaderUniforms()}




@vertex
fn mainVertex( ${this.getShaderAttributes()} ) -> VertexOutput
{
    var output : VertexOutput;
    let pos = vec3((aPos.x *uniforms.angle.x +aPos.y *uniforms.angle.z )  *aPos.z,
(aPos.x *uniforms.angle.y+aPos.y *uniforms.angle.w) *abs(aPos.z),
 aPos.y);
    output.position =camera.viewProjectionMatrix*model.modelMatrix* vec4(pos,1.0);
    output.world = (camera.viewMatrix*model.modelMatrix* vec4( aPos,1.0)).xyz;
 
    return output;
}


@fragment
fn mainFragment(${this.getFragmentInput()})  -> @location(0) vec4f
{
  //viewPosition
    return vec4f(world.z,0.0,0.0,0.0);

}
///////////////////////////////////////////////////////////
        `
    }





}
