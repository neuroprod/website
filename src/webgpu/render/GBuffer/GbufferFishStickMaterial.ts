import Material from "../../lib/material/Material.ts";
import {ShaderType} from "../../lib/material/ShaderTypes.ts";
import DefaultUniformGroups from "../../lib/material/DefaultUniformGroups.ts";
import UniformGroup from "../../lib/material/UniformGroup.ts";
import DefaultTextures from "../../lib/textures/DefaultTextures.ts";
import {VertexStepMode} from "../../lib/WebGPUConstants.ts";


export default class GBufferFishStickMaterial extends Material{

    setup(){
        this.addAttribute("aPos", ShaderType.vec3);
        this.addAttribute("aNormal", ShaderType.vec3);
        this.addAttribute("aUV0", ShaderType.vec2);
        this.addAttribute("position", ShaderType.vec3,1,VertexStepMode.Instance);
  

        this.addVertexOutput("normal", ShaderType.vec3 );
        this.addVertexOutput("uv", ShaderType.vec2 );

        this.addUniformGroup(DefaultUniformGroups.getCamera(this.renderer));
        this.addUniformGroup(DefaultUniformGroups.getModelTransform(this.renderer));


        let uniforms =new UniformGroup(this.renderer,"uniforms");
        this.addUniformGroup(uniforms,true);
uniforms.addUniform("time",0)
        uniforms.addTexture("colorTexture",DefaultTextures.getWhite(this.renderer))
        uniforms.addSampler("mySampler")
this.logShader =true;
    }
    getShader(): string {
        return /* wgsl */ `
///////////////////////////////////////////////////////////   
struct GBufferOutput {
  @location(0) color : vec4f,
  @location(1) normal : vec4f,
   
}
${this.getVertexOutputStruct()}   


${this.getShaderUniforms()}
@vertex
fn mainVertex( ${this.getShaderAttributes()} ) -> VertexOutput
{
    var output : VertexOutput;
    
let offset = sin(aPos.x*10.0+uniforms.time*1.0);
    let posScale = aPos * vec3(0.3, 0.3, 2);
   let  posPos = posScale+ position.xyz+vec3(0.0,0.0,offset*0.02);
    output.position =camera.viewProjectionMatrix *vec4(posPos,1.0);
    

    
    output.normal = normalize(aNormal+vec3(offset*0.5,0,0));
    output.uv =aUV0;
    return output;
}


@fragment
fn mainFragment(${this.getFragmentInput()}) ->  GBufferOutput
{
    var output : GBufferOutput;
    var color =textureSample(colorTexture, mySampler,  uv);
     color =color+ vec4(1.0,1.0,1.0,1.0)*(1.0-color.a);
     output.color =color;
    output.normal =vec4(normalize(normal)*vec3f(0.5) +vec3f(0.5),0.0);

    return output;
}
///////////////////////////////////////////////////////////
        `
    }


}
