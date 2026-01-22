import Timer from "./Timer.ts";
import TextureHandler from "./TextureHandler.ts";
import ColorAttachment from "./textures/ColorAttachment.ts";
import UniformGroup from "./material/UniformGroup.ts";
import Model from "./model/Model.ts";
import { Vector2 } from "@math.gl/core";
import TimeStampQuery from "./TimeStampQuery.ts";
import Texture from "./textures/Texture.ts";
import MipMapQueue from "./textures/MipMapQueue.ts";
import UI from "./UI/UI.ts";
import { TextureFormat } from "./WebGPUConstants.ts";


export default class Renderer {

    useTimeStampQuery: boolean = true;


    static instance: Renderer;
    public pixelRatio: number = 1;
    public ratio: number = 1;
    public width: number = 1;
    public height: number = 1;

    public htmlWidth: number = 1;
    public htmlHeight: number = 1;

    public inverseSizePixelRatio = new Vector2()
    canvas!: HTMLCanvasElement;
    public device!: GPUDevice;
    presentationFormat!: GPUTextureFormat;
    commandEncoder!: GPUCommandEncoder;
    textureHandler!: TextureHandler;
    models: Array<Model> = [];
    modelByLabel: { [label: string]: Model } = {};

    timeStamps!: TimeStampQuery;
    private context!: GPUCanvasContext;
    private canvasTextureView!: GPUTexture;
    private canvasColorAttachment!: ColorAttachment;
    private uniformGroups: Array<UniformGroup> = [];
    mipmapQueue!: MipMapQueue;

    hasFloat32Filterable = false;
    updateBufferCount = 0;
    constructor() {

    }

    async setup(canvas: HTMLCanvasElement) {
        this.canvas = canvas;

        this.pixelRatio = window.devicePixelRatio;
        this.textureHandler = new TextureHandler();
        Renderer.instance = this;

        const adapter = await navigator.gpu.requestAdapter({ featureLevel: 'compatibility', powerPreference: "high-performance" });

        if (adapter) {

            for (let a of adapter.features.keys()) {
                console.log(a)
            }
            const requiredFeatures: Array<GPUFeatureName> = []
            if (adapter.features.has("float32-filterable")) {

                this.hasFloat32Filterable = true;
                requiredFeatures.push("float32-filterable")
            }


            if (this.useTimeStampQuery) {
                requiredFeatures.push("timestamp-query");
            }
            //  console.log(requiredFeatures)
            const hdrMediaQuery = window.matchMedia('(dynamic-range: high)');
            console.log("Display supports HDR:", hdrMediaQuery.matches);
            const supportsDisplayP3 = window.matchMedia("(color-gamut: p3)").matches;
            console.log("Display supports P3 gamut:", supportsDisplayP3);
            let colSpace: PredefinedColorSpace = "srgb"
            if (supportsDisplayP3) {
                colSpace = "display-p3";

            }

            this.device = await adapter.requestDevice({ requiredFeatures: requiredFeatures });


            this.context = this.canvas.getContext("webgpu") as GPUCanvasContext;
            this.presentationFormat = navigator.gpu.getPreferredCanvasFormat();
            //  this.presentationFormat = TextureFormat.RGBA16Float;//;
            this.context.configure({
                device: this.device,
                format: this.presentationFormat,
                colorSpace: colSpace,
                alphaMode: "premultiplied",
                // toneMapping: { mode: "extended" },
            });
            console.log(this.context.getConfiguration())

        }
        this.timeStamps = new TimeStampQuery(this)
        this.mipmapQueue = new MipMapQueue(this)
    }

    public startCommandEncoder(setCommands: () => void) {
        this.commandEncoder = this.device.createCommandEncoder();
        setCommands();
        this.device.queue.submit([this.commandEncoder.finish()]);
    }

    public update(setCommands: () => void) {

        Timer.update();
        this.updateBufferCount = 0
        this.canvasTextureView = this.context.getCurrentTexture();
        this.canvasColorAttachment.setTarget(this.canvasTextureView.createView())
        this.updateSize();
        this.updateModels();
        this.updateUniformGroups()






        this.commandEncoder = this.device.createCommandEncoder();
        this.mipmapQueue.processQue();
        setCommands();
        this.timeStamps.getData();
        this.device.queue.submit([this.commandEncoder.finish()]);


        this.timeStamps.readback()


    }

    addUniformGroup(uniformGroup: UniformGroup) {
        this.uniformGroups.push(uniformGroup)
    }

    public setCanvasColorAttachment(canvasColorAttachment: ColorAttachment) {
        this.canvasColorAttachment = canvasColorAttachment
    }

    addModel(model: Model) {
        this.modelByLabel[model.label] = model;
        this.models.push(model);
    }

    getTexture(name: string) {
        return this.textureHandler.getTextureByName(name) as Texture;
    }

    private updateUniformGroups() {

        for (let u of this.uniformGroups) {
            u.update()
        }
    }

    private updateSize() {

        if (this.width != this.canvas.width || this.height != this.canvas.height) {
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.ratio = this.width / this.height;
            this.htmlWidth = this.canvas.width / this.pixelRatio;
            this.htmlHeight = this.canvas.height / this.pixelRatio;

            this.inverseSizePixelRatio.set(this.pixelRatio / this.width, this.pixelRatio / this.height)
            //   this.size.x =this.width;
            // this.size.y =this.height;

            this.textureHandler.resize(this.width, this.height)


        }

    }

    private updateModels() {
        for (let m of this.models) {
            m.update();
        }
    }

    removeUniformGroup(u: UniformGroup) {
        let i = this.uniformGroups.indexOf(u)
        if (i > -1) this.uniformGroups.splice(i, 1);
    }

    removeModel(m: Model) {
        let i = this.models.indexOf(m)
        if (i > -1) this.models.splice(i, 1);
    }

    setCursor(isPointer: boolean = false) {
        if (isPointer) {
            this.canvas.style.cursor = "pointer"
        }
        else {
            this.canvas.style.cursor = "auto"
        }
    }

    performanceUI() {
        UI.pushWindow("performance")
        UI.LText(Timer.fps + "", "fps:")
        UI.separator()
        this.timeStamps.onUI()
        UI.popWindow()

    }
}

