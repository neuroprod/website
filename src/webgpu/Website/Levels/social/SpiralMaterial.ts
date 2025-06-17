import Material from "../../../lib/material/Material.ts";
import {ShaderType} from "../../../lib/material/ShaderTypes.ts";
import UniformGroup from "../../../lib/material/UniformGroup.ts";


export default class SpiralMaterial extends Material{

    setup(){
        this.addAttribute("aPos", ShaderType.vec3);

        this.addAttribute("aUV0", ShaderType.vec2);


        this.addVertexOutput("uv", ShaderType.vec2 );



        let uniforms =new UniformGroup(this.renderer,"uniforms");
        uniforms.addUniform("time",0)
        uniforms.addUniform("ratio",2)
        this.addUniformGroup(uniforms,true);


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
    output.position.z =0.99;
    output.uv =aUV0;
    return output;
}


@fragment
fn mainFragment(${this.getFragmentInput()})  ->  @location(0) vec4f
{
var uvP = (uv-0.5)*7.0;
uvP.x = uvP.x*uniforms.ratio+1.5;
let dis=.5;
let width=0.0;
let blur=.5;
  let angle=atan2(uvP.y,uvP.x);
        let l=length(uvP);
        let offset=l+(angle/(2.*3.1415))*dis;
        let circles=(offset-uniforms.time)%dis;
        var col=(smoothstep(circles-blur,circles,width)-smoothstep(circles,circles+blur,width));
        col =step(col,0.5);
    let color =mix(vec4(1.0,0.847,0.0,1.0),vec4(0.1,0.8,0.2,1.0),col);
 

    return color;
}
///////////////////////////////////////////////////////////
        `
    }


}
