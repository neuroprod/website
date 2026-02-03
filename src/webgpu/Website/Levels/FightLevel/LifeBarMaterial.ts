import { Matrix4 } from "@math.gl/core";
import DefaultUniformGroups from "../../../lib/material/DefaultUniformGroups.ts";
import Material from "../../../lib/material/Material.ts";
import { ShaderType } from "../../../lib/material/ShaderTypes.ts";
import UniformGroup from "../../../lib/material/UniformGroup.ts";
import Renderer from "../../../lib/Renderer.ts";
import Blend from "../../../lib/material/Blend.ts";
import DefaultTextures from "../../../lib/textures/DefaultTextures.ts";
import { CullMode } from "../../../lib/WebGPUConstants.ts";


export default class LiveBarMaterial extends Material {

    constructor(renderer: Renderer) {
        super(renderer, "spriteMaterial");

    }

    setup() {
        this.addAttribute("aPos", ShaderType.vec3);
        this.addAttribute("aUV0", ShaderType.vec2);
        this.addVertexOutput("uv", ShaderType.vec2);


        this.addUniformGroup(DefaultUniformGroups.getCamera2D(this.renderer), true);


        let uniforms = new UniformGroup(this.renderer, "uniforms");
        this.addUniformGroup(uniforms, true);
        uniforms.addUniform("worldMatrix", new Matrix4().identity())
        uniforms.addUniform("alpha", 1);
uniforms.addUniform("life",0.5)
        uniforms.addTexture("texture", DefaultTextures.getGrid(this.renderer));

        uniforms.addSampler("mySampler")
        this.blendModes = [Blend.alpha()]
        this.cullMode = CullMode.None;
        this.depthWrite = false;
        this.depthCompare = "always"

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
    output.position =camera2D.viewProjectionMatrix*uniforms.worldMatrix *vec4( aPos,1.0);
    output.uv =aUV0;

    return output;
}


@fragment
fn mainFragment(${this.getFragmentInput()}) ->  @location(0) vec4f
{

    

    let textMask =  textureSample(texture, mySampler, uv).a;
  let textcolor =  textureSample(texture, mySampler, uv+vec2(1-uniforms.life,0)).a;
    let a = textMask*textcolor;
    
    return   vec4(a*uniforms.alpha);
}
///////////////////////////////////////////////////////////
        `
    }


}
