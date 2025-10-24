import Material from "../../lib/material/Material.ts";
import { ShaderType } from "../../lib/material/ShaderTypes.ts";
import UniformGroup from "../../lib/material/UniformGroup.ts";



export default class AsciiCloudMaterial extends Material {
    setup() {
        this.addAttribute("aPos", ShaderType.vec3);
        this.addAttribute("aUV0", ShaderType.vec2);
        this.addVertexOutput("uv0", ShaderType.vec2);

        let uniforms = new UniformGroup(this.renderer, "uniforms");
        this.addUniformGroup(uniforms, true);
        uniforms.addUniform("time", 0)


        this.depthWrite = false;
        this.depthCompare = "always"
        //this.logShader =true;
    }
    getShader(): string {
        return /* wgsl */ `
///////////////////////////////////////////////////////////   

${this.getVertexOutputStruct()}   


${this.getShaderUniforms()}


fn hash(p: vec2f) -> vec2f // replace this by something better
{
    let p2 = vec2f( dot(p,vec2f(127.1,311.7)), dot(p,vec2f(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(p2)*43758.5453123);
}

fn simplex2d(p: vec2f) -> f32
{
    let K1 = 0.366025404; // (sqrt(3)-1)/2;
    let K2 = 0.211324865; // (3-sqrt(3))/6;
    let i = floor( p + (p.x+p.y)*K1 );
    let a = p - i + (i.x+i.y)*K2;
    let o = step(a.yx,a.xy);
    let b = a - o + K2;
    let c = a - 1.0 + 2.0*K2;
    let h = max( 0.5-vec3f(dot(a,a), dot(b,b), dot(c,c) ), vec3f(0.) );
    let n = h*h*h*h*vec3f( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
    return dot( n, vec3f(70.0) );
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
   
    
      let n =simplex2d(uv0*vec2(3.0,9.0)+vec2f(uniforms.time,0))+simplex2d(uv0*vec2(10.0,20.0)+vec2f(-uniforms.time*0.5,0))*0.3;
     return vec4(smoothstep(0.4,0.6,n),0,0,1.0) ;
}
///////////////////////////////////////////////////////////
        `
    }






}
