import { Vector4 } from "@math.gl/core";
import DefaultUniformGroups from "../../../../lib/material/DefaultUniformGroups.ts";
import Material from "../../../../lib/material/Material.ts";
import { ShaderType } from "../../../../lib/material/ShaderTypes.ts";
import UniformGroup from "../../../../lib/material/UniformGroup.ts";
import DefaultTextures from "../../../../lib/textures/DefaultTextures.ts";
import { CullMode } from "../../../../lib/WebGPUConstants.ts";


export default class GbufferButterMaterial extends Material {

    setup() {
        this.addAttribute("aPos", ShaderType.vec3);
        // this.addAttribute("aNormal", ShaderType.vec3);
        this.addAttribute("aUV0", ShaderType.vec2);

        this.addVertexOutput("normal", ShaderType.vec3);
        this.addVertexOutput("uv", ShaderType.vec2);

        this.addUniformGroup(DefaultUniformGroups.getCamera(this.renderer));
        this.addUniformGroup(DefaultUniformGroups.getModelTransform(this.renderer));


        let uniforms = new UniformGroup(this.renderer, "uniforms");
        this.addUniformGroup(uniforms, true);
        uniforms.addUniform("angle", new Vector4())
        uniforms.addTexture("colorTexture", DefaultTextures.getWhite(this.renderer))
        uniforms.addSampler("mySampler")
        this.cullMode = CullMode.None
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


let normal = vec3f(1,0,0);

let pos = vec3((aPos.x *uniforms.angle.x +aPos.y *uniforms.angle.z )  *aPos.z,
(aPos.x *uniforms.angle.y+aPos.y *uniforms.angle.w) *abs(aPos.z),
 aPos.y);
    output.position =camera.viewProjectionMatrix*model.modelMatrix* vec4( pos,1.0);
    output.normal = model.normalMatrix*vec3(-pos.y,pos.x,0);
    output.uv =aUV0;
    return output;
}


@fragment
fn mainFragment(${this.getFragmentInput()}) ->  GBufferOutput
{
    var output : GBufferOutput;
   let color =textureSample(colorTexture, mySampler,  uv);
    if(color.a<0.5  )
    {
        discard;
    }
   output.color = vec4(color.xyz*vec3f(1.0/color.a),1.0);


    output.normal =vec4(normalize(normal)*vec3f(0.5) +vec3f(0.5),0.0);

    return output;
}
///////////////////////////////////////////////////////////
        `
    }


}
