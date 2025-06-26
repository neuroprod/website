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
        uniforms.addTexture("irradiance",DefaultTextures.getWhite(this.renderer))
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
const m1 = mat3x3f(
    0.59719, 0.07600, 0.02840,
    0.35458, 0.90834, 0.13383,
    0.04823, 0.01566, 0.83777
    );
const m2 = mat3x3f(
    1.60475, -0.10208, -0.00327,
    -0.53108,  1.10813, -0.07276,
    -0.07367, -0.00605,  1.07602
    );
fn acestonemap( color:vec3f)->vec3f{
  
    let v = m1 * color;
    let a = v * (v + 0.0245786) - 0.000090537;
    let b = v * (0.983729 * v + 0.4329510) + 0.238081;
    let r=m2 * (a / b);
    return pow(clamp(r, vec3f(0.0), vec3f(1.0)), vec3f(1. / 2.2));
}
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
let N =normalize(normal);
    var color =textureSample(colorTexture, mySampler,  uv);
    let V      = normalize(camera.worldPosition.xyz - world); // vector to eye in world space
    let R      = reflect(-V, N);
    let  NdotV = max(0.0, dot(N, V));
    
    var F0 = vec3(0.04); 
    F0 = mix(F0,color.xyz, 0.1);


    let F = modifiedFresnel(NdotV, F0, 0.1);


    var uvN = vec2(atan2(R.z, R.x), -asin(R.y));
    uvN *= vec2(0.1591,0.3183);
    uvN += 0.5;


var uvI = vec2(atan2(N.z, N.x), -asin(N.y));
    uvI *= vec2(0.1591,0.3183);
    uvI += 0.5;
var ir =textureSample(irradiance, mySampler,  uvI)*0.1;

var color2 =textureSample(specular, mySampler,  uvN)*0.1;
let c = (F*color2.xyz+(color.xyz*ir.xyz*(vec3f(1.0)-F)+color.xyz*0.5));

 return vec4(c,color.w);


}
///////////////////////////////////////////////////////////
        `
    }


}
