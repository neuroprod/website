import Material from "../../lib/material/Material.ts";
import { ShaderType } from "../../lib/material/ShaderTypes.ts";

import UniformGroup from "../../lib/material/UniformGroup.ts";

import { TextureSampleType } from "../../lib/WebGPUConstants.ts";

import { Textures } from "../../data/Textures.ts";

export default class DOFPrepMaterial extends Material {
    setup() {
        this.addAttribute("aPos", ShaderType.vec3);
        this.addAttribute("aUV0", ShaderType.vec2);
        this.addVertexOutput("uv0", ShaderType.vec2);


        let uniforms = new UniformGroup(this.renderer, "uniforms");
        this.addUniformGroup(uniforms, true);

        uniforms.addUniform("dofMin", 0.86)
        uniforms.addUniform("dofMax", 1)
        uniforms.addTexture("colorTexture", this.renderer.getTexture(Textures.LIGHT), { sampleType: TextureSampleType.UnfilterableFloat })
        uniforms.addTexture("depthTexture", this.renderer.getTexture(Textures.GDEPTH), { sampleType: TextureSampleType.UnfilterableFloat })
        this.depthWrite = false;
        this.depthCompare = "always"
        //this.logShader =true;
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
    output.position =vec4( aPos,1.0);
    output.uv0 =aUV0;
    return output;
}


@fragment
fn mainFragment(${this.getFragmentInput()}) -> @location(0) vec4f
{
   
    let textureSize =vec2<f32>( textureDimensions(colorTexture));  
    let uvPos = vec2<i32>(floor(uv0*textureSize));
    let color=textureLoad(colorTexture,  uvPos ,0); ;
    let depth=textureLoad(depthTexture,  uvPos ,0).x ;
    let d = smoothstep(uniforms.dofMin,uniforms.dofMax, depth);

    return vec4(color.xyz,d) ;
}
///////////////////////////////////////////////////////////
        `
    }






}
