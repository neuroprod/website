import Material from "../../lib/material/Material.ts";
import { ShaderType } from "../../lib/material/ShaderTypes.ts";

import UniformGroup from "../../lib/material/UniformGroup.ts";
import DefaultTextures from "../../lib/textures/DefaultTextures.ts";
import { TextureSampleType } from "../../lib/WebGPUConstants.ts";
import Renderer from "../../lib/Renderer.ts";
import { Textures } from "../../data/Textures.ts";

export default class BackgroundMaterial extends Material {
    setup() {
        this.addAttribute("aPos", ShaderType.vec3);
        this.addAttribute("aUV0", ShaderType.vec2);

        this.addVertexOutput("uv0", ShaderType.vec2);


        let uniforms = new UniformGroup(this.renderer, "uniforms");
        this.addUniformGroup(uniforms, true);


        uniforms.addTexture("normalText", this.renderer.getTexture(Textures.GNORMAL), { sampleType: TextureSampleType.UnfilterableFloat })
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
   
      let textureSize =vec2<f32>( textureDimensions(normalText));
      let uvPos = vec2<i32>(floor(uv0*textureSize));
      let w =textureLoad(normalText,  uvPos ,0).w;
        if(w==0){discard;}
  
      
     return vec4(0.3725,0.5569,0.6471,0.0) ;
}
///////////////////////////////////////////////////////////
        `
    }






}
