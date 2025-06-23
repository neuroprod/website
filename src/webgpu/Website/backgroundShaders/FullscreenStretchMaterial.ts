import Material from "../../lib/material/Material.ts";
import {ShaderType} from "../../lib/material/ShaderTypes.ts";
import DefaultUniformGroups from "../../lib/material/DefaultUniformGroups.ts";
import UniformGroup from "../../lib/material/UniformGroup.ts";
import DefaultTextures from "../../lib/textures/DefaultTextures.ts";
import {AddressMode, FilterMode} from "../../lib/WebGPUConstants.ts";
import Blend from "../../lib/material/Blend.ts";


export default class FullScreenStretchMaterial extends Material{

    setup(){
        this.addAttribute("aPos", ShaderType.vec3);

        this.addAttribute("aUV0", ShaderType.vec2);


        this.addVertexOutput("uv", ShaderType.vec2 );



        let uniforms =new UniformGroup(this.renderer,"uniforms");
        this.addUniformGroup(uniforms,true);

        uniforms.addTexture("colorTexture",DefaultTextures.getWhite(this.renderer))
        uniforms.addSampler("mySampler",  GPUShaderStage.FRAGMENT,  FilterMode.Linear,  AddressMode.ClampToEdge, 4)
this.depthCompare="always"
        this.depthWrite=false
        this.blendModes=[Blend.alpha()]
        //this.logShader =true;
    }
    getShader(): string {
        return /* wgsl */ `

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
fn mainFragment(${this.getFragmentInput()})  ->  @location(0) vec4f
{

    let color =textureSample(colorTexture, mySampler,  uv);
 

    return color;
}
///////////////////////////////////////////////////////////
        `
    }


}
