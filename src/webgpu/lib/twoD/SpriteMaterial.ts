import Material from "../material/Material.ts";
import Renderer from "../Renderer.ts";
import { ShaderType } from "../material/ShaderTypes.ts";
import DefaultUniformGroups from "../material/DefaultUniformGroups.ts";
import UniformGroup from "../material/UniformGroup.ts";
import DefaultTextures from "../textures/DefaultTextures.ts";
import Blend from "../material/Blend.ts";
import { CullMode } from "../WebGPUConstants.ts";
import { Matrix4 } from "@math.gl/core";

export default class SpriteMaterial extends Material {

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

        uniforms.addTexture("texture", DefaultTextures.getGrid(this.renderer));

        uniforms.addSampler("mySampler")
        this.blendModes = [Blend.preMultAlpha()]
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

    

    var textColor =  textureSample(texture, mySampler, uv);
 
    let a = textColor.w*uniforms.alpha;
    
    return   vec4(textColor.xyz*a,a);
}
///////////////////////////////////////////////////////////
        `
    }


}
