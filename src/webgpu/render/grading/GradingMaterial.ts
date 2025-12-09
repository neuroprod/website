import Material from "../../lib/material/Material.ts";
import { ShaderType } from "../../lib/material/ShaderTypes.ts";

import UniformGroup from "../../lib/material/UniformGroup.ts";
import DefaultTextures from "../../lib/textures/DefaultTextures.ts";
import { TextureSampleType } from "../../lib/WebGPUConstants.ts";
import Renderer from "../../lib/Renderer.ts";
import { Textures } from "../../data/Textures.ts";

export default class GradingMaterial extends Material {
    setup() {
        this.addAttribute("aPos", ShaderType.vec3);
        this.addAttribute("aUV0", ShaderType.vec2);
        this.addVertexOutput("uv0", ShaderType.vec2);


        let uniforms = new UniformGroup(this.renderer, "uniforms");
        this.addUniformGroup(uniforms, true);


        uniforms.addUniform("exposure", 1)
        uniforms.addUniform("contrast", 1)
        uniforms.addUniform("brightness", 1)

        uniforms.addUniform("vinFalloff", 1)
        uniforms.addUniform("vinAmount", 1)

        uniforms.addUniform("curveRed", 1)
        uniforms.addUniform("curveGreen", 1)
        uniforms.addUniform("curveBlue", 1)

        uniforms.addUniform("grain", 0.5)


        uniforms.addTexture("grainTexture", this.renderer.getTexture(Textures.GRAIN), { sampleType: TextureSampleType.UnfilterableFloat })


        uniforms.addTexture("colorTexture", this.renderer.getTexture(Textures.LIGHT), { sampleType: TextureSampleType.UnfilterableFloat })
        this.depthWrite = false;
        this.depthCompare = "always"
        //this.logShader =true;
    }
    getShader(): string {
        return /* wgsl */ `
///////////////////////////////////////////////////////////   

${this.getVertexOutputStruct()}   


${this.getShaderUniforms()}


const m1 = mat3x3f(
    0.59719, 0.07600, 0.02840,
    0.35458, 0.90834, 0.13383,
    0.04823, 0.01566, 0.83777
    );
const m2 = mat3x3f(
    1.60475, -0.10208, -0.00327,
    -0.53108,  1.10813, -0.07276,
    -0.07367, -0.00605,  1.07602
    );
fn acestonemap( color:vec3f)->vec3f{
  
    let v = m1 * color;
    let a = v * (v + 0.0245786) - 0.000090537;
    let b = v * (0.983729 * v + 0.4329510) + 0.238081;
    let r=m2 * (a / b);
    return pow(clamp(r, vec3f(0.0), vec3f(1.0)), vec3f(1. / 2.2));
}
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
      var color=textureLoad(colorTexture,  uvPos ,0); 
  
  let modF =(uvPos/2)% vec2<i32>(512,512);
        let grain=  ((textureLoad(grainTexture, modF,0).x-0.5)*uniforms.grain) +1.0;


       let dist = distance( uv0, vec2(0.5, 0.5));
        
       let fall =0.3;
        color = color * pow( uniforms.exposure,2.0);
        color =color* smoothstep(0.8, uniforms.vinFalloff * 0.799, dist * (uniforms.vinAmount + uniforms.vinFalloff));

      // color = color*grain;

        var color3 = acestonemap(color.xyz);

        color3 = pow(color3,vec3(2.2));
        color3=  color3 * uniforms.contrast;
        color3 = color3*grain;
        color3 =  color3 + vec3(uniforms.brightness);



    //color3.z = 1.0-color3.z;
    color3 = pow(color3,vec3(uniforms.curveRed,uniforms.curveGreen,uniforms.curveBlue));
   // color3.z = 1.0-color3.z;
    color3 = pow(color3,vec3(1.0/2.2));
    
    
    return vec4(color3,1.0) ;
}
///////////////////////////////////////////////////////////
        `
    }






}
