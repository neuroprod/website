import Material from "../../lib/material/Material.ts";
import { ShaderType } from "../../lib/material/ShaderTypes.ts";

import UniformGroup from "../../lib/material/UniformGroup.ts";

import { TextureSampleType } from "../../lib/WebGPUConstants.ts";

import { Textures } from "../../data/Textures.ts";

export default class DOFBlurMaterial extends Material {
    horizontal: boolean = true
    setup() {
        this.addAttribute("aPos", ShaderType.vec3);
        this.addAttribute("aUV0", ShaderType.vec2);
        this.addVertexOutput("uv0", ShaderType.vec2);

        let uniforms = new UniformGroup(this.renderer, "uniforms");
        this.addUniformGroup(uniforms, true);

        uniforms.addUniform("size", 3)

        uniforms.addTexture("inputTexture", this.renderer.getTexture(Textures.DOF_PREP), { sampleType: TextureSampleType.Float })
        uniforms.addSampler("mySampler")
        this.depthWrite = false;
        this.depthCompare = "always"
        //this.logShader =true;
    }
    getDir(): string {
        if (this.horizontal) return "1.5,0.0";
        return "0.0,1.5"
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
   
  let textureSize =vec2<f32>( textureDimensions(inputTexture));
  let uvPos = vec2<i32>(floor(uv0*textureSize));
    
    let color=   textureLoad(inputTexture, uvPos,0);
 //if(color.w==0){return vec4(color); }
    
    let pixelSize =vec2(1.0)/textureSize;
    var colorBlur =vec3f(0.0);
    var div =0.0;

    

    let dir =vec2(${this.getDir()})*pixelSize*color.w;
    let stepp =uniforms.size;
    for(var i=-stepp;i<(stepp+1.0);i+=1.0)
    {
        
           
            let r = textureSample(inputTexture, mySampler,uv0+(dir*i ));


            colorBlur+=r.xyz *r.w;
            div+=r.w;
        
    }

 
    colorBlur/=div;
    
    
    
    if(color.w<0.05){return vec4(color); }
     
 
    //return vec4(color.xyz *step(0.99,1.0-color.w),color.w);

  return vec4(colorBlur,color.w) ;
  

}
///////////////////////////////////////////////////////////
        `
    }






}
