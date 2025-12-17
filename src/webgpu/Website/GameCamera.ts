import Camera from "../lib/Camera.ts";
import Renderer from "../lib/Renderer.ts";

import SceneObject3D from "../data/SceneObject3D.ts";
import { NumericArray } from "@math.gl/types";
import { Vector2, Vector3 } from "@math.gl/core";
import Timer from "../lib/Timer.ts";
import { lerpValueDelta } from "../lib/MathUtils.ts";
import gsap from "gsap";
import SceneHandler from "../data/SceneHandler.ts";
import GameModel from "./GameModel.ts";


enum CameraState {
    Locked,
    CharCamera
}


export default class GameCamera {
    camera: Camera;
    private renderer: Renderer;
    private charRoot: SceneObject3D;

    public cameraLookAt: Vector3 = new Vector3();
    public cameraWorld: Vector3 = new Vector3();


    public cameraLookAtTemp: Vector3 = new Vector3();
    public cameraWorldTemp: Vector3 = new Vector3();


    public camDistance = 2.5
    public heightOffset = 0.5
    private camPos: Vector3 = new Vector3();


    private cameraState: CameraState = CameraState.Locked
    private shakeY: number = 0;
    private shakeX: number = 0;
    private minX: number = -100;
    private maxX: number = 100;
    private tl!: gsap.core.Timeline;


    private mouseNorm = new Vector2()
    private mouseMoveScale = 0.04
    zoomTL!: gsap.core.Timeline;


    constructor(renderer: Renderer, camera: Camera) {
        this.renderer = renderer;
        this.camera = camera;
        this.charRoot = SceneHandler.root
        this.camera.near = 0.3
    }


    update() {



        //
        if (this.cameraState == CameraState.CharCamera) this.updateCharCamera()


        this.camera.ratio = this.renderer.ratio


        this.cameraLookAtTemp.copy(this.cameraLookAt as NumericArray);//target
        this.cameraWorldTemp.copy(this.cameraWorld as NumericArray);//eye
        let rotationCenter = 1
        let center = this.cameraWorldTemp.clone()
        center.lerp(this.cameraLookAtTemp, rotationCenter);
        let distanceToEye = center.distance(this.cameraWorldTemp);
        let distanceToTarget = center.distance(this.cameraLookAtTemp);

        let dir = this.cameraLookAtTemp.clone().subtract(this.cameraWorldTemp);
        dir.normalize();

        let theta = Math.atan2(dir.x, dir.z);
        let thetaLength = Math.sqrt(dir.x * dir.x + dir.z * dir.z);
        let phi = Math.atan2(thetaLength, dir.y);
        this.mouseNorm.lerp(GameModel.mouseListener.mouseNorm, 0.1)

        theta += this.mouseNorm.x * -1 * this.mouseMoveScale
        phi += this.mouseNorm.y * -0.5 * this.mouseMoveScale


        let dirNew = new Vector3((Math.sin(phi) * Math.sin(theta)), Math.cos(phi), Math.sin(phi) * Math.cos(theta));
        this.cameraWorldTemp = center.clone();
        let adj = dirNew.clone();
        adj.scale(distanceToEye);
        this.cameraWorldTemp.subtract(adj);

        this.cameraLookAtTemp = center.clone();
        adj = dirNew.clone();
        adj.scale(distanceToTarget);
        this.cameraLookAtTemp.add(adj);











        this.camera.cameraLookAt.copy(this.cameraLookAtTemp as NumericArray);
        this.camera.cameraWorld.copy(this.cameraWorldTemp as NumericArray);
        this.camera.cameraWorld.y += this.shakeY;
        this.camera.cameraLookAt.y += this.shakeY * 0.5
        this.camera.cameraWorld.x += this.shakeX;
        this.camera.cameraLookAt.x += this.shakeX * 0.5

        this.camera.cameraUp.set(0, 1, 0)
        this.camera.update()



    }

    setCharacter() {
        if (this.zoomTL) this.zoomTL.clear()
        this.charRoot = SceneHandler.getSceneObject("charRoot");
        this.cameraState = CameraState.CharCamera



    }

    setForCharPos(charPos: Vector3) {
        charPos.y += this.heightOffset
        if (charPos.x < this.minX) {
            charPos.x = this.minX

        }
        if (charPos.x > this.maxX) {
            charPos.x = this.maxX

        }

        this.cameraLookAt.lerp(charPos, 1)
        this.camPos.copy(this.cameraLookAt);
        this.camPos.z += this.camDistance;

        // this.camPos.y += 0;

        this.cameraWorld.lerp(this.camPos as NumericArray, 1)
    }
    getScreenEdge() {
        let campos = new Vector2(this.cameraWorld.x, this.cameraWorld.z)


        let n = new Vector2(0, -1)
        let hFov = this.camera.hfov / 2

        let edgeDirL = new Vector2(Math.sin(hFov), Math.cos(hFov))
        let edgeDirR = new Vector2(-edgeDirL.x, edgeDirL.y)
        let denom = n.dot(edgeDirL);
        let t = -(campos.dot(n)) / denom;
        edgeDirR.scale(t).add(campos)
        edgeDirL.scale(t).add(campos)

        return new Vector2(edgeDirL.x, edgeDirR.x)
    }
    updateCharCamera() {
        let delta = Timer.delta;
        let charPos = this.charRoot.getWorldPos()
        charPos.y += this.heightOffset
        if (charPos.x < this.minX) charPos.x = this.minX
        if (charPos.x > this.maxX) charPos.x = this.maxX
        this.cameraLookAt.lerp(charPos, 1 - Math.pow(0.01, delta))
        this.camPos.copy(this.cameraLookAt);
        this.camPos.z += this.camDistance;
        this.camPos.y += 0;
        //  this.camera.fovy =0.3

        // this.camera.far=100
        this.cameraWorld.lerp(this.camPos as NumericArray, lerpValueDelta(0.0001, delta))
    }
    setCharView() {
        if (this.zoomTL) this.zoomTL.clear()
        this.cameraState = CameraState.CharCamera
    }

    setLockedView(camLookAt: Vector3 | null = null, camPosition: Vector3 | null = null) {
        if (this.zoomTL) this.zoomTL.clear()
        if (camPosition) this.cameraWorld.copy(camPosition as NumericArray);
        if (camLookAt) this.cameraLookAt.copy(camLookAt as NumericArray);
        this.cameraState = CameraState.Locked;
    }

    setLockedViewZoom(camLookAt: Vector3, camPosition: Vector3) {


        if (this.zoomTL) this.zoomTL.clear()
        this.zoomTL = gsap.timeline()
        let z = camPosition.z;
        camPosition.z += 0.05
        this.cameraWorld.copy(camPosition as NumericArray);

        if (camLookAt) this.cameraLookAt.copy(camLookAt as NumericArray);
        this.cameraState = CameraState.Locked;


        this.zoomTL.to(this.cameraWorld, { z: z, duration: 15 });
    }

    setPan(camLookAt: Vector3, camPosition: Vector3) {


        if (this.zoomTL) this.zoomTL.clear()
        this.zoomTL = gsap.timeline()


        this.zoomTL.to(this.cameraWorld, { z: camPosition.z, duration: 15 });
    }
    TweenToLockedView(camLookAt: Vector3, camPosition: Vector3, duration = 1.5) {
        this.tl = gsap.timeline()
        this.tl.to(this.cameraWorld, { x: camPosition.x, y: camPosition.y, z: camPosition.z, duration: duration, ease: "power3.inout" }, 0)
        this.tl.to(this.cameraLookAt, { x: camLookAt.x, y: camLookAt.y, z: camLookAt.z, duration: duration, ease: "power3.inout" }, 0)
        this.cameraState = CameraState.Locked;
    }


    screenShakeCookie(value: number) {
        gsap.delayedCall(0.1, () => {
            this.shakeY = value

            gsap.to(this, {
                shakeY: 0,
                ease: "rough({template:none.out,strength: 10,points:20,taper:none,randomize:true,clamp:false})",
                duration: 0.3
            })
        })

    }
    screenShakeHit(value: number) {
        gsap.delayedCall(0.1, () => {

            this.shakeX = value
            gsap.to(this, {

                shakeX: 0,
                ease: "rough({template:none.out,strength: 10,points:20,taper:none,randomize:true,clamp:false})",
                duration: 0.3
            })
        })

    }

    setMinMaxX(minX: number, maxX: number) {
        this.minX = minX
        this.maxX = maxX
    }

    destroyTweens() {

        if (this.tl) this.tl.clear()
        gsap.killTweensOf(this)
    }

    setMouseInput(moveScale: number = 0.04, moveCenter: number = 0.5) {
        this.mouseMoveScale = moveScale

    }
}
