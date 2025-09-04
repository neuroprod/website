import Material from "../../lib/material/Material.ts";
import { ShaderType } from "../../lib/material/ShaderTypes.ts";
import DefaultUniformGroups from "../../lib/material/DefaultUniformGroups.ts";
import UniformGroup from "../../lib/material/UniformGroup.ts";
import DefaultTextures from "../../lib/textures/DefaultTextures.ts";
import { AddressMode, FilterMode } from "../../lib/WebGPUConstants.ts";


export default class GBufferFullScreenStretchMaterial extends Material {

    setup() {
        this.addAttribute("aPos", ShaderType.vec3);

        this.addAttribute("aUV0", ShaderType.vec2);


        this.addVertexOutput("uv", ShaderType.vec2);



        let uniforms = new UniformGroup(this.renderer, "uniforms");
        this.addUniformGroup(uniforms, true);

        uniforms.addTexture("colorTexture", DefaultTextures.getWhite(this.renderer))
        uniforms.addSampler("mySampler")

        //this.logShader =true;
    }
    getShader(): string {
        return /* wgsl */ `
///////////////////////////////////////////////////////////   
struct GBufferOutput {
  @location(0) color : vec4f,
  @location(1) normal : vec4f,
   
}
${this.getVertexOutputStruct()}   


${this.getShaderUniforms()}
@vertex
fn mainVertex( ${this.getShaderAttributes()} ) -> VertexOutput
{
    var output : VertexOutput;
    output.position =vec4( aPos,1.0);
    output.position.z =0.9;
    output.uv =aUV0;
    return output;
}


@fragment
fn mainFragment(${this.getFragmentInput()}) ->  GBufferOutput
{
    var output : GBufferOutput;
    var color =textureSample(colorTexture, mySampler,  uv);
     color =color+ vec4(1.0,1.0,1.0,1.0)*(1.0-color.a);
     output.color =color;
    output.normal =vec4(0.5,0.5,1,0);

    return output;
}
///////////////////////////////////////////////////////////
        `
    }


}
