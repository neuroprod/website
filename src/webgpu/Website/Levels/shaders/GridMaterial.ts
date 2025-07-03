import Material from "../../../lib/material/Material.ts";
import { ShaderType } from "../../../lib/material/ShaderTypes.ts";
import UniformGroup from "../../../lib/material/UniformGroup.ts";


export default class GridMaterial extends Material {

    setup() {
        this.addAttribute("aPos", ShaderType.vec3);

        this.addAttribute("aUV0", ShaderType.vec2);


        this.addVertexOutput("uv", ShaderType.vec2);



        let uniforms = new UniformGroup(this.renderer, "uniforms");
        uniforms.addUniform("time", 0)
        uniforms.addUniform("ratio", 2)
        this.addUniformGroup(uniforms, true);


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
    var uvP = (uv)*30.0;
    uvP.x = uvP.x*uniforms.ratio;
uvP=uvP%1.0;
let l1 =max(0,step(0.5,uvP.x)-step(0.5,uvP.y));
let l2 =max(0,step(0.5,1.0-uvP.x)-step(0.5,1.0-uvP.y));
let c = mix(0.7,0.9,l1+l2);
    return vec4(c,c,c,1.0);
}
///////////////////////////////////////////////////////////
        `
    }


}
