import Material from "../../lib/material/Material.ts";
import {ShaderType} from "../../lib/material/ShaderTypes.ts";
import DefaultUniformGroups from "../../lib/material/DefaultUniformGroups.ts";

export default class MaskMaterial extends Material{

    setup() {
        this.addAttribute("aPos", ShaderType.vec3);




        this.addUniformGroup(DefaultUniformGroups.getCamera(this.renderer));
        this.addUniformGroup(DefaultUniformGroups.getModelTransform(this.renderer));


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
    output.position =camera.viewProjectionMatrix*model.modelMatrix* vec4( aPos,1.0);

 
    return output;
}


@fragment
fn mainFragment(${this.getFragmentInput()})  -> @location(0) vec4f
{
  //viewPosition
    return vec4f(1.0,1.0,1.0,1.0);

}
///////////////////////////////////////////////////////////
        `
    }





}
