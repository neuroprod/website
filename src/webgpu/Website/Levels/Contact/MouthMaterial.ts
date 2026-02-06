import Material from "../../../lib/material/Material.ts";
import {ShaderType} from "../../../lib/material/ShaderTypes.ts";
import DefaultUniformGroups from "../../../lib/material/DefaultUniformGroups.ts";
import UniformGroup from "../../../lib/material/UniformGroup.ts";
import DefaultTextures from "../../../lib/textures/DefaultTextures.ts";
import {CullMode} from "../../../lib/WebGPUConstants.ts";
import Blend from "../../../lib/material/Blend.ts";


export default class MouthMaterial extends Material{

    setup(){
        this.addAttribute("aPos", ShaderType.vec3);

        this.addAttribute("aUV0", ShaderType.vec2);


        this.addVertexOutput("uv", ShaderType.vec2 );

        this.addUniformGroup(DefaultUniformGroups.getCamera(this.renderer));
        this.addUniformGroup(DefaultUniformGroups.getModelTransform(this.renderer));


        let uniforms =new UniformGroup(this.renderer,"uniforms");
        this.addUniformGroup(uniforms,true);
        uniforms.addUniform("topOffset",-0.01)
        uniforms.addUniform("bottomOffset",0.01)
        uniforms.addTexture("colorTexture",DefaultTextures.getWhite(this.renderer))
        uniforms.addSampler("mySampler")
        this.cullMode =CullMode.None;
       //this.blendModes =[Blend.preMultAlpha()]
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

    let mask =step(0.5,textureSample(colorTexture, mySampler,  uv).x);

    let  uvTop =uv+ vec2(0,uniforms.topOffset);  
    let top =step(0.5,1.0-textureSample(colorTexture, mySampler,  uvTop).y);

    let  uvBottom=uv+ vec2(0,uniforms.bottomOffset);  
    let bottom =step(0.5,1.0-textureSample(colorTexture, mySampler,  uvBottom).z);

    var c = (top+bottom)*mask*0.87;
c+=0.1;
    return vec4(c,c,c,1.0);
}
///////////////////////////////////////////////////////////
        `
    }


}
