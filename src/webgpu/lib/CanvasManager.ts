import UI from "./UI/UI.ts";

export default class CanvasManager {
    canvas: HTMLCanvasElement;
    private resizeTimeOut!: ReturnType<typeof setTimeout>;
    public pixelRatio: number = 1;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.pixelRatio = window.devicePixelRatio;
        this.resize();
        window.addEventListener('resize', this.resize.bind(this));

    }

    resize() {
        //1920x1280

        /*this.canvas.style.width = Math.floor(1920) + "px";
        this.canvas.style.height = Math.floor(1280) + "px";
        this.canvas.width = Math.floor(1920);
        this.canvas.height = Math.floor(1280);*/
        this.canvas.style.width = Math.floor(window.innerWidth) + "px";
        this.canvas.style.height = Math.floor(window.innerHeight) + "px";
        this.canvas.width = Math.floor(window.innerWidth * this.pixelRatio);
        this.canvas.height = Math.floor(window.innerHeight * this.pixelRatio);

        UI.setSize(this.canvas.width, this.canvas.height)
    }
    //TODO: check no usage anymore for a delayed resize?
    delayedResize() {
        clearTimeout(this.resizeTimeOut);

        this.resizeTimeOut = setTimeout(() => {
            this.resize();
        }, 100);
    }
}
