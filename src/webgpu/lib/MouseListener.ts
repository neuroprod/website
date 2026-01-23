import { Vector2 } from "@math.gl/core";
import Renderer from "./Renderer.ts";
export interface TouchPointer {
    id: number;
    pos: Vector2;
    prevPos: Vector2;
    downTime: number;
    isPressed: boolean;
    pointerType: "mouse" | "touch" | "pen"; // Pointer Events API type
    pressure: number; // 0.0 to 1.0 (pressure sensitivity)
    isPrimary: boolean; // True if this is the primary pointer
}

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

    activePointers: Map<number, TouchPointer> = new Map();

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


        const pos = this.getPointerPosition(e);
        this.startPointer(e.pointerId, pos, e);
        if (this.preventDefault) {
            e.preventDefault();
        }
        if (e.button == 0 && e.isPrimary) {


            this.setMousePosition(e);

            this.altKey = e.altKey;
            this.ctrlKey = e.ctrlKey;
            this.shiftKey = e.shiftKey;
            this.metaKey = e.metaKey;

            this.downTime = e.timeStamp

            this.mouseDown();
        }
    }

    mouseUpListener(e: PointerEvent) {


        const pos = this.getPointerPosition(e);
        this.endPointer(e.pointerId, pos);

        if (this.preventDefault) {
            e.preventDefault();
        }
        if (e.button == 0 && e.isPrimary) {

            this.setMousePosition(e)

            this.altKey = e.altKey;
            this.ctrlKey = e.ctrlKey;
            this.shiftKey = e.shiftKey;
            this.metaKey = e.metaKey;
            this.downTime = e.timeStamp - this.downTime


            this.mouseUp();
        }
    }


    mouseMoveListener(e: PointerEvent) {

        const pos = this.getPointerPosition(e);
        this.movePointer(e.pointerId, pos, e);


        if (e.isPrimary) {
            this.setMousePosition(e);
        }

        if (this.preventDefault) {
            e.preventDefault();
        }
    }

    cancelListener(e: PointerEvent) {
        const pos = this.getPointerPosition(e);
        this.endPointer(e.pointerId, pos);
        if (e.isPrimary) {
            this.isDown = false;
            this.isDownThisFrame = false;
            this.isDirty = 1;
        }
    }

    endListener(e: PointerEvent) {
        const pos = this.getPointerPosition(e);
        this.endPointer(e.pointerId, pos);
        if (e.isPrimary) {

            this.isDown = false;
            this.isDownThisFrame = false;
            this.isDirty = 1;
        }
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
    //
    private getPointerPosition(e: PointerEvent): Vector2 {

        return new Vector2(
            e.offsetX * window.devicePixelRatio,
            e.offsetY * window.devicePixelRatio
        );
    }

    private startPointer(pointerId: number, pos: Vector2, event: PointerEvent) {
        const pointer: TouchPointer = {
            id: pointerId,
            pos: pos.clone(),
            prevPos: pos.clone(),
            downTime: Date.now(),
            isPressed: true,
            pointerType: event.pointerType as "mouse" | "touch" | "pen",
            pressure: event.pressure,
            isPrimary: event.isPrimary,
        };
        this.activePointers.set(pointerId, pointer);
    }

    /**
     * Update pointer position
     */
    private movePointer(pointerId: number, pos: Vector2, event: PointerEvent) {
        const pointer = this.activePointers.get(pointerId);
        if (pointer) {
            pointer.prevPos = pointer.pos.clone();
            pointer.pos = pos.clone();
            pointer.pressure = event.pressure;
            pointer.isPrimary = event.isPrimary;
        } else {

            const pointer: TouchPointer = {
                id: pointerId,
                pos: pos.clone(),
                prevPos: pos.clone(),
                downTime: Date.now(),
                isPressed: false,
                pointerType: event.pointerType as "mouse" | "touch" | "pen",
                pressure: event.pressure,
                isPrimary: event.isPrimary,
            };
            this.activePointers.set(pointerId, pointer);
        }
    }

    /**
     * End pointer tracking
     */
    private endPointer(pointerId: number, pos: Vector2) {
        const pointer = this.activePointers.get(pointerId);
        if (pointer) {
            pointer.isPressed = false;
            this.activePointers.delete(pointerId);
        }
    }
    getAllPointers(): TouchPointer[] {
        return Array.from(this.activePointers.values());
    }
}
