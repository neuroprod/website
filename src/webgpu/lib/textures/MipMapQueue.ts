import Texture from "./Texture";
import Renderer from "../Renderer";

import { TextureFormat } from "../WebGPUConstants";



export default class MipMapQueue {

    private textures: Array<Texture> = [];

    private renderer: Renderer;
    sampler: GPUSampler;
    pipeline: GPUComputePipeline;

    constructor(renderer: Renderer) {
        this.renderer = renderer;


        this.sampler = this.renderer.device.createSampler({
            minFilter: "linear",
            magFilter: "linear",
        });

        this.pipeline = this.renderer.device.createComputePipeline({
            layout: "auto",
            compute: {
                module: this.renderer.device.createShaderModule({ code: this.getShader() }),
                entryPoint: "main",
            },
        });

    }
    getShader() {

        return /* wgsl */ `
        @group(0) @binding(0) var srcTex: texture_2d<f32>;
        @group(0) @binding(1) var srcSampler: sampler;
        @group(0) @binding(2) var dstTex: texture_storage_2d<rgba8unorm, write>;

        @compute @workgroup_size(8, 8)
        fn main(@builtin(global_invocation_id) gid : vec3<u32>) {
            let size = textureDimensions(dstTex).xy;
            if (gid.x >= size.x || gid.y >= size.y) {
                return;
            }

            let uv0 = (vec2<f32>(gid.xy) * 2.0 + vec2<f32>(0.5, 0.5)) / vec2<f32>(size * 2u);
            let uv1 = uv0 + vec2<f32>(1.0 / f32(size.x * 2u), 0.0);
            let uv2 = uv0 + vec2<f32>(0.0, 1.0 / f32(size.y * 2u));
            let uv3 = uv0 + vec2<f32>(1.0 / f32(size.x * 2u), 1.0 / f32(size.y * 2u));

            // Average 4 texels from higher mip
            let color = (textureSampleLevel(srcTex, srcSampler, uv0, 0.0) +
                textureSampleLevel(srcTex, srcSampler, uv1, 0.0) +
                textureSampleLevel(srcTex, srcSampler, uv2, 0.0) +
                textureSampleLevel(srcTex, srcSampler, uv3, 0.0)) * 0.25;

            textureStore(dstTex, vec2<i32>(gid.xy), color);
        }
        `

    }
    addTexture(texture: Texture) {
        this.textures.push(texture);

    }


    processQue() {
        if (this.textures.length == 0) return;




        const encoder = this.renderer.device.createCommandEncoder();
        //max 20??? 
        for (let i = 0; i < 20; i++) {
            this.processTexture(encoder);
        }
        this.renderer.device.queue.submit([encoder.finish()]);
    }

    processTexture(encoder: GPUCommandEncoder) {

        if (this.textures.length == 0) return;
        let texture = this.textures.pop() as Texture
        let options = texture.options
        let width = options.width;
        let height = options.height;

        for (let i = 0; i < options.mipLevelCount - 1; i++) {
            width = Math.max(1, Math.floor(width / 2));
            height = Math.max(1, Math.floor(height / 2));

            const bindGroup = this.renderer.device.createBindGroup({
                layout: this.pipeline.getBindGroupLayout(0),
                entries: [
                    { binding: 0, resource: texture.textureGPU.createView({ baseMipLevel: i, mipLevelCount: 1 }) },
                    { binding: 1, resource: this.sampler },
                    {
                        binding: 2, resource: texture.textureGPU.createView({
                            baseMipLevel: i + 1,
                            mipLevelCount: 1,
                        })
                    },
                ],
            });

            const pass = encoder.beginComputePass();
            pass.setPipeline(this.pipeline);
            pass.setBindGroup(0, bindGroup);
            pass.dispatchWorkgroups(
                Math.ceil(width / 8),
                Math.ceil(height / 8)
            );
            pass.end();
        }


    }
}



/*  async  generateMipmaps() {
   const sampler = this.renderer.device.createSampler({
     minFilter: "linear",
     magFilter: "linear",
   });
 
   const pipeline = this.renderer.device.createComputePipeline({
     layout: "auto",
     compute: {
       module: this.renderer.device.createShaderModule({ code: wgslCode }), // from above
       entryPoint: "main",
     },
   });
 
   const encoder = this.renderer.device.createCommandEncoder();
   let width = this.options.width;
   let height = this.options.height;
 
   for (let i = 0; i < this.options.mipLevelCount - 1; i++) {
     width = Math.max(1, Math.floor(width / 2));
     height = Math.max(1, Math.floor(height / 2));
 
     const bindGroup = this.renderer.device.createBindGroup({
       layout: pipeline.getBindGroupLayout(0),
       entries: [
         { binding: 0, resource: this.textureGPU.createView({ baseMipLevel: i, mipLevelCount: 1 }) },
         { binding: 1, resource: sampler },
         { binding: 2, resource: this.textureGPU.createView({
             baseMipLevel: i + 1,
             mipLevelCount: 1,
           }) },
       ],
     });
 
     const pass = encoder.beginComputePass();
     pass.setPipeline(pipeline);
     pass.setBindGroup(0, bindGroup);
     pass.dispatchWorkgroups(
       Math.ceil(width / 8),
       Math.ceil(height / 8)
     );
     pass.end();
   }
 
   this.renderer.device.queue.submit([encoder.finish()]);
 }*/

