import RenderPass from "../../lib/RenderPass.ts";
import Renderer from "../../lib/Renderer.ts";
import RenderTexture from "../../lib/textures/RenderTexture.ts";
import {Textures} from "../../data/Textures.ts";
import {TextureFormat} from "../../lib/WebGPUConstants.ts";
import ColorAttachment from "../../lib/textures/ColorAttachment.ts";
import LightMaterial from "./LightMaterial.ts";
import Blit from "../../lib/blit/Blit.ts";
import Camera from "../../lib/Camera.ts";
import DirectionalLight from "../lights/DirectionalLight.ts";


export default class LightRenderPass extends RenderPass {
    private colorTarget: RenderTexture;
    private colorAttachment: ColorAttachment;
    private lightMaterial: LightMaterial;
    private blit: Blit;

    constructor(renderer: Renderer, camera: Camera, dirLight: DirectionalLight) {
        super(renderer, "lightRenderPass");
        this.colorTarget = new RenderTexture(renderer, Textures.LIGHT, {
            format: TextureFormat.RGBA16Float,
            sampleCount: this.sampleCount,
            scaleToCanvas: true,

            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
        });
        this.colorAttachment = new ColorAttachment(this.colorTarget);
        this.colorAttachments = [this.colorAttachment]

        this.lightMaterial = new LightMaterial(renderer, "LightMaterial")
        this.lightMaterial.setUniform("shadowMatrix", dirLight.shadowCamera.viewProjection)
        this.lightMaterial.setUniform("shadowCameraPosition", [dirLight.shadowCamera.cameraWorld.x, dirLight.shadowCamera.cameraWorld.y, dirLight.shadowCamera.cameraWorld.z, 0])

        this.lightMaterial.setUniform("lightDir", dirLight.lightDir);
        this.lightMaterial.setUniform("lightColor", dirLight.lightColor);


        this.lightMaterial.uniformGroups[0] = camera;

        this.blit = new Blit(renderer, "blitLight", this.lightMaterial)

    }

    update(needsAOInt: boolean, needsShadowInt: boolean) {
        if (needsAOInt) {
            this.lightMaterial.setUniform("needsAO", 1)
        } else {
            this.lightMaterial.setUniform("needsAO", 0)
        }
        if (needsShadowInt) {
            this.lightMaterial.setUniform("needsShadow", 1)
        } else {
            this.lightMaterial.setUniform("needsShadow", 0)
        }
    }

    draw() {

        this.blit.draw(this)


    }


}
