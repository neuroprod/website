import {Vector3} from "@math.gl/core";


export default class PathBezier{
    bezierSmoothing = 0.25;
    private p1: Vector3;
    private p2: Vector3;
    private c1: Vector3;
    private c2: Vector3;
    constructor(p0:Vector3,p1:Vector3,p2:Vector3,p3:Vector3) {

        this.p1 = p1;
        this.p2 = p2;
        this.c1 = this.getControlePoint1(p0, p1, p2)
        this.c2 = this.getControlePoint2(p1, p2, p3)

    }

    getControlePoint1(a: Vector3, b: Vector3, c: Vector3) {

        return new Vector3(b.x + (c.x - a.x) * this.bezierSmoothing, b.y + (c.y - a.y) * this.bezierSmoothing, b.z + (c.z - a.z) * this.bezierSmoothing)


    }

    getControlePoint2(a: Vector3, b: Vector3, c: Vector3) {

        return new Vector3(b.x - (c.x - a.x) * this.bezierSmoothing, b.y - (c.y - a.y) * this.bezierSmoothing, b.z - (c.z - a.z) * this.bezierSmoothing)


    }


    public getTime(p: Vector3, t: number) {

        const inverseFactor = 1 - t;
        const inverseFactorTimesTwo = inverseFactor * inverseFactor;
        const factorTimes2 = t * t;

        const factor1 = inverseFactorTimesTwo * inverseFactor;
        const factor2 = 3 * t * inverseFactorTimesTwo;
        const factor3 = 3 * factorTimes2 * inverseFactor;
        const factor4 = factorTimes2 * t;

        p.x = this.p1.x * factor1 + this.c1.x * factor2 + this.c2.x * factor3 + this.p2.x * factor4;
        p.y = this.p1.y * factor1 + this.c1.y * factor2 + this.c2.y * factor3 + this.p2.y * factor4;
        p.z = this.p1.z * factor1 + this.c1.z * factor2 + this.c2.z * factor3 + this.p2.z * factor4;
        return p;
    }

}
