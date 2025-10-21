import RenderPass from "../../lib/RenderPass.ts";
import Renderer from "../../lib/Renderer.ts";
import RenderTexture from "../../lib/textures/RenderTexture.ts";
import { Textures } from "../../data/Textures.ts";
import { LoadOp, TextureFormat } from "../../lib/WebGPUConstants.ts";
import ColorAttachment from "../../lib/textures/ColorAttachment.ts";

import Blit from "../../lib/blit/Blit.ts";

import Texture from "../../lib/textures/Texture.ts";
import BackgroundMaterial from "./BackgroundMaterial.ts";


export default class BackgroundPass extends RenderPass {

    private colorAttachment: ColorAttachment;

    private blit: Blit;

    blackValue = 1;
    backgroundMaterial: BackgroundMaterial;

    constructor(renderer: Renderer) {
        super(renderer, "lightRenderPass");

        this.colorAttachment = new ColorAttachment(renderer.getTexture(Textures.LIGHT), { loadOp: LoadOp.Load });
        this.colorAttachments = [this.colorAttachment]

        this.backgroundMaterial = new BackgroundMaterial(renderer, "backgroundMaterial")


        this.blit = new Blit(renderer, "blitBackground", this.backgroundMaterial)

    }
    setBaseTexture(t: Texture) {
        // this.gradingMaterial.setTexture("colorTexture", t)
    }

    update() {

    }
    draw() {

        this.blit.draw(this)


    }












}
