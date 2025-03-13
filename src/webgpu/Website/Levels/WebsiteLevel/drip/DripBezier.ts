import {Vector2} from "@math.gl/core";

import {NumericArray} from "@math.gl/types";

export default class DripBezier {
    p1: Vector2;
    p2: Vector2;
    c1: Vector2;
    c2: Vector2;
    private temp = new Vector2()

    constructor(p1: Vector2, c1: Vector2, c2: Vector2, p2: Vector2) {

        this.p1 = p1;
        this.p2 = p2;
        this.c1 = c1;
        this.c2 = c2;

    }


    public getTime(p: Vector2, t: number) {

        const inverseFactor = 1 - t;
        const inverseFactorTimesTwo = inverseFactor * inverseFactor;
        const factorTimes2 = t * t;

        const factor1 = inverseFactorTimesTwo * inverseFactor;
        const factor2 = 3 * t * inverseFactorTimesTwo;
        const factor3 = 3 * factorTimes2 * inverseFactor;
        const factor4 = factorTimes2 * t;

        p.x = this.p1.x * factor1 + this.c1.x * factor2 + this.c2.x * factor3 + this.p2.x * factor4;
        p.y = this.p1.y * factor1 + this.c1.y * factor2 + this.c2.y * factor3 + this.p2.y * factor4;

        return p;
    }


}
