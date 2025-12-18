import Material from "../material/Material.ts";
import { ShaderType } from "../material/ShaderTypes.ts";
import DefaultUniformGroups from "../material/DefaultUniformGroups.ts";
import UniformGroup from "../material/UniformGroup.ts";
import DefaultTextures from "../textures/DefaultTextures.ts";
import { CullMode } from "../WebGPUConstants.ts";
import Blend from "../material/Blend.ts";
import { Matrix4, Vector4 } from "@math.gl/core";

export default class AnimatedTextMaterial extends Material {

    setup() {
        this.addAttribute("aPos", ShaderType.vec3);
        this.addAttribute("aNormal", ShaderType.vec3);
        this.addAttribute("aUV0", ShaderType.vec2);

        // this.addVertexOutput("normal", ShaderType.vec3 );
        this.addVertexOutput("uv", ShaderType.vec2);

        this.addUniformGroup(DefaultUniformGroups.getCamera2D(this.renderer), true);


        let uniforms = new UniformGroup(this.renderer, "uniforms");
        this.addUniformGroup(uniforms, true);
        uniforms.addUniform("worldMatrix", new Matrix4().identity())
        uniforms.addUniform("color", new Vector4(1, 1, 1, 1))
        uniforms.addUniform("alpha", 1);
        uniforms.addUniform("charPos", 8.0)

        uniforms.addTexture("texture", DefaultTextures.getGrid(this.renderer));

        uniforms.addSampler("mySampler")
        this.cullMode = CullMode.None;
        this.depthCompare = "always"
        this.depthWrite = false;

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
   
     let s  =1.0- smoothstep(uniforms.charPos,uniforms.charPos+4.0, aNormal.z);
    var pos =  aPos;
    pos.x -=aNormal.x;
    pos.y -=aNormal.y;
    pos*=s;
     pos.x +=aNormal.x;
    pos.y +=aNormal.y;
  
    output.position =camera2D.viewProjectionMatrix*uniforms.worldMatrix* vec4( pos,1.0);

    output.uv =aUV0;
    return output;
}


@fragment
fn mainFragment(${this.getFragmentInput()}) ->  @location(0) vec4f
{

    
    
     var text= textureSample(texture, mySampler,  uv);//textureLoad(fontTexture,  mySampler,0);
      let sigDist = max(min(text.r, text.g), min(max(text.r, text.g), text.b))- 0.5;

  let pxRange = 4.0;

  let dx = 512*length(vec2f(dpdxFine(uv.x), dpdyFine(uv.x)));
  let dy = 512*length(vec2f(dpdxFine(uv.y), dpdyFine(uv.y)));
  let toPixels = pxRange * inverseSqrt(dx * dx + dy * dy);

  let pxDist = sigDist * toPixels;

  let edgeWidth = 0.5;

  let a= smoothstep(-edgeWidth, edgeWidth, pxDist);
   
  
let c =uniforms.color*a;

    return c;
}
///////////////////////////////////////////////////////////
        `
    }


}
