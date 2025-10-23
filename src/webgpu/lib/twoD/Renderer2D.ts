import Renderer from "../Renderer.ts";
import RenderPass from "../RenderPass.ts";
import MouseListener from "../MouseListener.ts";
import Object2D from "./Object2D.ts";
import Camera2D from "./Camera2D.ts";
import Camera from "../Camera.ts";

export default class Renderer2D {

    private renderer: Renderer;
    private mouseListener: MouseListener;
    public root = new Object2D()
    private camera2D
    constructor(renderer: Renderer, mouseListener: MouseListener) {
        this.renderer = renderer;
        this.mouseListener = mouseListener;
        this.camera2D = new Camera2D(renderer)

    }

    draw(pass: RenderPass) {


        pass.passEncoder.setBindGroup(0, this.camera2D.bindGroup);
        this.root.draw(pass);
    }

    setSize(width: number, height: number) {

        this.camera2D.setSize(width, height)
    }

    update() {

        this.root.update()

    }
}

