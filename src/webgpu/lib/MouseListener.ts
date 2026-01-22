import { Vector2 } from "@math.gl/core";
import Renderer from "./Renderer.ts";


export default class MouseListener {
    public mouseNorm: Vector2 = new Vector2();
    public mousePos: Vector2;
    public mousePosDown: Vector2;
    public isDown: boolean = false;
    public isDownThisFrame: boolean = false;
    public isUpThisFrame: boolean = false;
    public isDirty: number = 1;
    public wheelDelta: number = 0;
    public altKey: boolean = false;
    public ctrlKey: boolean = false;
    public shiftKey: boolean = false;
    public metaKey: boolean = false;
    private element: Document;
    private preventDefault = false;
    private renderer: Renderer;
    pressure: number = 0;
    private pointerID: number = -1;
    downTime: number = 0;
    constructor(renderer: Renderer) {
        this.renderer = renderer;
        this.element = document;

        this.element.addEventListener(
            "pointermove",
            this.mouseMoveListener.bind(this),
            false
        );

        this.element.addEventListener(
            "pointerdown",
            this.mouseDownListener.bind(this),
            false
        );

        this.element.addEventListener(
            "pointerup",
            this.mouseUpListener.bind(this),
            false
        );

        this.element.addEventListener(
            "pointercancel",
            this.cancelListener.bind(this),
            false
        );
        this.element.addEventListener(
            "pointerout",
            this.endListener.bind(this),
            false
        );


        this.element.addEventListener("wheel", (event) => {
            this.wheelDelta = event.deltaY;
        });
        document.addEventListener("pointerleave", (event) => {

            //if (event.clientY <= 0 || event.clientX <= 0 || (event.clientX >= window.innerWidth || event.clientY >= window.innerHeight)) {


            //this.mousePos.set(-1, -1);

            // }
        });
        this.mousePos = new Vector2(-1, -1);
        this.mousePosDown = new Vector2(-1, -1);
    }

    getMouseNorm() {

        this.mouseNorm.from(this.mousePos)
        this.mouseNorm.scale([2 / this.renderer.width, -2 / this.renderer.height]);
        this.mouseNorm.subtract([1, -1]);

        return this.mouseNorm;
    }



    mouseDownListener(e: PointerEvent) {

        if (e.button == 0) {

            if (this.pointerID != -1) {
                if (e.pointerId != this.pointerID) return;
            }
            this.pointerID = e.pointerId
            this.setMousePosition(e);
            if (this.preventDefault) {
                e.preventDefault();
            }
            this.altKey = e.altKey;
            this.ctrlKey = e.ctrlKey;
            this.shiftKey = e.shiftKey;
            this.metaKey = e.metaKey;

            this.downTime = e.timeStamp

            this.mouseDown();
        }
    }

    mouseUpListener(e: PointerEvent) {

        if (e.button == 0) {
            if (e.pointerId != this.pointerID) return;
            this.pointerID = -1;
            this.setMousePosition(e)
            if (this.preventDefault) {
                e.preventDefault();
            }
            this.altKey = e.altKey;
            this.ctrlKey = e.ctrlKey;
            this.shiftKey = e.shiftKey;
            this.metaKey = e.metaKey;
            this.downTime = e.timeStamp - this.downTime


            this.mouseUp();
        }
    }


    mouseMoveListener(e: PointerEvent) {
        // if (e.pointerId != this.pointerID) return;
        this.setMousePosition(e);
        if (this.preventDefault) {
            e.preventDefault();
        }
    }

    cancelListener(e: PointerEvent) {
        if (e.pointerId != this.pointerID) return;
        this.pointerID = -1;
        this.isDown = false;
        this.isDownThisFrame = false;
        this.isDirty = 1;
    }

    endListener(e: PointerEvent) {
        if (e.pointerId != this.pointerID) return;
        this.pointerID = -1;
        this.isDown = false;
        this.isDownThisFrame = false;
        this.isDirty = 1;
    }

    mouseDown() {
        this.isDown = true;
        this.isDownThisFrame = true;
        this.mousePosDown = this.mousePos.clone();
        this.isDirty = 1;
    }

    mouseUp() {
        this.isDown = false;
        this.isUpThisFrame = true;
        this.isDirty = 1;
    }

    setMousePosition(e: any) {
        this.pressure = e.pressure;
        this.mousePos.x = e.offsetX * window.devicePixelRatio;
        this.mousePos.y = e.offsetY * window.devicePixelRatio;
        this.isDirty = 1;
    }

    reset() {
        this.altKey = false;
        this.ctrlKey = false;
        this.shiftKey = false;
        this.metaKey = false;
        this.isUpThisFrame = false;
        this.isDownThisFrame = false;
        this.wheelDelta = 0;
        this.isDirty--;
    }
}
