import {Matrix4, Quaternion, Vector3} from "@math.gl/core";
import RenderPass from "../RenderPass.ts";

export default class Object2D {
    public parent: Object2D | null = null;
    public children: Array<Object2D> = []
    public id = ""
    public visible: boolean = true;
    protected _position = new Vector3(0, 0, 0);
    private isDirty: boolean = true;
    private scaleValue = 1;
    private _rotation = new Quaternion(0, 0, 0, 1);
    private tempMatrix = new Matrix4()
    private _localMatrix: Matrix4 = new Matrix4()
    private _worldMatrixInv: Matrix4 = new Matrix4()

    constructor() {
    }

    private _scale = new Vector3(1, 1, 1);

    get scale() {
        return this.scaleValue
    }

    set scale(value: number) {
        this.scaleValue = value;
        this._scale.set(value, value, 1)
        this.setDirty()
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
}
