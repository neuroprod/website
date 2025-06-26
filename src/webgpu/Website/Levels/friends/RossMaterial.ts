import Material from "../../../lib/material/Material.ts";
import {ShaderType} from "../../../lib/material/ShaderTypes.ts";
import DefaultUniformGroups from "../../../lib/material/DefaultUniformGroups.ts";
import UniformGroup from "../../../lib/material/UniformGroup.ts";
import DefaultTextures from "../../../lib/textures/DefaultTextures.ts";
import {CullMode} from "../../../lib/WebGPUConstants.ts";
import Blend from "../../../lib/material/Blend.ts";


export default class RossMaterial extends Material{

    setup(){
        this.addAttribute("aPos", ShaderType.vec3);
        this.addAttribute("aNormal", ShaderType.vec3);
        this.addAttribute("aUV0", ShaderType.vec2);
        this.addVertexOutput("world", ShaderType.vec3 );
        this.addVertexOutput("normal", ShaderType.vec3 );
        this.addVertexOutput("uv", ShaderType.vec2 );

        this.addUniformGroup(DefaultUniformGroups.getCamera(this.renderer));
        this.addUniformGroup(DefaultUniformGroups.getModelTransform(this.renderer));


        let uniforms =new UniformGroup(this.renderer,"uniforms");
        this.addUniformGroup(uniforms,true);
        uniforms.addTexture("specular",DefaultTextures.getWhite(this.renderer))
        uniforms.addTexture("colorTexture",DefaultTextures.getWhite(this.renderer))
        uniforms.addSampler("mySampler")
        //this.cullMode =CullMode.None;
        this.blendModes =[Blend.preMultAlpha()]

    }
    getShader(): string {
        return /* wgsl */ `
///////////////////////////////////////////////////////////   

${this.getVertexOutputStruct()}   


${this.getShaderUniforms()}

fn modifiedFresnel( cosTheta:f32,  F0:vec3f,  roughness:f32) ->vec3f {
return F0 + (max(vec3(1.-roughness), F0) - F0) * pow(1.0 - cosTheta, 5.0);
}


@vertex
fn mainVertex( ${this.getShaderAttributes()} ) -> VertexOutput
{
    var output : VertexOutput;
    output.position =camera.viewProjectionMatrix*model.modelMatrix* vec4( aPos,1.0);
    output.world=(model.modelMatrix* vec4( aPos,1.0)).xyz;
    output.normal = model.normalMatrix*aNormal;
    output.uv =aUV0;
    return output;
}


@fragment
fn mainFragment(${this.getFragmentInput()}) ->  @location(0) vec4f
{
    var color =textureSample(colorTexture, mySampler,  uv);
    let V      = normalize(camera.worldPosition.xyz - world); // vector to eye in world space
    let R      = reflect(-V, normal);
    let  NdotV = max(0.0, dot(normal, V));
    
    var F0 = vec3(0.04); 
    F0 = mix(F0,color.xyz, 0.1);


    let F = modifiedFresnel(NdotV, F0, 0.0);


    var uvN = vec2(atan2(R.z, R.x), -asin(R.y));
    uvN *= vec2(0.1591,0.3183);
    uvN += 0.5;


var color2 =textureSample(specular, mySampler,  uvN)*10;

 return vec4(F*color2.xyz+color.xyz,color.w);


}
///////////////////////////////////////////////////////////
        `
    }


}
