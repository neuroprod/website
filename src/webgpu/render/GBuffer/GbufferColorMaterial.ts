import Material from "../../lib/material/Material.ts";
import {ShaderType} from "../../lib/material/ShaderTypes.ts";
import DefaultUniformGroups from "../../lib/material/DefaultUniformGroups.ts";
import UniformGroup from "../../lib/material/UniformGroup.ts";
import DefaultTextures from "../../lib/textures/DefaultTextures.ts";
import {AddressMode, FilterMode} from "../../lib/WebGPUConstants.ts";
import {Vector4} from "@math.gl/core";


export default class GBufferColorMaterial extends Material{

    setup(){
        this.addAttribute("aPos", ShaderType.vec3);
        this.addAttribute("aNormal", ShaderType.vec3);


        this.addVertexOutput("normal", ShaderType.vec3 );


        this.addUniformGroup(DefaultUniformGroups.getCamera(this.renderer));
        this.addUniformGroup(DefaultUniformGroups.getModelTransform(this.renderer));


        let uniforms =new UniformGroup(this.renderer,"uniforms");
        this.addUniformGroup(uniforms,true);
uniforms.addUniform("color",new Vector4(240/255,110/255,170/255,1))

        //this.logShader =true;
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
    output.position =camera.viewProjectionMatrix*model.modelMatrix* vec4( aPos,1.0);
    output.normal = model.normalMatrix*aNormal;

    return output;
}


@fragment
fn mainFragment(${this.getFragmentInput()}) ->  GBufferOutput
{
    var output : GBufferOutput;

     output.color =uniforms.color;
    output.normal =vec4(normalize(normal)*vec3f(0.5) +vec3f(0.5),0.0);

    return output;
}
///////////////////////////////////////////////////////////
        `
    }


}
