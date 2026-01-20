import Material from "../../../lib/material/Material.ts";
import { ShaderType } from "../../../lib/material/ShaderTypes.ts";
import UniformGroup from "../../../lib/material/UniformGroup.ts";
import DefaultTextures from "../../../lib/textures/DefaultTextures.ts";
import { AddressMode, TextureSampleType } from "../../../lib/WebGPUConstants.ts";
import DefaultUniformGroups from "../../../lib/material/DefaultUniformGroups.ts";
import Blend from "../../../lib/material/Blend.ts";
import { Textures } from "../../../data/Textures.ts";


export default class MeatMaterial extends Material {
    setup() {
        this.addAttribute("aPos", ShaderType.vec3);
        this.addAttribute("aUV0", ShaderType.vec2);
        this.addVertexOutput("worldPos", ShaderType.vec3)
        this.addVertexOutput("uv", ShaderType.vec2)
        this.addUniformGroup(DefaultUniformGroups.getCamera(this.renderer));
        this.addUniformGroup(DefaultUniformGroups.getModelTransform(this.renderer));

        let uniforms = new UniformGroup(this.renderer, "uniforms");
        this.addUniformGroup(uniforms, true);
        uniforms.addUniform("time", 1.0)
        uniforms.addUniform("pos1", 1.0)
        uniforms.addUniform("pos2", 1.0)
        uniforms.addUniform("pos3", 1.0)
        uniforms.addUniform("pos4", 1.0)
        uniforms.addTexture("textureS", this.renderer.getTexture(Textures.PATATO))
        uniforms.addSampler("mySampler", { addressMode: AddressMode.Repeat })
        this.blendModes = [Blend.preMultAlpha()]
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

    let d1 = sdSphere(pFlat+vec3f(0.1,0.0,0),0.14+sin(uniforms.time)*0.005);
    let d2 = sdSphere(pFlat+vec3f(-0.1,0.03,0),0.15+cos(uniforms.time)*0.01);
    var d = opSmoothUnion(d1,d2,0.1);
     var noiseP =p*7.0;
    noiseP.z +=uniforms.time*0.09;
    let n =smoothstep(-0.2,1.0,fbm_4(noiseP*2.0+fbm_4(noiseP*2.0)*1.5))*0.015*uniforms.pos3;
    d-=n;
    let skin = smoothstep(0.5,1.0,1.0-n*5.0);
    d+=skin*smoothstep(-1.0,1.0,fbm_2(noiseP*50.0)*fbm_2(noiseP*4.0))*0.003*uniforms.pos3;


    return d;


}
fn getColor( p:vec3f)->vec4f{

   var noiseP =p*7.0;
    noiseP.z +=uniforms.time*0.09;
  let n1=abs(fbm_2(noiseP*1.0));
 
  let n =smoothstep(-0.2,1.0,fbm_4(noiseP*2.0+fbm_4(noiseP*2.0)*1.5))*(1.0+uniforms.pos3*0.2)*uniforms.pos1;
  let base1 = mix(vec3f(0.2,0,0.1),vec3f(0.9,0.2,0.3),vec3(n));
  let lum = vec3f(0.299, 0.587, 0.114);
  let gray = vec3f(dot(lum, base1));

  var color = mix(base1, gray, vec3(pow(n1,2.0)));
 
 let s = smoothstep(0.2,0.4,n);
  let w =40.0-s*20.0*uniforms.pos1;


  color+=vec3(s)*vec3(0.7,0.7,0.4)*0.5;
  return vec4(color,w);
}


fn rayMarch(ro:vec3f, rd:vec3f, start:f32, end:f32)->f32 {
 var depth = start;

  for (var i:i32 = 0; i < 50; i++) {
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

fn calcSoftshadow( ro:vec3f,  rd:vec3f, mint:f32, tmax:f32 )->f32
{
  var res = 1.0;
    var t = mint;
   var ph = 1e10; // big, such that y = 0 on the first iteration
    
    for( var i=0; i<6; i++ )
    {
        let h = map( ro + rd*t );

      
           let y = h*h/(2.0*ph);
           let d = sqrt(h*h-y*y);
            res = min( res, 10.0*d/max(0.0,t-y) );
            ph = h;
       
        
        t += h;
        
        if( res<0.001 || t>tmax ) {break;};
        
    }
    res = clamp( res, 0.0, 1.0 );
    return res*res*(3.0-2.0*res);
}



@vertex
fn mainVertex( ${this.getShaderAttributes()} ) -> VertexOutput
{
     var output : VertexOutput;
      
    output.position =camera.viewProjectionMatrix*model.modelMatrix* vec4( aPos,1.0);
output.worldPos = (model.modelMatrix* vec4( aPos,1.0)).xyz;
output.uv=aUV0*vec2(2.0,3.0)+vec2(0.7,0.2);
    return output;
}


@fragment






fn mainFragment(${this.getFragmentInput()}) -> @location(0) vec4f
{
    let ro =camera.worldPosition.xyz;
    let rd = normalize(worldPos-ro);
   let depth = rayMarch(ro,rd,0.1,1.0);
   if (depth>1.0){discard ;};
   
  let  p = ro + rd * depth;
   let N = calcNormal(p);
   let color = getColor(p);
   let albedo =color.xyz ;
   let lightpos =vec3(0.2,0.3,0.3);
    let L = normalize(lightpos - p);
    
    let shadow =calcSoftshadow(p,L, 0.01, 1.0);
    let irr =vec3(max(0.0,dot(N,L))*2.0)*shadow+vec3(0.1,0.1,0.2)*1.5;
    var col =irr*albedo;
    
    let  refl = reflect(rd,N);            
    let fre = clamp(1.0+dot(N,rd),0.0,1.0);
    let spe = (color.w/15.0)*pow( clamp(dot(refl,L),0.0, 1.0), color.w )*2.0*(0.5+0.5*pow(fre,42.0))*uniforms.pos2;
    col += spe*shadow;
   
 col +=vec3(pow(1.0+dot(rd,N),2.0))*vec3(0.2,0.1,0.1)*0.3;
    let colt =textureSample(textureS, mySampler,  uv).xyz;   
   col = mix(colt.xyz,col,uniforms.pos4);
   let a =1.0;// (uniforms.pos1-0.5)*2.0;

     return vec4( col,a) ;
}
///////////////////////////////////////////////////////////
        `
    }






}
