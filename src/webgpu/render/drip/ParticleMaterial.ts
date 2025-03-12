import Material from "../../lib/material/Material.ts";
import {ShaderType} from "../../lib/material/ShaderTypes.ts";
import DefaultUniformGroups from "../../lib/material/DefaultUniformGroups.ts";
import UniformGroup from "../../lib/material/UniformGroup.ts";
import {Textures} from "../../data/Textures.ts";
import {CullMode, VertexStepMode} from "../../lib/WebGPUConstants.ts";
import Blend from "../../lib/material/Blend.ts";
import {Vector4} from "@math.gl/core";


export default class ParticleMaterial extends Material{

    setup(){
        this.addAttribute("aPos", ShaderType.vec3);

        this.addAttribute("aUV0", ShaderType.vec2);
        this.addAttribute("instancesData", ShaderType.vec2,1,VertexStepMode.Instance);
        // this.addVertexOutput("normal", ShaderType.vec3 );
        this.addVertexOutput("uv", ShaderType.vec2 );

        this.addUniformGroup(DefaultUniformGroups.getCamera(this.renderer));
        this.addUniformGroup(DefaultUniformGroups.getModelTransform(this.renderer));



        this.cullMode =CullMode.None;
        this.depthCompare="less-equal"
        this.depthWrite =false;

       // this.blendModes =[Blend.preMultAlpha()]
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

    var pos =  aPos*0.5;
   pos.x =pos.x +instancesData.x;
   pos.y =pos.y +instancesData.y;
    output.position =camera.viewProjectionMatrix*model.modelMatrix* vec4( pos,1.0);
    output.uv =aUV0;
    return output;
}


@fragment
fn mainFragment(${this.getFragmentInput()}) ->  @location(0) vec4f
{
    return   vec4f(uv,0,1.0);
}
///////////////////////////////////////////////////////////
        `
    }


}
