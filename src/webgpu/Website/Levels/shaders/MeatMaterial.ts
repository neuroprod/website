import Material from "../../../lib/material/Material.ts";
import {ShaderType} from "../../../lib/material/ShaderTypes.ts";
import UniformGroup from "../../../lib/material/UniformGroup.ts";
import DefaultTextures from "../../../lib/textures/DefaultTextures.ts";
import {TextureSampleType} from "../../../lib/WebGPUConstants.ts";
import DefaultUniformGroups from "../../../lib/material/DefaultUniformGroups.ts";


export default class MeatMaterial extends Material {
    setup(){
        this.addAttribute("aPos", ShaderType.vec3);

this.addVertexOutput("worldPos",ShaderType.vec3)
        this.addUniformGroup(DefaultUniformGroups.getCamera(this.renderer));
        this.addUniformGroup(DefaultUniformGroups.getModelTransform(this.renderer));

        let uniforms =new UniformGroup(this.renderer,"uniforms");
        this.addUniformGroup(uniforms,true);
uniforms.addUniform("time",1.0)

        this.logShader =true;
    }
    getShader(): string {
        return /* wgsl */ `
///////////////////////////////////////////////////////////   

${this.getVertexOutputStruct()}   


${this.getShaderUniforms()}

fn sdSphere(p:vec3f,r:f32)->f32{
  return length(p) - r;
}
fn opSmoothUnion(  d1:f32,  d2:f32,  k:f32 )->f32
{
    let h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h); 
}
  
fn hash2( p:vec2f )->f32
{
    let pp  = 50.0*fract( p*0.3183099 );
    return fract( pp.x*pp.y*(pp.x+pp.y) );
}

fn hash1(  n:f32 )->f32
{
    return fract( n*17.0*fract( n*0.3183099 ) );
}

 fn noise(  x:vec3f )->f32
{
    let p = floor(x);
    let w = fract(x);
    
  
   let u = w*w*(3.0-2.0*w);
  
    


    let n = 111.0*p.x + 317.0*p.y + 157.0*p.z;
    
    let a = hash1(n+(  0.0+  0.0+  0.0));
    let b = hash1(n+(111.0+  0.0+  0.0));
   let c = hash1(n+(  0.0+317.0+  0.0));
    let d = hash1(n+(111.0+317.0+  0.0));
   let e = hash1(n+(  0.0+  0.0+157.0));
    let f = hash1(n+(111.0+  0.0+157.0));
    let g = hash1(n+(  0.0+317.0+157.0));
    let h = hash1(n+(111.0+317.0+157.0));

    let k0 =   a;
    let k1 =   b - a;
    let k2 =   c - a;
    let k3 =   e - a;
    let k4 =   a - b - c + d;
    let k5 =   a - c - e + g;
    let k6 =   a - b - e + f;
    let k7 = - a + b + c - d + e - f - g + h;

    return -1.0+2.0*(k0 + k1*u.x + k2*u.y + k3*u.z + k4*u.x*u.y + k5*u.y*u.z + k6*u.z*u.x + k7*u.x*u.y*u.z);
}
const m3 = mat3x3f(0.00,  0.80,  0.60,
                      -0.80,  0.36, -0.48,
                      -0.60, -0.48,  0.64);

                      
fn fbm_4(  xIn:vec3f )->f32
{
var x =xIn;
    let f = 2.0;
   let s = 0.5;
   var a = 0.0;
    var b = 0.5;
    for( var i=0; i<4; i++ )
    {
       let n = noise(x);
        a += b*n;
        b *= s;
       x = f*m3*x;
    }
 return a;
}
fn fbm_2(xIn:vec3f )->f32
{
var x =xIn;
    let f = 2.0;
    let s = 0.5;
    var a = 0.0;
    var b = 0.5;
    for( var i=0; i<2; i++ )
    {
        let n = noise(x);
        a += b*n;
        b *= s;
        x = f*m3*x;
    }
return a;
}
fn map(p:vec3f)->f32
{
var pFlat = p;

    let d1 = sdSphere(pFlat+vec3f(0.1,0.0,0),0.15+sin(uniforms.time)*0.01);
    let d2 = sdSphere(pFlat+vec3f(-0.1,0.03,0),0.15+cos(uniforms.time)*0.01);
    var d = opSmoothUnion(d1,d2,0.1);
     var noiseP =p*5.0;
    noiseP.z +=uniforms.time*0.04;
    let n =smoothstep(-0.2,1.0,fbm_4(noiseP*2.0+fbm_4(noiseP*2.0)*1.5))*0.01;
    d-=n;
    let skin = smoothstep(0.5,1.0,1.0-n*5.0);
    d+=skin*smoothstep(-1.0,1.0,fbm_2(noiseP*50.0)*fbm_2(noiseP*4.0))*0.002;


    return d;


}


fn rayMarch(ro:vec3f, rd:vec3f, start:f32, end:f32)->f32 {
 var depth = start;

  for (var i:i32 = 0; i < 100; i++) {
    let p = ro + depth * rd;
    
    let d =map(p);
    
    depth += d;
    if (d < 0.001 || depth > end)
    { 
    break;
    }
  }

  return depth;
}
fn calcNormal(p:vec3f)->vec3f {
    let  e = vec2f(1.0, -1.0) * 0.0005; // epsilon

    return normalize(
      e.xyy * map(p + e.xyy) +
      e.yyx * map(p + e.yyx) +
      e.yxy * map(p + e.yxy) +
      e.xxx * map(p + e.xxx));
}
@vertex
fn mainVertex( ${this.getShaderAttributes()} ) -> VertexOutput
{
     var output : VertexOutput;
      
    output.position =camera.viewProjectionMatrix*model.modelMatrix* vec4( aPos,1.0);
output.worldPos = (model.modelMatrix* vec4( aPos,1.0)).xyz;
    return output;
}


@fragment






fn mainFragment(${this.getFragmentInput()}) -> @location(0) vec4f
{
    let ro =camera.worldPosition.xyz;
    let rd = normalize(worldPos-ro);
   let depth = rayMarch(ro,rd,0.1,1.0);
   if (depth>1.0){discard;};
   
  let  p = ro + rd * depth;
   let N = calcNormal(p);
   
     return vec4(N,1.0) ;
}
///////////////////////////////////////////////////////////
        `
    }






}
