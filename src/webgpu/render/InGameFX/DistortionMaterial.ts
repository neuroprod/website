import Material from "../../lib/material/Material.ts";
import {ShaderType} from "../../lib/material/ShaderTypes.ts";

import UniformGroup from "../../lib/material/UniformGroup.ts";
import DefaultTextures from "../../lib/textures/DefaultTextures.ts";
import {TextureSampleType} from "../../lib/WebGPUConstants.ts";
import {Textures} from "../../data/Textures.ts";

export default class DistortionMaterial extends Material {
    setup(){
        this.addAttribute("aPos", ShaderType.vec3);
        this.addAttribute("aUV0", ShaderType.vec2);
        this.addVertexOutput("uv0", ShaderType.vec2 );


        let uniforms =new UniformGroup(this.renderer,"uniforms");
        this.addUniformGroup(uniforms,true);
uniforms.addUniform("value1",1)
        uniforms.addUniform("value2",1)
        uniforms.addUniform("time",1)
        uniforms.addUniform("rand",1)
        uniforms.addTexture("mask", this.renderer.getTexture(Textures.MASK), {sampleType:TextureSampleType.UnfilterableFloat})

        uniforms.addTexture("colorTexture", this.renderer.getTexture(Textures.LIGHT), {sampleType:TextureSampleType.UnfilterableFloat})
        this.depthWrite =false;
        this.depthCompare ="always"
        //this.logShader =true;
    }
    getShader(): string {
        return /* wgsl */ `
///////////////////////////////////////////////////////////   
fn mod289(x: vec2f) -> vec2f {
    return x - floor(x * (1. / 289.)) * 289.;
}

fn mod289_3(x: vec3f) -> vec3f {
    return x - floor(x * (1. / 289.)) * 289.;
}

fn permute3(x: vec3f) -> vec3f {
    return mod289_3(((x * 34.) + 1.) * x);
}

//  MIT License. © Ian McEwan, Stefan Gustavson, Munrocket
fn simplexNoise2(v: vec2f) -> f32 {
    let C = vec4(
        0.211324865405187, // (3.0-sqrt(3.0))/6.0
        0.366025403784439, // 0.5*(sqrt(3.0)-1.0)
        -0.577350269189626, // -1.0 + 2.0 * C.x
        0.024390243902439 // 1.0 / 41.0
    );

    // First corner
    var i = floor(v + dot(v, C.yy));
    let x0 = v - i + dot(i, C.xx);

    // Other corners
    var i1 = select(vec2(0., 1.), vec2(1., 0.), x0.x > x0.y);

    // x0 = x0 - 0.0 + 0.0 * C.xx ;
    // x1 = x0 - i1 + 1.0 * C.xx ;
    // x2 = x0 - 1.0 + 2.0 * C.xx ;
    var x12 = x0.xyxy + C.xxzz;
    x12.x = x12.x - i1.x;
    x12.y = x12.y - i1.y;

    // Permutations
    i = mod289(i); // Avoid truncation effects in permutation

    var p = permute3(permute3(i.y + vec3(0., i1.y, 1.)) + i.x + vec3(0., i1.x, 1.));
    var m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), vec3(0.));
    m *= m;
    m *= m;

    // Gradients: 41 points uniformly over a line, mapped onto a diamond.
    // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)
    let x = 2. * fract(p * C.www) - 1.;
    let h = abs(x) - 0.5;
    let ox = floor(x + 0.5);
    let a0 = x - ox;

    // Normalize gradients implicitly by scaling m
    // Approximation of: m *= inversesqrt( a0*a0 + h*h );
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

    // Compute final noise value at P
    let g = vec3(a0.x * x0.x + h.x * x0.y, a0.yz * x12.xz + h.yz * x12.yw);
    return (130. * dot(m, g))*0.5+0.5;
}
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
      var uvPos = vec2<i32>(floor(uv0*textureSize));
        var color=textureLoad(colorTexture,  uvPos ,0); ;
      let yVal = step(0.8,simplexNoise2(vec2(uv0.y*5.0,uniforms.time*2.0)));
            let yVal2 = step(0.2,simplexNoise2(vec2(uv0.y*10.0,uniforms.time+10)));
      let xVal = step(0.2,simplexNoise2(vec2(uniforms.time,uv0.x*20.0)));
      var uv = uv0+vec2(clamp(yVal*xVal*0.02*uniforms.value1 -yVal2*xVal*0.1,0,1),0.0);
      
      
          let yVal3 = step(0.9,simplexNoise2(vec2(uv0.y*6.0,uniforms.time+100)));
      uv+=vec2(sin((uv.y+uniforms.time*0.2)*100),0)*0.05*yVal3*uniforms.value1;
      
     uvPos = vec2<i32>(floor(uv*textureSize));
      if(textureLoad(mask,  uvPos ,0).x>0.5){
      
    color=textureLoad(colorTexture,  uvPos ,0)*uniforms.rand; 
      }
      
      
      
      
      let UVi =i32(floor(round(15.0*(uniforms.value1+uniforms.value2))));
      let uvPos2 = uvPos+vec2<i32>(UVi,0);
      let uvPos3 = uvPos+vec2<i32>(-UVi,0);
      
      if(textureLoad(mask,  uvPos2 ,0).x>0.5){
         color.x=textureLoad(colorTexture,  uvPos2 ,0).x*uniforms.rand; 
      }
      if(textureLoad(mask,  uvPos3 ,0).x>0.5){
         color.z=textureLoad(colorTexture,  uvPos3 ,0).z*uniforms.rand; ;
      }
     return vec4(color.xyz,1.0) ;
}
///////////////////////////////////////////////////////////
        `
    }






}
