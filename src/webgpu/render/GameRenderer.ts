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
import AsciiPass from "./ascii/AsciiPass.ts";
import ColorV from "../lib/ColorV.ts";
import DofPrepPass from "./dof/DofPrepPass.ts";
import DofHorPass from "./dof/DofHorPass.ts";
import DofVertPass from "./dof/DofVertPass.ts";
import FxaaRenderPass from "./fxaa/FxaaRenderPass.ts";





export type RenderOptions = {
    backgroundColor: ColorV,
    fogColor: ColorV,
    fogMin: number,
    fogMax: number,
    sunColor: ColorV,
    sunStrength: number,
    globalColor: ColorV,
    exposure: number,
    contrast: number,
    brightness: number,

    vinFalloff: number,
    vinAmount: number

    dofMin: number
    dofMax: number
    dofSize: number

    grain: number
    curveRed: number
    curveGreen: number
    curveBlue: number


}
export const RenderOptionsDefault: RenderOptions = {
    backgroundColor: new ColorV(0.3725, 0.5569, 0.6471, 0.0),
    fogColor: new ColorV(0.3725, 0.5569, 0.6471, 0.0),
    fogMin: 4,
    fogMax: 20,

    sunColor: new ColorV(1, 1, 1, 0.0),
    sunStrength: 6,
    globalColor: new ColorV(0.59, 0.67, 0.86, 0.00),

    dofMin: 0.9,
    dofMax: 1,
    dofSize: 3,

    exposure: 1,
    contrast: 1.3,
    brightness: -0.02,

    vinFalloff: 0.06,
    vinAmount: 0.85,

    grain: 0.5,

    curveRed: 0.76,
    curveGreen: 1,
    curveBlue: 1.25,

}

export const RenderOptionsNeutral: RenderOptions = {
    backgroundColor: new ColorV(0.3725, 0.5569, 0.6471, 0.0),
    fogColor: new ColorV(0.3725, 0.5569, 0.6471, 0.0),
    fogMin: 100,
    fogMax: 1000,

    sunColor: new ColorV(1, 1, 1, 0.0),
    sunStrength: 6,
    globalColor: new ColorV(0.59, 0.67, 0.86, 0.00),

    dofMin: 1,
    dofMax: 1,
    dofSize: 3,

    exposure: 1,
    contrast: 1,
    brightness: 0,

    vinFalloff: 0.06,
    vinAmount: 0.85,

    grain: 0.0,

    curveRed: 1,
    curveGreen: 1,
    curveBlue: 1,

}






export default class GameRenderer {
    fxaaPass: FxaaRenderPass;


    onUI() {



        UI.LText("fps:" + Timer.fps)
        let autoUpdate = UI.LBool("edit renderSettings", false)
        if (autoUpdate) {




            this.options.backgroundColor = UI.LColor("bgcolor", this.options.backgroundColor)
            this.options.fogColor = UI.LColor("fogcolor", this.options.fogColor)
            this.options.fogMin = UI.LFloat("fogMin", this.options.fogMin, "fogMin");
            this.options.fogMax = UI.LFloat("fogMax", this.options.fogMax, "fogMax");

            this.options.sunColor = UI.LColor("suncolor", this.options.sunColor)
            this.options.sunStrength = UI.LFloat("sunStrength", this.options.sunStrength, "sunStrength");
            this.options.globalColor = UI.LColor("globalColor", this.options.globalColor)





            this.options.dofMin = UI.LFloat("dofMin", this.options.dofMin, "dofMin");
            this.options.dofMax = UI.LFloat("dofMax", this.options.dofMax, "dofMax");
            this.options.dofSize = UI.LFloat("dofSize", this.options.dofSize, "dofSize");

            this.options.grain = UI.LFloat("grain", this.options.grain, "grain");
            this.options.exposure = UI.LFloat("exposure", this.options.exposure, "exposure");

            this.options.vinFalloff = UI.LFloat("vinFalloff", this.options.vinFalloff, "vinFalloff");
            this.options.vinAmount = UI.LFloat("vinAmount", this.options.vinAmount, "vinAmount");


            this.options.brightness = UI.LFloat("brightness", this.options.brightness, "brightness");
            this.options.contrast = UI.LFloat("contrast", this.options.contrast, "contrast");

            this.options.curveRed = UI.LFloat("curveRed", this.options.curveRed, "curveRed");
            this.options.curveGreen = UI.LFloat("curveGreen", this.options.curveGreen, "curveGreen");
            this.options.curveBlue = UI.LFloat("curveBlue", this.options.curveBlue, "curveBlue");
            this.setRenderSetting(this.options)
        }

        let value = UI.LSelect("Render Pass", this.passSelect)
        if (value != this.currentValue) {
            this.currentValue = value;

            this.debugTextureMaterial.setTexture("colorTexture", this.renderer.getTexture(this.currentValue.texture));
            this.debugTextureMaterial.setUniform("renderType", this.currentValue.type)

        }


        this.needsAO = UI.LBool(this, "needsAO")
        UI.LText("ao:" + this.needsAOInt)
        this.needsShadow = UI.LBool(this, "needsShadow")
        UI.LText("shadow:" + this.needsShadowInt)
        this.needsDof = UI.LBool(this, "needsDof")
        UI.LText("dof:" + this.needsDof)
        // this.dripPass.unUI();
    }



    setRenderSettingsNeutral(options: Partial<RenderOptions>) {
        let optionss = { ...RenderOptionsNeutral, ...options };
        this.setRenderSetting(optionss)
    }


    setRenderSetting(options: Partial<RenderOptions>) {


        this.options = { ...RenderOptionsDefault, ...options };

        this.backgroundPass.setColor(this.options.backgroundColor)
        this.lightPass.setFog(this.options.fogColor, this.options.fogMin, this.options.fogMax)

        this.lightPass.setLight(this.options.sunColor, this.options.sunStrength, this.options.globalColor)
        this.gradingPass.setSettings(this.options)
        this.dofPrepPass.setMinMax(this.options.dofMin, this.options.dofMax)
        this.dofHorPass.setSize(this.options.dofSize)
        this.dofVertPass.setSize(this.options.dofSize)



    }

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

    // private shadowBlurPass: ShadowBlurRenderPass;

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


    ascciPass: AsciiPass;


    needsDof = true
    dofPrepPass: DofPrepPass;
    dofHorPass: DofHorPass;
    dofVertPass: DofVertPass;
    options!: RenderOptions;

    constructor(renderer: Renderer, camera: Camera) {



        this.renderer = renderer;
        this.sunLight = new DirectionalLight(renderer, camera)

        this.ascciPass = new AsciiPass(renderer)

        this.shadowMapPass = new ShadowMapRenderPass(renderer, this.sunLight)
        // this.shadowBlurPass = new ShadowBlurRenderPass(renderer);
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

        this.dofPrepPass = new DofPrepPass(renderer)
        this.dofHorPass = new DofHorPass(renderer)
        this.dofVertPass = new DofVertPass(renderer)


        this.gradingPass = new GradingRenderPass(renderer)
        this.fxaaPass = new FxaaRenderPass(renderer)
        this.postLightModelRenderer = new ModelRenderer(this.renderer, "postLight", camera)
        this.postLightPass = new PostLightRenderPass(renderer, camera, this.sunLight, this.postLightModelRenderer)


        this.debugTextureMaterial = new DebugTextureMaterial(this.renderer, "debugTextureMaterial")
        this.blitFinal = new Blit(renderer, "blitFinal", this.debugTextureMaterial)
        // this.passSelect.push(new SelectItem(Textures.DRIP, {texture: Textures.DRIP, type: 0}));


        // this.passSelect.push(new SelectItem(Textures.DOF_PREP, { texture: Textures.DOF_PREP, type: 0 }));
        this.passSelect.push(new SelectItem(Textures.FXAA, { texture: Textures.FXAA, type: 0 }));
        this.passSelect.push(new SelectItem(Textures.GRADING, { texture: Textures.GRADING, type: 0 }));

        this.passSelect.push(new SelectItem(Textures.ASCII, { texture: Textures.ASCII, type: 0 }));
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

        this.setRenderSetting({})
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
        // this.ascciPass.update()
        this.backgroundPass.update()
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


    //doPasses
    draw() {
        if (LoadHandler.isLoading()) return;
        this.ascciPass.add();

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

        if (this.needsDof) {
            //dof pass
            this.dofPrepPass.add()
            this.dofHorPass.add()
            this.dofVertPass.add()
        }


        if (this._fxEnabled) {
            this.maskRenderPass.add()
            this.inGameFXPass.add()
        }


        this.gradingPass.add()

        if (this.postLightPass.modelRenderer.models.length) {
            this.postLightPass.modelRenderer.sortZ()
            this.postLightPass.add()
        }
        this.fxaaPass.add();
    }

    //put in canvas
    drawFinal(pass: CanvasRenderPass) {

        this.blitFinal.draw(pass);

    }

    addToMask(model: Array<Model>) {
        this.maskRenderPass.modelRenderer.setModels(model)
    }


}
