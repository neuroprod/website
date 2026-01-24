import { Textures } from "../../../data/Textures.ts";
import Blend from "../../../lib/material/Blend.ts";
import DefaultUniformGroups from "../../../lib/material/DefaultUniformGroups.ts";
import Material from "../../../lib/material/Material.ts";
import { ShaderType } from "../../../lib/material/ShaderTypes.ts";
import UniformGroup from "../../../lib/material/UniformGroup.ts";
import DefaultTextures from "../../../lib/textures/DefaultTextures.ts";
import { CullMode, FilterMode } from "../../../lib/WebGPUConstants.ts";


export default class ProjectsMaterial extends Material {

    setup() {
        this.addAttribute("aPos", ShaderType.vec3);

        this.addAttribute("aUV0", ShaderType.vec2);


        this.addVertexOutput("uv", ShaderType.vec2);

        this.addUniformGroup(DefaultUniformGroups.getCamera(this.renderer));
        this.addUniformGroup(DefaultUniformGroups.getModelTransform(this.renderer));


        let uniforms = new UniformGroup(this.renderer, "uniforms");
        this.addUniformGroup(uniforms, true);
        uniforms.addUniform("size", 0.5);
        uniforms.addTexture("colorTexture", DefaultTextures.getWhite(this.renderer))
        uniforms.addTexture("distortTexture", this.renderer.getTexture(Textures.ASCII))
        uniforms.addSampler("mySampler")
        this.cullMode = CullMode.None;
        this.blendModes = [Blend.preMultAlpha()]
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


let dist =textureSample(distortTexture, mySampler,  uv);
var yS = dist.x*0.1+0.45 +dist.y*0.2;
let l = dist.z/2 *uniforms.size;
if(uv.y>yS+l || uv.y<yS-l){
    yS  =uv.y;
}
  var color =textureSample(colorTexture, mySampler,vec2(uv.x,  yS)).w;
  var colorB =textureSample(colorTexture, mySampler,uv).w;

if( dist.w>0.1) {


color =max(color, colorB);

}

  let s =color;// step(0.01,color);


    return vec4(vec3(1.0,0.8,0)*s,s);
}
///////////////////////////////////////////////////////////
        `
    }


}
