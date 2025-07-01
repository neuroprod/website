import Material from "../../../lib/material/Material.ts";
import {ShaderType} from "../../../lib/material/ShaderTypes.ts";
import DefaultUniformGroups from "../../../lib/material/DefaultUniformGroups.ts";
import UniformGroup from "../../../lib/material/UniformGroup.ts";
import DefaultTextures from "../../../lib/textures/DefaultTextures.ts";
import {AddressMode, FilterMode, VertexStepMode} from "../../../lib/WebGPUConstants.ts";


export default class LineMaterial extends Material{

    setup(){
        this.addAttribute("aPos", ShaderType.vec3);
        this.addAttribute("aNormal", ShaderType.vec3);
        this.addAttribute("aUV0", ShaderType.vec2);

        this.addAttribute("instancesMatrix0", ShaderType.vec4,1,VertexStepMode.Instance);
        this.addAttribute("instancesMatrix1", ShaderType.vec4,1,VertexStepMode.Instance);
        this.addAttribute("instancesMatrix2", ShaderType.vec4,1,VertexStepMode.Instance);
        this.addAttribute("instancesMatrix3", ShaderType.vec4,1,VertexStepMode.Instance);




        this.addUniformGroup(DefaultUniformGroups.getCamera(this.renderer));
        this.addUniformGroup(DefaultUniformGroups.getModelTransform(this.renderer));


        let uniforms =new UniformGroup(this.renderer,"uniforms");
        this.addUniformGroup(uniforms,true);
        uniforms.addUniform("time",0)

    
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
    
    var p = aPos;

     p.z *=0.01;
     p.y =sin((p.x+uniforms.time*5)*20.0)*0.04 +aPos.y*0.01;
     p.x*=0.5;
  let modelM= mat4x4<f32>(instancesMatrix0,instancesMatrix1,instancesMatrix2,instancesMatrix3);
    
     
    output.position =camera.viewProjectionMatrix*model.modelMatrix*modelM * vec4( p,1.0);
  
    return output;
}


@fragment
fn mainFragment(${this.getFragmentInput()}) ->  @location(0) vec4f
{

    return vec4(1,1,1,1.0,);
}
///////////////////////////////////////////////////////////
        `
    }


}
