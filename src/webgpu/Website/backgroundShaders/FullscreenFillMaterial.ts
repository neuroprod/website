import Material from "../../lib/material/Material.ts";
import {ShaderType} from "../../lib/material/ShaderTypes.ts";
import DefaultUniformGroups from "../../lib/material/DefaultUniformGroups.ts";
import UniformGroup from "../../lib/material/UniformGroup.ts";
import DefaultTextures from "../../lib/textures/DefaultTextures.ts";
import {AddressMode, FilterMode} from "../../lib/WebGPUConstants.ts";
import Blend from "../../lib/material/Blend.ts";
import { vec4, Vector4 } from "@math.gl/core";


export default class FullScreenFillMaterial extends Material{

    public scale = new Vector4(1,1,1,1)
    setRatios(screen:number,img:number){

      
        if(img>screen){
            this.scale.y=1;
            this.scale.x =img/screen
        }else{
         
            this.scale.x =1
            this.scale.y =screen/ img
        }
        this.setUniform("scale",this.scale)
    }
    setup(){
        this.addAttribute("aPos", ShaderType.vec3);

        this.addAttribute("aUV0", ShaderType.vec2);


        this.addVertexOutput("uv", ShaderType.vec2 );



        let uniforms =new UniformGroup(this.renderer,"uniforms");
         uniforms.addUniform("scale",new Vector4(0.5,1.0,0.0,0.0))
        this.addUniformGroup(uniforms,true);

        uniforms.addTexture("colorTexture",DefaultTextures.getWhite(this.renderer))
        uniforms.addSampler("mySampler",  GPUShaderStage.FRAGMENT,  FilterMode.Linear,  AddressMode.ClampToEdge, 4)
this.depthCompare="always"
        this.depthWrite=false
        this.blendModes=[Blend.alpha()]
        //this.logShader =true;
    }
    getShader(): string {
        return /* wgsl */ `

${this.getVertexOutputStruct()}   


${this.getShaderUniforms()}
@vertex
fn mainVertex( ${this.getShaderAttributes()} ) -> VertexOutput
{
    var output : VertexOutput;

    output.position =vec4(aPos.xy*uniforms.scale.xy, aPos.z,1.0);
    output.position.z =0.9;
    output.uv =aUV0;
    return output;
}


@fragment
fn mainFragment(${this.getFragmentInput()})  ->  @location(0) vec4f
{

    let color =textureSample(colorTexture, mySampler,  uv);
 

    return color;
}
///////////////////////////////////////////////////////////
        `
    }


}
