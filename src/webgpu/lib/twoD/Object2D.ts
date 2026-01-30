import { Matrix4, Quaternion, Vector2, Vector3 } from "@math.gl/core";
import RenderPass from "../RenderPass.ts";
import GameModel from "../../Website/GameModel.ts";
import { TouchPointer } from "../input/MultiTouchInput.ts";

export default class Object2D {
    public parent: Object2D | null = null;
    public children: Array<Object2D> = []
    public id: string = ""
    private _visible: boolean = true;
    protected _position = new Vector3(0, 0, 0);
    private _r = 0;
    private _rotation = new Quaternion(0, 0, 0, 1);
    private _scale = new Vector3(1, 1, 1);



    public alpha = 1

    private isDirty: boolean = true;
    private tempMatrix = new Matrix4()
    private _localMatrix: Matrix4 = new Matrix4()
    protected _worldMatrixInv: Matrix4 = new Matrix4()
    public mouseEnabled = true;
    multiTouch: boolean = false
    constructor() {
        this.id = "" + Math.random()
    }


    get sx() {
        return this._scale.x
    }

    set sx(value: number) {

        this._scale.x = value
        this.setDirty()
    }
    get sy() {
        return this._scale.y
    }

    set sy(value: number) {

        this._scale.y = value
        this.setDirty()
    }

    get visible(): boolean {
        return this._visible;
    }

    set visible(value: boolean) {
        this._visible = value;
        this.setDirty();
    }

    private _worldMatrix: Matrix4 = new Matrix4()

    public get worldMatrix() {
        if (!this.isDirty) return this._worldMatrix;
        this.updateMatrices();
        return this._worldMatrix;

    }

    get x() {
        return this._position.x;
    }

    set x(value: number) {
        this._position.x = value;
        this.setDirty()
    }

    get y() {
        return this._position.y;
    }

    set y(value: number) {
        this._position.y = value;
        this.setDirty()
    }
    get r() {
        return this._r;
    }

    set r(value: number) {
        this._r = value;
        this._rotation.setAxisAngle(new Vector3(0, 0, 1), value)
        this.setDirty()
    }
    addChild(child: Object2D) {
        this.children.push(child)
        child.parent = this;
    }

    update() {

        this.updateInt()

        for (let c of this.children) {
            c.update()
        }
    }

    updateInt() {
        //overide

    }

    draw(pass: RenderPass) {

        if (!this.visible) return;
        this.drawInt(pass)

        for (let c of this.children) {
            c.draw(pass)
        }
    }

    public drawInt(pass: RenderPass) {

    }

    protected updateMatrices() {
        if (!this.isDirty) return
        if (!this.visible) return;
        this._localMatrix.identity();
        this._localMatrix.translate(this._position);

        this.tempMatrix.fromQuaternion(this._rotation);
        this._localMatrix.multiplyRight(this.tempMatrix);
        this._localMatrix.scale(this._scale);
        //update local matrix
        if (this.parent) {
            this._worldMatrix.from(this.parent.worldMatrix)
            this._worldMatrix.multiplyRight(this._localMatrix);
        } else {
            this._worldMatrix.from(this._localMatrix)
        }

        this._worldMatrixInv.from(this._worldMatrix);
        this._worldMatrixInv.invert();
        // this._rotation.
        //this._euler

        this.isDirty = false;

    }

    private setDirty() {
        this.isDirty = true;
        for (let c of this.children) {
            c.setDirty()
        }
    }



    public currentOver: Object2D | null = null;
    public currentDown: Object2D | null = null;


    private touchMap: Map<number, Object2D | null> = new Map(); // touchId -> hovered Object2D
    private touchDownMap: Map<number, Object2D | null> = new Map(); // touchId -> pressed Object2D
    mousePos: Vector2 = new Vector2();

    updateMouse(mousePos: Vector2, isDownThisFrame: boolean, isUpThisFrame: boolean, pointers: TouchPointer[]) {

        if (this.multiTouch) {
            this.updateMultiTouch(pointers)
            return;
        }

        let mouseObject = this.updateMouseInt(mousePos);
        if (this.currentOver != mouseObject) {
            if (this.currentOver) this.currentOver.rollOut()
            this.currentOver = mouseObject
            if (this.currentOver) this.currentOver.rollOver()
        }

        if (isDownThisFrame) {

            this.currentDown = this.currentOver;
            if (this.currentDown) {
                console.log(this.currentDown)
                this.currentDown.mouseDown()


            }
        }
        if (isUpThisFrame) {
            if (this.currentDown) {
                this.currentDown.mouseUp()
                if (this.currentDown == this.currentOver) this.currentDown.onClick()
                this.currentDown = null
                GameModel.mouseListener.reset()
            }

        }

    }

    /**
     * Multi-touch input handler - supports multiple simultaneous touches
     */
    updateMultiTouch(touches: TouchPointer[]) {
        // Update active touches

        for (const touch of touches) {
            const touchObject = this.updateMouseInt(touch.pos);
            if (touchObject) touchObject.mousePos.copy(touch.pos);
            const prevObject = this.touchMap.get(touch.id);

            // Handle rollover/rollout
            if (prevObject !== touchObject) {
                if (prevObject) prevObject.rollOut();
                if (touchObject) touchObject.rollOver();
                this.touchMap.set(touch.id, touchObject);
            }

            // Handle touch down
            if (touch.isPressed && !this.touchDownMap.has(touch.id)) {
                if (touchObject) {
                    touchObject.mouseDown();

                    this.touchDownMap.set(touch.id, touchObject);
                }
            }
        }

        // Check for ended touches
        for (const [touchId, touchObject] of this.touchDownMap) {

            let touch = touches.find(t => t.id === touchId)

            if (!touch) {
                // Touch ended
                if (touchObject) {
                    touchObject.mouseUp();

                    const hovered = this.touchMap.get(touchId);
                    if (touchObject === hovered) {
                        touchObject.onClick();
                    }
                }
                this.touchDownMap.delete(touchId);
                this.touchMap.delete(touchId);
            } else {

                touchObject?.mousePos.copy(touch.pos)

            }
        }
    }
    updateMouseInt(mousePos: Vector2): null | Object2D {
        if (!this.visible) return null;
        if (!this.mouseEnabled) return null;


        for (let i = this.children.length - 1; i >= 0; i--) {
            const c = this.children[i];
            const a = c.updateMouseInt(mousePos);
            if (a) return a;
        }

        return this.checkMouseHit(mousePos)
    }
    checkMouseHit(mousePos: Vector2): null | Object2D {
        return null
    }

    public rollOut() {

    }
    public rollOver() {

    }

    public mouseDown() {

    }
    public mouseUp() {

    }

    public onClick() {

    }
}
