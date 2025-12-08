import { Textures } from "../../data/Textures";
import Blit from "../../lib/blit/Blit"
import Renderer from "../../lib/Renderer"
import RenderPass from "../../lib/RenderPass"
import ColorAttachment from "../../lib/textures/ColorAttachment";

import DofBlurMaterial from "./DofBlurMaterial";


export default class DofVertPass extends RenderPass {

    colorAttachment: ColorAttachment;
    blit: Blit;
    dofBlurMaterial: DofBlurMaterial

    constructor(renderer: Renderer) {
        super(renderer, "DofPrepPass")

        this.colorAttachment = new ColorAttachment(renderer.getTexture(Textures.LIGHT));
        this.colorAttachments = [this.colorAttachment]
        this.dofBlurMaterial = new DofBlurMaterial(renderer, "dofBlur")
        this.dofBlurMaterial.horizontal = false;
        this.dofBlurMaterial.setTexture("inputTexture", renderer.getTexture(Textures.DOF_HORIZONTAL))
        this.blit = new Blit(renderer, "blitDOFBlur", this.dofBlurMaterial)

    }


    draw() {

        this.blit.draw(this)


    }


}