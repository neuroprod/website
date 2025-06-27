import Material from "../../../lib/material/Material.ts";
import {ShaderType} from "../../../lib/material/ShaderTypes.ts";
import DefaultUniformGroups from "../../../lib/material/DefaultUniformGroups.ts";
import UniformGroup from "../../../lib/material/UniformGroup.ts";
import DefaultTextures from "../../../lib/textures/DefaultTextures.ts";
import {CullMode, VertexStepMode} from "../../../lib/WebGPUConstants.ts";
import Blend from "../../../lib/material/Blend.ts";


export default class FlowerMaterial extends Material{

    setup(){
        this.addAttribute("aPos", ShaderType.vec3);

        this.addAttribute("aUV0", ShaderType.vec2);

        this.addAttribute("instancePos", ShaderType.vec3,1 ,VertexStepMode.Instance);
        this.addAttribute("instanceData", ShaderType.vec2,1 ,VertexStepMode.Instance);

        this.addVertexOutput("uv", ShaderType.vec2 );
        this.addVertexOutput("edge", ShaderType.vec2 );
        this.addUniformGroup(DefaultUniformGroups.getCamera(this.renderer));
        this.addUniformGroup(DefaultUniformGroups.getModelTransform(this.renderer));


        let uniforms =new UniformGroup(this.renderer,"uniforms");
        this.addUniformGroup(uniforms,true);
uniforms.addUniform("progress",0)
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

fn rotate( v:vec2f,  a:f32)->vec2f {
let s = sin(a);
let c = cos(a);
let m = mat2x2<f32>(c, s, -s, c);
return m * v;
}

@vertex
fn mainVertex( ${this.getShaderAttributes()} ) -> VertexOutput
{
    var output : VertexOutput;
    let V = rotate(vec2(aPos.x,aPos.y),instanceData.x);
    
    let p = vec3(V.x, V.y,aPos.z)*0.07 +instancePos;
    
    output.position =camera.viewProjectionMatrix*model.modelMatrix* vec4( p,1.0);
    let uv = vec2(aUV0.x*0.5+0.5,aUV0.y);
    output.uv =uv;
    output.edge.x = instanceData.y;
    return output;
}


@fragment
fn mainFragment(${this.getFragmentInput()}) ->  @location(0) vec4f
{

 let color =textureSample(colorTexture, mySampler,  uv);
let  W = vec3(0.2125, 0.7154, 0.0721);
    let intensity = vec3(dot(color.xyz, vec3(0.2125, 0.7154, 0.0721)));
    
    let p =smoothstep(edge.x,edge.x+0.3 ,uniforms.progress*1.3);
    
    let gray = mix(intensity, color.xyz, p);
//uniforms.progress


let alpha =color.w;
    return vec4(gray*alpha,alpha);
}
///////////////////////////////////////////////////////////
        `
    }


}
