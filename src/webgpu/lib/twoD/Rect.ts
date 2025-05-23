import {Vector2, Vector4} from "@math.gl/core";
import Vec2 from "../UI/math/Vec2.ts";

export default class Rect{

    public max: Vector2 = new Vector2();
    public min: Vector2 = new Vector2();
    constructor() {
    }

    contains(pos: Vector4) {
        if (pos.x < this.min.x) return false;
        if (pos.x > this.max.x) return false;
        if (pos.y < this.min.y) return false;
        if (pos.y > this.max.y) return false;
        return true;
    }
}
