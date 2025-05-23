import Renderer from "../../lib/Renderer.ts";
import Camera from "../../lib/Camera.ts";
import Model from "../../lib/model/Model.ts";
import TextBalloonFontMaterial from "./TextBalloonFontMaterial.ts";

import TextBalloonFontMesh from "./TextBalloonFontMesh.ts";
import Path from "../../lib/path/Path.ts";
import ExtrudeMesh from "../../modelMaker/ExtrudeMesh.ts";
import {MeshType} from "../../data/ProjectMesh.ts";
import TextBalloonMaterial from "./TextBalloonMaterial.ts";
import {Vector2, Vector3, Vector4} from "@math.gl/core";
import SceneObject3D from "../../data/SceneObject3D.ts";
import Object3D from "../../lib/model/Object3D.ts";
import gsap from 'gsap'
import {drawCircle} from "../../lib/path/Shapes.ts";
import ProjectData from "../../data/ProjectData.ts";
import GameModel from "../GameModel.ts";
import SoundHandler from "../SoundHandler.ts";

export default class TextBalloonHandler {

    private renderer: Renderer;
    private textModel: Model;
    private path: Path;
    private extrudeMesh: ExtrudeMesh;
    private balloonModel: Model;

    private offset = new Vector2(5, 3)
    private curveOffset = new Vector2(3, 2)

    private tl: Vector2 = new Vector2();
    private tlS: Vector2 = new Vector2();
    private tlc1: Vector2 = new Vector2();
    private tlc2: Vector2 = new Vector2();

    private tr: Vector2 = new Vector2();
    private trS: Vector2 = new Vector2();
    private trc1: Vector2 = new Vector2();
    private trc2: Vector2 = new Vector2();


    private bl: Vector2 = new Vector2();
    private blS: Vector2 = new Vector2();
    private blc1: Vector2 = new Vector2();
    private blc2: Vector2 = new Vector2();

    private br: Vector2 = new Vector2();
    private brS: Vector2 = new Vector2();
    private brc1: Vector2 = new Vector2();
    private brc2: Vector2 = new Vector2();
    private showText: boolean = false;
    private textMesh: TextBalloonFontMesh;
    private newBalloon: boolean = true;
    private model!: SceneObject3D;
    private modelOffset: Vector3 = new Vector3();
    private holder: Object3D;
    private gameCamera: Camera;

    private extrudeMeshArrowPoint: ExtrudeMesh;
    private arrowModelPoint: Model;
    private arrowLeftModel: Model;
    private arrowRightModel: Model;
    private charPos = -4;
    private extrudeMeshArrow: ExtrudeMesh;
    private dots: Array<Model> = [];
    private extrudeMeshDot: ExtrudeMesh;
    private numAnswers: number = 0;
    private newChoice: boolean = false;
    private dotHolder: Object3D;
    private tLine!: gsap.core.Timeline;

    private charPosOld = 0;
    private charCount = 0;


    constructor(renderer: Renderer, gameCamera: Camera) {
        this.gameCamera = gameCamera;
        this.renderer = renderer;

//text
        this.textModel = new Model(renderer, "textModel")
        this.textModel.material = new TextBalloonFontMaterial(renderer, "textBalloonFontMaterial")

        this.textMesh = new TextBalloonFontMesh(renderer)
        this.textMesh.setText("Hi Strawberry!\nWhats up?\n", ProjectData.font, 0.15)

        this.textModel.mesh = this.textMesh;
        this.textModel.setScaler(1)

///balloon
        this.path = new Path()
        let w = this.textMesh.max.x
        let h = this.textMesh.min.y
        this.tl = new Vector2(-this.offset.x, +this.offset.y)

        this.tr = new Vector2(w + this.offset.x, +this.offset.y)


        this.br = new Vector2(w + this.offset.x, h - this.offset.y)

        this.bl = new Vector2(-this.offset.x, h - this.offset.y)


        this.extrudeMesh = new ExtrudeMesh(renderer)
        this.extrudeMeshArrowPoint = new ExtrudeMesh(renderer)


        this.balloonModel = new Model(renderer, "balloonModel")
        this.balloonModel.mesh = this.extrudeMesh;
        this.balloonModel.material = new TextBalloonMaterial(renderer, "textBalloonMaterial")
        GameModel.overlay.modelRenderer.addModel(this.balloonModel)

        this.arrowModelPoint = new Model(renderer, "arrowModel")
        this.arrowModelPoint.mesh = this.extrudeMeshArrowPoint;
        this.arrowModelPoint.material = this.balloonModel.material
        this.arrowModelPoint.y = 10;
        GameModel.overlay.modelRenderer.addModel(this.arrowModelPoint)

        //conversation arrows
        this.path.clear()
        let angle = Math.PI / 2;
        let radius = 3;
        this.path.moveTo([Math.sin(angle) * radius, Math.cos(angle) * radius])
        angle += Math.PI * 2 / 3;
        this.path.lineTo([Math.sin(angle) * radius, Math.cos(angle) * radius])
        angle += Math.PI * 2 / 3;
        this.path.lineTo([Math.sin(angle) * radius, Math.cos(angle) * radius])

        this.extrudeMeshArrow = new ExtrudeMesh(renderer)
        this.extrudeMeshArrow.setExtrusion(this.path.getPoints(), MeshType.PLANE)
        this.arrowLeftModel = new Model(renderer, "arrowModel")
        this.arrowLeftModel.x = -10;
        this.arrowLeftModel.rz = Math.PI
        this.arrowLeftModel.mesh = this.extrudeMeshArrow;
        this.arrowLeftModel.material = new TextBalloonMaterial(renderer, "textBalloonMaterial")
        this.arrowLeftModel.material.setUniform("color", new Vector4(0.8, 0.8, 0.8, 1))
        GameModel.overlay.modelRenderer.addModel(this.arrowLeftModel)

        this.arrowRightModel = new Model(renderer, "arrowModel")
        this.arrowRightModel.x = 10;

        this.arrowRightModel.mesh = this.extrudeMeshArrow;
        this.arrowRightModel.material = this.arrowLeftModel.material
        GameModel.overlay.modelRenderer.addModel(this.arrowRightModel)


//

        GameModel.overlay.modelRenderer.addModel(this.textModel)
        this.holder = new Object3D(renderer, "balloonHolder");
        this.holder.addChild(this.arrowModelPoint)
        this.holder.addChild(this.balloonModel)
        this.holder.addChild(this.arrowLeftModel)
        this.holder.addChild(this.arrowRightModel)
        //dots
        this.extrudeMeshDot = new ExtrudeMesh(renderer)
        this.path.clear()
        drawCircle(this.path, new Vector3(0, 0, 0), 0.7)
        this.extrudeMeshDot.setExtrusion(this.path.getPoints(), MeshType.PLANE)
        this.dotHolder = new Object3D(renderer, "dotHolder");
        for (let i = 0; i < 4; i++) {
            let dotModel = new Model(renderer, "arrowModel")

            dotModel.mesh = this.extrudeMeshDot;
            dotModel.material = new TextBalloonMaterial(renderer, "textBalloonMaterial")
            dotModel.material.setUniform("color", new Vector4(1, 1, 0.5, 1))
            GameModel.overlay.modelRenderer.addModel(dotModel)
            this.dotHolder.addChild(dotModel)
            this.dots.push(dotModel)
        }

        this.holder.addChild(this.dotHolder)

        this.holder.addChild(this.textModel)
        this.showText = false;
        this.hideText()
    }

    updatePath() {


        this.tlc1.copy(this.tl).add([this.curveOffset.x, this.curveOffset.y])
        this.tlc2.copy(this.tl).add([-this.curveOffset.x, -this.curveOffset.y])

        this.trc1.copy(this.tr).add([this.curveOffset.x, -this.curveOffset.y])
        this.trc2.copy(this.tr).add([-this.curveOffset.x, this.curveOffset.y])

        this.brc1.copy(this.br).add([-this.curveOffset.x, -this.curveOffset.y])
        this.brc2.copy(this.br).add([this.curveOffset.x, this.curveOffset.y])


        this.blc1.copy(this.bl).add([-this.curveOffset.x, this.curveOffset.y])
        this.blc2.copy(this.bl).add([this.curveOffset.x, -this.curveOffset.y])


        this.path.clear()

        this.path.moveTo(this.tl)
        this.path.bezierCurveTo(this.tlc1, this.trc2, this.tr)
        this.path.bezierCurveTo(this.trc1, this.brc2, this.br)
        this.path.bezierCurveTo(this.brc1, this.blc2, this.bl)
        this.path.bezierCurveTo(this.blc1, this.tlc2, this.tl)

        this.extrudeMesh.setExtrusion(this.path.getPoints(12), MeshType.PLANE)

    }

    update() {
        if (!this.showText) return;


        if (this.model) {

            let w = this.model.getWorldPos().add(this.modelOffset)
            // DebugDraw.drawCircle(w, 0.01)

            w.transform(this.gameCamera.viewProjection)
            this.holder.x = w.x * 100 * this.renderer.ratio;
            this.holder.y = w.y * 100;

            let charPosR = Math.round(this.charPos)
            if (charPosR != this.charPosOld) {

                this.charCount++
                this.charCount %= 2
                if (this.charCount == 0) SoundHandler.playTalking()
            }
            this.charPosOld = charPosR

            this.textModel.material.setUniform("charPos", this.charPos)
            this.balloonModel.visible = true
            this.textModel.visible = true
            this.arrowModelPoint.visible = true

        }

    }


    setText(text: string, numAnswers: number = 0, index: number = 0) {
        this.setNumAnswers(numAnswers);

        if (!this.showText) {
            this.newBalloon = true

        }
        if (this.newBalloon) {
            this.makeArrowPoint()
        }


        this.charPos = -4
        this.textMesh.setText(text, ProjectData.font, 0.15)
        let w = Math.max(this.textMesh.max.x, 20);


        let h = -this.textMesh.numLines * 7;
        let textArrowOffset = 0


        let ox = -w / 2;
        let oy = -h + 15 - this.textMesh.numLines * 2;
        if (numAnswers > 0) {

            textArrowOffset += 10
            this.arrowRightModel.visible = true
            this.arrowLeftModel.visible = true

            h -= 2;

            w += 20;


            for (let i = 0; i < this.numAnswers; i++) {
                if (i == index) {
                    this.dots[i].material.setUniform("color", [0.8, 0.8, 0.8, 1])
                } else {
                    this.dots[i].material.setUniform("color", [0.3, 0.3, 0.3, 1])
                }

            }


        }
        if (this.modelOffset.x > 0) {
            ox += 10
        } else {
            ox -= 10
        }

        this.textModel.x = ox + textArrowOffset;
        this.textModel.y = oy;


        this.tlS.set(-this.offset.x + ox, +this.offset.y + oy);
        this.trS.set(w + this.offset.x + ox, +this.offset.y + oy);
        this.brS.set(w + this.offset.x + ox, h - this.offset.y + oy);
        this.blS.set(-this.offset.x + ox, h - this.offset.y + oy);

        if (this.newBalloon) {
            this.tl.from(this.tlS);
            this.tr.from(this.trS);
            this.bl.from(this.blS);
            this.br.from(this.brS);
            let startOff = 5;
            this.tl.add([startOff, -startOff]);
            this.tr.add([-startOff, -startOff]);
            this.bl.add([startOff, startOff]);
            this.br.add([-startOff, startOff]);

        }

        if (this.tLine) this.tLine.clear()
        this.tLine = gsap.timeline()


        let ease = "back.out(1.5)";
        let time = 0.3


        if (this.newBalloon) {
            this.arrowModelPoint.sx = this.arrowModelPoint.sy = 0;
            this.tLine.to(this.arrowModelPoint, {sx: 1, sy: 1, duration: 0.2, ease: "power4.out"}, 0)
            this.holder.setScaler(0);
            this.tLine.to(this.holder, {sx: 1, sy: 1, sz: 1, duration: 0.3, ease: "power4.out"}, 0)
        }

        this.tLine.to(this.tl, {x: this.tlS.x, y: this.tlS.y, duration: time, ease: ease}, 0)
        this.tLine.to(this.tr, {x: this.trS.x, y: this.trS.y, duration: time, ease: ease}, 0)
        this.tLine.to(this.bl, {x: this.blS.x, y: this.blS.y, duration: time, ease: ease}, 0)
        this.tLine.to(this.br, {
            x: this.brS.x, y: this.brS.y, duration: time, ease: ease, onUpdate: () => {
                this.updatePath()
            }
        }, 0)

        this.textModel.material.setUniform("charPos", this.charPos)
        this.tLine.to(this, {
            charPos: this.textMesh.charCount, duration: this.textMesh.charCount / 50
        }, 0.2)


        if (numAnswers > 0) {

            if (this.newChoice) {

                this.arrowRightModel.x = this.trS.x - 7
                this.arrowLeftModel.x = this.tlS.x + 7;
                this.arrowLeftModel.y = this.arrowRightModel.y = (this.blS.y - this.tlS.y) / 2 + this.tlS.y + 1


                this.dotHolder.x = (this.tlS.x + this.trS.x) / 2
                this.dotHolder.y = this.blS.y + 2
                this.arrowLeftModel.setScaler(0)
                this.arrowRightModel.setScaler(0)
                this.tLine.to(this.arrowLeftModel, {sx: 1, sy: 1, sz: 1, duration: 0.3, ease: "power3.out"}, 0.3)
                this.tLine.to(this.arrowRightModel, {sx: 1, sy: 1, sz: 1, duration: 0.3, ease: "power3.out"}, 0.3)

            } else {
                let py = (this.blS.y - this.tlS.y) / 2 + this.tlS.y + 1;
                this.tLine.to(this.arrowLeftModel, {x: this.tlS.x + 7, y: py, duration: 0.3, ease: ease}, 0.0)
                this.tLine.to(this.arrowRightModel, {x: this.trS.x - 7, y: py, duration: 0.3, ease: ease}, 0.0)
                this.tLine.to(this.dotHolder, {y: this.blS.y + 2, duration: 0.3, ease: ease}, 0.0)

                //this.dotHolder.x = (this.tlS.x+this.trS.x)/2

            }

            this.newChoice = false;


        }


        this.updatePath()

        this.balloonModel.visible = false
        this.textModel.visible = true
        this.arrowModelPoint.visible = false
        this.newBalloon = false
        this.showText = true;

    }

    setModel(m: SceneObject3D, offset: Array<number>) {
        if (this.model != m) this.newBalloon = true
        this.model = m
        this.modelOffset.from(offset)


    }

    hideText() {

        if (this.tLine) this.tLine.clear()
        this.charPos = -4
        this.balloonModel.visible = false
        this.arrowRightModel.visible = false
        this.arrowLeftModel.visible = false
        this.textModel.visible = false
        this.arrowModelPoint.visible = false
        for (let d of this.dots) {
            d.visible = false
        }
        this.holder.y = -1000
        this.textModel.material.setUniform("charPos", this.charPos)
        this.showText = false;
    }

    private makeArrowPoint() {
        this.path.clear()
        if (this.modelOffset.x > 0) {
            this.path.moveTo(new Vector2(-2, -10))

            this.path.lineTo(new Vector2(-3, 0))
            this.path.lineTo(new Vector2(3, 0))
        } else {
            this.path.moveTo(new Vector2(2, -10))
            this.path.lineTo(new Vector2(3, 0))
            this.path.lineTo(new Vector2(-3, 0))
        }
        this.extrudeMeshArrowPoint.setExtrusion(this.path.getPoints(12), MeshType.PLANE)
    }

    private setNumAnswers(numAnswers: number) {

        if (this.numAnswers == 0 && numAnswers != this.numAnswers) {
            this.newChoice = true;
        } else {
            this.newChoice = false;
        }
        this.numAnswers = numAnswers
        if (numAnswers == 0) {

            this.arrowRightModel.visible = false
            this.arrowLeftModel.visible = false
            for (let d of this.dots) {
                d.visible = false
            }
        } else {
            let step = 2.5;
            let posStart = -((numAnswers - 1) * step) / 2;

            for (let i = 0; i < this.numAnswers; i++) {
                this.dots[i].visible = true;
                this.dots[i].x = posStart

                posStart += step;
            }

        }

    }
}
