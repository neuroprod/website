import Material from "../../../lib/material/Material.ts";
import {ShaderType} from "../../../lib/material/ShaderTypes.ts";
import DefaultUniformGroups from "../../../lib/material/DefaultUniformGroups.ts";
import UniformGroup from "../../../lib/material/UniformGroup.ts";
import DefaultTextures from "../../../lib/textures/DefaultTextures.ts";
import {AddressMode, FilterMode, VertexStepMode} from "../../../lib/WebGPUConstants.ts";


export default class PixelMaterial extends Material{

    setup(){
        this.addAttribute("aPos", ShaderType.vec3);
        this.addAttribute("aNormal", ShaderType.vec3);
        this.addAttribute("instanceData", ShaderType.vec4,1,VertexStepMode.Instance);
        //this.addAttribute("aUV0", ShaderType.vec2);

        this.addVertexOutput("normal", ShaderType.vec3 );
       this.addVertexOutput("color", ShaderType.vec3 );

        this.addUniformGroup(DefaultUniformGroups.getCamera(this.renderer));
        this.addUniformGroup(DefaultUniformGroups.getModelTransform(this.renderer));


        let uniforms =new UniformGroup(this.renderer,"uniforms");
        this.addUniformGroup(uniforms,true);

        uniforms.addTexture("colorTexture",DefaultTextures.getWhite(this.renderer),{usage:GPUShaderStage.VERTEX})


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
    
       let uvPos = vec2<i32>(floor(instanceData.zw));
      var color=textureLoad(colorTexture,  uvPos ,0); ;
      
    var pos = aPos*0.01*color.w;
    pos.z *=5.0;
    pos.x = pos.x+ instanceData.x;
       pos.y = pos.y+ instanceData.y;
    output.position =camera.viewProjectionMatrix*model.modelMatrix* vec4(pos,1.0);
    output.normal = model.normalMatrix*aNormal;
    output.color =color.xyz;
    return output;
}


@fragment
fn mainFragment(${this.getFragmentInput()}) ->  GBufferOutput
{
    var output : GBufferOutput;



     output.color =vec4(color,1.0);
    output.normal =vec4(normalize(normal)*vec3f(0.5) +vec3f(0.5),0.0);

    return output;
}
///////////////////////////////////////////////////////////
        `
    }


}
