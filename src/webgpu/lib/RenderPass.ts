import ObjectGPU from "./ObjectGPU";
import Renderer from "./Renderer";

import ColorAttachment from "./textures/ColorAttachment";
import DepthStencilAttachment from "./textures/DepthStencilAttachment";
import { TimeStampData } from "./TimeStampQuery";

export default class RenderPass extends ObjectGPU {

    public colorAttachments: Array<ColorAttachment> = [];
    public depthStencilAttachment!: DepthStencilAttachment;
    public passEncoder!: GPURenderPassEncoder;
    public sampleCount: 1 | 4 = 1;

    protected renderPassDescriptor!: GPURenderPassDescriptor;
    private isDirty: boolean = true;
    timeStampData!: TimeStampData;


    constructor(renderer: Renderer, label: string, useTimeStamp: boolean = false) {
        super(renderer, label);
        if (useTimeStamp) {

            this.timeStampData = renderer.timeStamps.add(label)

        }

    }

    public setDirty() {
        this.isDirty = true;
    }

    add() {
        this.updateDescriptor()

        this.passEncoder = this.renderer.commandEncoder.beginRenderPass(
            this.renderPassDescriptor
        );

        this.draw()

        this.passEncoder.end();

    }
    addToCommandEncoder(commandEncoder: GPUCommandEncoder) {

        this.updateDescriptor();
        this.passEncoder = commandEncoder.beginRenderPass(
            this.renderPassDescriptor
        );

        this.draw()

        this.passEncoder.end();
    }

    protected draw() {

    }


    private updateDescriptor() {
        let dirty = this.isDirty;

        //TODO: check if textures are updated when this pass wasn't in use
        if (this.depthStencilAttachment && this.depthStencilAttachment.isDirty()) {
            dirty = true;


        }
        for (let c of this.colorAttachments) {
            if (c.isDirty()) {
                dirty = true;

            }

        }
        if (!dirty) return;

        let attachments = []
        for (let c of this.colorAttachments) {
            attachments.push(c.getAttachment())
        }

        this.renderPassDescriptor = {
            label: this.label,
            colorAttachments: attachments,

        };


        if (this.depthStencilAttachment)
            this.renderPassDescriptor.depthStencilAttachment = this.depthStencilAttachment.getAttachment()

        if (this.timeStampData && this.timeStampData.timestampWrites) {

            this.renderPassDescriptor.timestampWrites = this.timeStampData.timestampWrites

        }

        this.isDirty = false;

    }


}
