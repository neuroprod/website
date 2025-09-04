import Renderer from "../Renderer";

import { TextureDimension, TextureFormat } from "../WebGPUConstants";
import ObjectGPU from "../ObjectGPU.ts";


export type TextureOptions = {
  width: GPUIntegerCoordinate;
  height: GPUIntegerCoordinate;
  depthOrArrayLayers: GPUIntegerCoordinate;
  format: GPUTextureFormat;
  sampleCount: 1 | 4;
  mipLevelCount: GPUIntegerCoordinate
  usage: GPUTextureUsageFlags;
  dimension: GPUTextureDimension;
  hasMipMap: boolean;

}
export const TextureOptionsDefault: TextureOptions = {
  width: 1,
  height: 1,
  depthOrArrayLayers: 1,
  format: TextureFormat.RGBA8Unorm,
  usage: 16,
  sampleCount: 1,
  mipLevelCount: 1,
  dimension: TextureDimension.TwoD,
  hasMipMap: false
}

export default class Texture extends ObjectGPU {
  public textureGPU!: GPUTexture;
  public options: TextureOptions;
  public isDirty: boolean = true;
  private view!: GPUTextureView;

  constructor(renderer: Renderer, label: string = "", options: Partial<TextureOptions>) {
    super(renderer, label);

    this.options = { ...TextureOptionsDefault, ...options };


    this.renderer.textureHandler.addTexture(this);

  }

  public make() {
    if (!this.isDirty) return
    if (this.textureGPU) this.textureGPU.destroy();

    console.log(this.options.width, this.options.height, this.options.mipLevelCount)
    if (this.options.width === 1 && this.options.height == 1) this.options.mipLevelCount = 1
    this.textureGPU = this.device.createTexture({
      label: this.label,
      size: [this.options.width, this.options.height, this.options.depthOrArrayLayers],
      sampleCount: this.options.sampleCount,
      format: this.options.format,
      usage: this.options.usage,
      mipLevelCount: this.options.mipLevelCount,
      dimension: this.options.dimension,
      // viewformats:TextureV
    });

  }

  getView(descriptor: GPUTextureViewDescriptor = {}) {
    if (this.isDirty || this.view == undefined) {

      this.view = this.textureGPU.createView(descriptor)
    }

    return this.view;
  }

  writeTexture(f: any, width: number, height: number, bytesPerRow: number, depthOrArrayLayers = 1) {
    this.renderer.device.queue.writeTexture(
      { texture: this.textureGPU },
      f,
      { bytesPerRow: bytesPerRow, rowsPerImage: height },
      [width, height, depthOrArrayLayers]
    );
  }
  public destroy() {
    this.textureGPU.destroy();
    this.renderer.textureHandler.removeTexture(this);
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
}
