import Renderer from "../lib/Renderer.ts";
import Camera from "../lib/Camera.ts";
import CanvasRenderPass from "../CanvasRenderPass.ts";
import GBufferRenderPass from "./GBuffer/GBufferRenderPass.ts";
import DebugTextureMaterial from "./debug/DebugTextureMaterial.ts";
import Blit from "../lib/blit/Blit.ts";
import { Textures } from "../data/Textures.ts";
import SelectItem from "../lib/UI/math/SelectItem.ts";
import UI from "../lib/UI/UI.ts";
import LightRenderPass from "./light/LightRenderPass.ts";
import ShadowMapRenderPass from "./shadow/ShadowMapRenderPass.ts";
import DirectionalLight from "./lights/DirectionalLight.ts";
import ShadowBlurRenderPass from "./shadow/ShadowBlurRenderPass.ts";
//import PreProcessDepth from "./ao/PreProcessDepth.ts";
import DeNoisePass from "./GTAO/DeNoisePass.ts";
import ShadowRenderPass from "./shadow/ShadowRenderPass.ts";
import AOPreprocessDepth from "./GTAO/AOPreprocessDepth.ts";
import GTAO from "./GTAO/GTAO.ts";
import LoadHandler from "../data/LoadHandler.ts";
import ModelRenderer from "../lib/model/ModelRenderer.ts";
import Model from "../lib/model/Model.ts";
import SceneObject3D from "../data/SceneObject3D.ts";
import TransRenderPass from "./TransparentMaterials/TransRenderPass.ts";
import GradingRenderPass from "./grading/GradingPass.ts";
import InGameFXPass from "./InGameFX/InGameFXPass.ts";
import MaskRenderPass from "./InGameFX/MaskRenderPass.ts";
import gsap from "gsap";
import PostLightRenderPass from "./postLight/PostLightRenderPass.ts";
import Timer from "../lib/Timer.ts";
import BackgroundPass from "./background/BackgroundPass.ts";

export default class GameRenderer {
    public needsAO: boolean = true;
    public allModels: Array<Model> = []
    gBufferPass: GBufferRenderPass;
    shadowMapPass: ShadowMapRenderPass;
    postLightModelRenderer: ModelRenderer;
    private postLightPass: PostLightRenderPass;
    private needsAOInt: boolean = false;
    private needsShadowInt: boolean = false;
    private needsShadow: boolean = true;
    private renderer: Renderer;
    private debugTextureMaterial: DebugTextureMaterial;
    private blitFinal: Blit;
    private currentValue = { texture: "kka", type: 0 }
    private passSelect: Array<SelectItem> = []
    private lightPass: LightRenderPass;
    private sunLight: DirectionalLight;

    private shadowBlurPass: ShadowBlurRenderPass;

    private shadowPass: ShadowRenderPass;
    private AOPreDept!: AOPreprocessDepth;
    private ao!: GTAO;
    private aoDenoise!: DeNoisePass;


    private shadowDenoise!: DeNoisePass;
    private transparentModelRenderer: ModelRenderer;
    private transitionValue: number = 0;
    private transparentPass: TransRenderPass;
    private gradingPass: GradingRenderPass;
    private inGameFXPass: InGameFXPass;
    private maskRenderPass: MaskRenderPass;
    backgroundPass: BackgroundPass;

    constructor(renderer: Renderer, camera: Camera) {
        this.renderer = renderer;
        this.sunLight = new DirectionalLight(renderer, camera)
        this.shadowMapPass = new ShadowMapRenderPass(renderer, this.sunLight)
        this.shadowBlurPass = new ShadowBlurRenderPass(renderer);
        this.gBufferPass = new GBufferRenderPass(renderer, camera);
        // this.preProcessDepth = new PreProcessDepth(renderer);

        this.shadowPass = new ShadowRenderPass(renderer, camera, this.sunLight)
        if (renderer.hasFloat32Filterable) {

            this.AOPreDept = new AOPreprocessDepth(renderer)
            this.ao = new GTAO(renderer, camera)
            this.aoDenoise = new DeNoisePass(renderer, Textures.GTAO_DENOISE, Textures.GTAO)
            this.shadowDenoise = new DeNoisePass(renderer, Textures.SHADOW_DENOISE, Textures.SHADOW)

        }
        this.lightPass = new LightRenderPass(renderer, camera, this.sunLight)
        if (renderer.hasFloat32Filterable) {

            this.lightPass.lightMaterial.setTexture("shadow", renderer.getTexture(Textures.SHADOW_DENOISE))
            this.lightPass.lightMaterial.setTexture("aoTexture", renderer.getTexture(Textures.GTAO_DENOISE))
        } else {
            this.lightPass.lightMaterial.setTexture("shadow", renderer.getTexture(Textures.SHADOW))
        }

        this.backgroundPass = new BackgroundPass(this.renderer)
        this.transparentModelRenderer = new ModelRenderer(this.renderer, "transparent", camera)
        this.transparentPass = new TransRenderPass(renderer, camera, this.sunLight, this.transparentModelRenderer)
        this.maskRenderPass = new MaskRenderPass(renderer, camera)
        this.inGameFXPass = new InGameFXPass(renderer)

        this.gradingPass = new GradingRenderPass(renderer)

        this.postLightModelRenderer = new ModelRenderer(this.renderer, "postLight", camera)
        this.postLightPass = new PostLightRenderPass(renderer, camera, this.sunLight, this.postLightModelRenderer)


        this.debugTextureMaterial = new DebugTextureMaterial(this.renderer, "debugTextureMaterial")
        this.blitFinal = new Blit(renderer, "blitFinal", this.debugTextureMaterial)
        // this.passSelect.push(new SelectItem(Textures.DRIP, {texture: Textures.DRIP, type: 0}));



        this.passSelect.push(new SelectItem(Textures.GRADING, { texture: Textures.GRADING, type: 0 }));
        if (this.renderer.hasFloat32Filterable) {
            this.passSelect.push(new SelectItem(Textures.GTAO, { texture: Textures.GTAO, type: 1 }));
            this.passSelect.push(new SelectItem(Textures.GTAO_DENOISE, { texture: Textures.GTAO_DENOISE, type: 1 }));
        }
        this.passSelect.push(new SelectItem(Textures.MASK, { texture: Textures.MASK, type: 0 }));
        this.passSelect.push(new SelectItem(Textures.LIGHT, { texture: Textures.LIGHT, type: 0 }));
        this.passSelect.push(new SelectItem("video/test.mp4", { texture: "video/test.mp4", type: 0 }));
        this.passSelect.push(new SelectItem(Textures.SHADOW, { texture: Textures.SHADOW, type: 0 }));
        // this.passSelect.push(new SelectItem(Textures.SHADOW_DEPTH_BLUR, {texture: Textures.SHADOW_DEPTH_BLUR, type: 0}));
        this.passSelect.push(new SelectItem(Textures.SHADOW_DEPTH, { texture: Textures.SHADOW_DEPTH, type: 2 }));

        this.passSelect.push(new SelectItem(Textures.DEPTH_BLUR, { texture: Textures.DEPTH_BLUR, type: 1 }));
        // this.passSelect.push(new SelectItem(Textures.GTAO, {texture: Textures.GTAO, type: 1}));
        // this.passSelect.push(new SelectItem( Textures.GTAO_DENOISE, {texture: Textures.GTAO_DENOISE, type: 1}));

        //this.passSelect.push(new SelectItem(Textures.DEPTH_BLUR_MIP4, {texture: Textures.DEPTH_BLUR_MIP4, type: 1}));
        //this.passSelect.push(new SelectItem(Textures.DEPTH_BLUR_MIP3, {texture: Textures.DEPTH_BLUR_MIP3, type: 1}));
        //this.passSelect.push(new SelectItem(Textures.DEPTH_BLUR_MIP2, {texture: Textures.DEPTH_BLUR_MIP2, type: 1}));
        //this.passSelect.push(new SelectItem(Textures.DEPTH_BLUR_MIP1, {texture: Textures.DEPTH_BLUR_MIP1, type: 1}));
        //this.passSelect.push(new SelectItem(Textures.DEPTH_BLUR_MIP0, {texture: Textures.DEPTH_BLUR_MIP0, type: 1}));


        this.passSelect.push(new SelectItem(Textures.GCOLOR, { texture: Textures.GCOLOR, type: 0 }));
        this.passSelect.push(new SelectItem(Textures.GNORMAL, { texture: Textures.GNORMAL, type: 0 }));
        this.passSelect.push(new SelectItem(Textures.GDEPTH, { texture: Textures.GDEPTH, type: 0 }));


        this.currentValue = this.passSelect[0].value;
        this.debugTextureMaterial.setTexture("colorTexture", this.renderer.getTexture(this.currentValue.texture));
        this.debugTextureMaterial.setUniform("renderType", this.currentValue.type)


    }

    private _fxEnabled: boolean = false;

    get fxEnabled(): boolean {
        return this._fxEnabled;
    }

    set fxEnabled(value: boolean) {
        if (this._fxEnabled == value) return;
        this._fxEnabled = value;
        if (this._fxEnabled) {
            this.gradingPass.setBaseTexture(this.renderer.getTexture(Textures.INGAMEFX))
        } else {
            this.gradingPass.setBaseTexture(this.renderer.getTexture(Textures.LIGHT))
        }

    }

    private _distortValue = 0;

    // private dripPass:DripPass

    get distortValue(): number {
        return this._distortValue;
    }

    set distortValue(value: number) {
        if (value == 0) {
            this.fxEnabled = false
        } else {
            this.fxEnabled = true;
        }
        this._distortValue = value;
        this.inGameFXPass.distortValue = this._distortValue
    }

    public setLevelType(type: string) {
        if (type == "platform") {
            this.sunLight.shadowCamera.setOrtho(4, -4, 4, -2);

        }
        if (type == "website") {
            this.sunLight.shadowCamera.setOrtho(1, -1, 1, -1);
        }
    }

    public clearAllModels() {

        this.gBufferPass.modelRenderer.setModels([])
        this.shadowMapPass.modelRenderer.setModels([])
        this.transparentModelRenderer.setModels([])
        this.maskRenderPass.modelRenderer.setModels([])
        this.postLightModelRenderer.setModels([])
        this.allModels = []


    }

    public setModels(models: Array<Model>) {
        this.clearAllModels()
        for (let m of models) {
            this.addModel(m)
        }

    }

    public addModel(m: Model) {

        if (m.parent) {
            if ((m.parent as SceneObject3D).postLight) {
                this.postLightModelRenderer.addModel(m)

                this.allModels.push(m)
                return;
            }
        }
        if (m.transparent) {
            this.transparentModelRenderer.addModel(m)
        } else {

            this.gBufferPass.modelRenderer.addModel(m)

        }

        if (m.parent) {
            if ((m.parent as SceneObject3D).dropShadow) {

                this.shadowMapPass.modelRenderer.addModel(m)
            }
        }

        this.allModels.push(m)


    }

    public removeModel(m: Model) {
        this.gBufferPass.modelRenderer.removeModel(m)
        this.shadowMapPass.modelRenderer.removeModel(m)
        this.transparentModelRenderer.removeModel(m)
        this.postLightModelRenderer.removeModel(m)

        const index = this.allModels.indexOf(m, 0);
        if (index > -1) {
            this.allModels.splice(index, 1);
        }

    }

    public updateModel(m: Model) {
        this.removeModel(m)
        this.addModel(m)

    }


    update() {

        if (!this.needsAO) {
            this.needsAOInt = false

        } else {
            this.needsAOInt = true
        }
        if (!this.renderer.hasFloat32Filterable) {
            this.needsAOInt = false;
        }
        if (this.gBufferPass.modelRenderer.models.length == 0) {
            this.needsAOInt = false// do i want ao in trans pass?
        }
        if (this.shadowMapPass.modelRenderer.models.length == 0) {
            this.needsShadowInt = false;
        } else {
            this.needsShadowInt = true;
        }
        if (!this.needsShadow) {
            this.needsShadowInt = false;
        }


        this.sunLight.update();

        this.shadowMapPass.update()
        this.shadowPass.update();
        this.lightPass.update(this.needsAOInt, this.needsShadowInt);
        this.transparentPass.update();
        this.inGameFXPass.update()
        this.gradingPass.update();
        // this.dripPass.update();
        if (this.transitionValue != 0) {
            //
        }
    }

    onUI() {
        UI.LText("fps:" + Timer.fps)
        this.needsAO = UI.LBool(this, "needsAO")
        UI.LText("ao:" + this.needsAOInt)
        this.needsShadow = UI.LBool(this, "needsShadow")
        UI.LText("shadow:" + this.needsShadowInt)
        let value = UI.LSelect("Render Pass", this.passSelect)
        if (value != this.currentValue) {
            this.currentValue = value;

            this.debugTextureMaterial.setTexture("colorTexture", this.renderer.getTexture(this.currentValue.texture));
            this.debugTextureMaterial.setUniform("renderType", this.currentValue.type)

        }
        // this.dripPass.unUI();
    }

    //doPasses
    draw() {
        if (LoadHandler.isLoading()) return;


        if (this.needsShadowInt) this.shadowMapPass.add();


        this.gBufferPass.add();
        if (this.needsAOInt) {
            if (this.renderer.hasFloat32Filterable) {
                this.AOPreDept.add();
                this.ao.add()
                this.aoDenoise.add()
            }
        }



        if (this.needsShadowInt) this.shadowPass.add();

        if (this.renderer.hasFloat32Filterable) {
            if (this.needsShadowInt) this.shadowDenoise.add()
        }
        //   this.shadowBlurPass.add();

        this.lightPass.add();
        this.backgroundPass.add();
        this.transparentPass.add();
        if (this._fxEnabled) {
            this.maskRenderPass.add()
            this.inGameFXPass.add()
        }
        this.gradingPass.add()

        if (this.postLightPass.modelRenderer.models.length) {
            this.postLightPass.modelRenderer.sortZ()
            this.postLightPass.add()
        }

    }

    //put in canvas
    drawFinal(pass: CanvasRenderPass) {

        this.blitFinal.draw(pass);

    }

    addToMask(model: Array<Model>) {
        this.maskRenderPass.modelRenderer.setModels(model)
    }

    tweenToNonBlack(duration = 3) {
        gsap.killTweensOf(this.gradingPass)
        gsap.to(this.gradingPass, { blackValue: 1, duration: duration, ease: "power2.in", delay: 0.5 })

    }
    setBlack(value = 0) {
        gsap.killTweensOf(this.gradingPass)
        this.gradingPass.blackValue = value

    }
    tweenToBlack() {
        gsap.killTweensOf(this.gradingPass)
        gsap.to(this.gradingPass, { blackValue: 0, duration: 0.5 })

    }
}
