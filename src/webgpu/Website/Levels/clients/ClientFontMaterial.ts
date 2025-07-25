import Material from "../../../lib/material/Material.ts";
import {ShaderType} from "../../../lib/material/ShaderTypes.ts";
import DefaultUniformGroups from "../../../lib/material/DefaultUniformGroups.ts";
import UniformGroup from "../../../lib/material/UniformGroup.ts";
import {Textures} from "../../../data/Textures.ts";
import {CullMode} from "../../../lib/WebGPUConstants.ts";
import Blend from "../../../lib/material/Blend.ts";
import {Vector4} from "@math.gl/core";


export default class ClientFontMaterial extends Material{

    setup(){
        this.addAttribute("aPos", ShaderType.vec3);
        this.addAttribute("aCenter", ShaderType.vec3);
        this.addAttribute("aNormal", ShaderType.vec3);
        this.addAttribute("aUV0", ShaderType.vec2);

        // this.addVertexOutput("normal", ShaderType.vec3 );
        this.addVertexOutput("uv", ShaderType.vec2 );

        this.addUniformGroup(DefaultUniformGroups.getCamera(this.renderer));
        this.addUniformGroup(DefaultUniformGroups.getModelTransform(this.renderer));


        let uniforms =new UniformGroup(this.renderer,"uniforms");
        this.addUniformGroup(uniforms,true);
        uniforms.addUniform("color",new Vector4(255/255,142/255,188/255,1))
        uniforms.addUniform("time",0)
        uniforms.addUniform("size",0)
        uniforms.addTexture("colorTexture",this.renderer.getTexture(Textures.MAINFONT))
        uniforms.addSampler("mySampler")
        this.cullMode =CullMode.None;
        this.depthCompare="less-equal"
        this.depthWrite =false;

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

    var pos =  aPos-aCenter;
    var center = aCenter;
var p = (uniforms.time+aCenter.x)%uniforms.size;
 
 if(p<0.6)
 {

 pos.y = pos.y+p ;
 }
 else{
 p-=0.6;
  center.x  =p;
 center.y = sin(p*10)*0.1 +0.6;
  pos+=center;
 }
 

 

    output.position =camera.viewProjectionMatrix*model.modelMatrix* vec4( pos,1.0);
    output.uv =aUV0;
    return output;
}


@fragment
fn mainFragment(${this.getFragmentInput()}) ->  @location(0) vec4f
{

    
    
     var text= textureSample(colorTexture, mySampler,  uv);//textureLoad(fontTexture,  mySampler,0);
      let sigDist = max(min(text.r, text.g), min(max(text.r, text.g), text.b))- 0.5;

  let pxRange = 4.0;

  let dx = 512*length(vec2f(dpdxFine(uv.x), dpdyFine(uv.x)));
  let dy = 512*length(vec2f(dpdxFine(uv.y), dpdyFine(uv.y)));
  let toPixels = pxRange * inverseSqrt(dx * dx + dy * dy);

  let pxDist = sigDist * toPixels;

  let edgeWidth = 0.5;

  let a= smoothstep(-edgeWidth, edgeWidth, pxDist);
   



    return   uniforms.color*a;
}
///////////////////////////////////////////////////////////
        `
    }


}
