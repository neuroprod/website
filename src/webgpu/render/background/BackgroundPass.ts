import RenderPass from "../../lib/RenderPass.ts";
import Renderer from "../../lib/Renderer.ts";
import RenderTexture from "../../lib/textures/RenderTexture.ts";
import { Textures } from "../../data/Textures.ts";
import { LoadOp, TextureFormat } from "../../lib/WebGPUConstants.ts";
import ColorAttachment from "../../lib/textures/ColorAttachment.ts";

import Blit from "../../lib/blit/Blit.ts";

import Texture from "../../lib/textures/Texture.ts";
import BackgroundMaterial from "./BackgroundMaterial.ts";
import Model from "../../lib/model/Model.ts";
import Plane from "../../lib/mesh/geometry/Plane.ts";
import ModelRenderer from "../../lib/model/ModelRenderer.ts";
import GameModel from "../../Website/GameModel.ts";
import ColorV from "../../lib/ColorV.ts";


export default class BackgroundPass extends RenderPass {
    setColor(color: ColorV) {
        this.model.material.setUniform("color", color)
    }

    private colorAttachment: ColorAttachment;

    private blit: Blit;

    blackValue = 1;
    backgroundMaterial: BackgroundMaterial;
    model: Model;
    modelRenderer: ModelRenderer;

    constructor(renderer: Renderer) {
        super(renderer, "lightRenderPass");

        this.colorAttachment = new ColorAttachment(renderer.getTexture(Textures.LIGHT), { loadOp: LoadOp.Load });
        this.colorAttachments = [this.colorAttachment]

        this.backgroundMaterial = new BackgroundMaterial(renderer, "backgroundMaterial")


        this.blit = new Blit(renderer, "blitBackground", this.backgroundMaterial)
        this.model = new Model(renderer, "bg");
        this.model.mesh = new Plane(renderer, 160, 80, 1, 1, false)

        this.model.material = new BackgroundMaterial(renderer, "bgMaterial")
        this.modelRenderer = new ModelRenderer(renderer, "modelR", GameModel.mainCamera)
        this.modelRenderer.addModel(this.model)
    }
    setBaseTexture(t: Texture) {
        // this.gradingMaterial.setTexture("colorTexture", t)
    }

    update() {
        this.model.setPositionV(GameModel.gameCamera.cameraWorld)
        this.model.z -= 50

    }
    draw() {

        //this.blit.draw(this)
        this.modelRenderer.draw(this)

    }












}
