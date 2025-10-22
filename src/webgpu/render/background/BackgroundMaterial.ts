import Material from "../../lib/material/Material.ts";
import { ShaderType } from "../../lib/material/ShaderTypes.ts";

import UniformGroup from "../../lib/material/UniformGroup.ts";
import DefaultTextures from "../../lib/textures/DefaultTextures.ts";
import { CullMode, TextureSampleType } from "../../lib/WebGPUConstants.ts";
import Renderer from "../../lib/Renderer.ts";
import { Textures } from "../../data/Textures.ts";
import DefaultUniformGroups from "../../lib/material/DefaultUniformGroups.ts";

export default class BackgroundMaterial extends Material {
    setup() {
        this.addAttribute("aPos", ShaderType.vec3);
        this.addAttribute("aUV0", ShaderType.vec2);

        this.addVertexOutput("uv0", ShaderType.vec2);
        this.addVertexOutput("outPos", ShaderType.vec4);
        this.addUniformGroup(DefaultUniformGroups.getCamera(this.renderer));
        this.addUniformGroup(DefaultUniformGroups.getModelTransform(this.renderer));

        let uniforms = new UniformGroup(this.renderer, "uniforms");
        this.addUniformGroup(uniforms, true);
        uniforms.addTexture("asciiTexture", this.renderer.getTexture(Textures.ASCII), { sampleType: TextureSampleType.UnfilterableFloat })
        uniforms.addTexture("asciiFont", this.renderer.getTexture(Textures.ASCII_FONT))


        uniforms.addTexture("normalText", this.renderer.getTexture(Textures.GNORMAL), { sampleType: TextureSampleType.UnfilterableFloat })
        uniforms.addSampler("mySampler");
        this.depthWrite = false;
        this.depthCompare = "always"
        this.cullMode = CullMode.None
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
     let outPos =camera.viewProjectionMatrix*model.modelMatrix* vec4( aPos,1.0);
    output.position  =outPos;
  output.outPos  =outPos;
    output.uv0 =vec2f(aUV0.x,1.0-aUV0.y);
    return output;
}


@fragment
fn mainFragment(${this.getFragmentInput()}) -> @location(0) vec4f
{
   let nUV = (outPos.xy/outPos.w)*vec2f(0.5,-0.5) +vec2f(0.5,0.5);


      let textureSize =vec2<f32>( textureDimensions(normalText));
      let uvPos = vec2<i32>(floor(nUV*textureSize));
      let w =textureLoad(normalText,  uvPos ,0).w;
        if(w==0){discard;}
  
         let textureSizeA =vec2<f32>( textureDimensions(asciiTexture));
      let uvPosA = vec2<i32>(floor(uv0*textureSizeA));
   let s =textureLoad(asciiTexture,  uvPosA ,0).x;



var uv = uv0*vec2(textureSizeA.x,textureSizeA.y)%1.0;
 uv = vec2(uv.x/11.0 +floor(s*10.0)/11.0,uv.y);
 let f =textureSampleLevel(asciiFont, mySampler,  uv,0).x*0.6;


// return vec4(uv,0.0,0.0) ;

     return vec4(0.3725,0.5569,0.6471,0.0)+vec4(f,f,f,0) ;
}
///////////////////////////////////////////////////////////
        `
    }






}
