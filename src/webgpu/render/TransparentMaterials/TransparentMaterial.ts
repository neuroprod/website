import Material from "../../lib/material/Material.ts";
import {ShaderType} from "../../lib/material/ShaderTypes.ts";
import DefaultUniformGroups from "../../lib/material/DefaultUniformGroups.ts";
import UniformGroup from "../../lib/material/UniformGroup.ts";
import DefaultTextures from "../../lib/textures/DefaultTextures.ts";
import {CullMode} from "../../lib/WebGPUConstants.ts";
import Blend from "../../lib/material/Blend.ts";


export default class TransparentMaterial extends Material{

    setup(){
        this.addAttribute("aPos", ShaderType.vec3);

        this.addAttribute("aUV0", ShaderType.vec2);


        this.addVertexOutput("uv", ShaderType.vec2 );

        this.addUniformGroup(DefaultUniformGroups.getCamera(this.renderer));
        this.addUniformGroup(DefaultUniformGroups.getModelTransform(this.renderer));


        let uniforms =new UniformGroup(this.renderer,"uniforms");
        this.addUniformGroup(uniforms,true);

        uniforms.addTexture("colorTexture",DefaultTextures.getWhite(this.renderer))
        uniforms.addSampler("mySampler")
        this.cullMode =CullMode.None;
       this.blendModes =[Blend.preMultAlpha()]
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
    output.position =camera.viewProjectionMatrix*model.modelMatrix* vec4( aPos,1.0);

    output.uv =aUV0;
    return output;
}


@fragment
fn mainFragment(${this.getFragmentInput()}) ->  @location(0) vec4f
{

  var color =textureSample(colorTexture, mySampler,  uv);





    return vec4(color.xyz*color.w,color.w);
}
///////////////////////////////////////////////////////////
        `
    }


}
