import NavigationLevel from "../NavigationLevel.ts";

import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import GameModel from "../../GameModel.ts";
import { Vector2, Vector3 } from "@math.gl/core";
import Timer from "../../../lib/Timer.ts";

import SoundHandler from "../../SoundHandler.ts";

import SceneObject3D from "../../../data/SceneObject3D.ts";
import gsap from "gsap";
import ColorV from "../../../lib/ColorV.ts";

export default class FisTik extends NavigationLevel {
    private prevBeat: number = 0;


    private letters: Array<SceneObject3D> = []
    private rotArray = [0.39792657416513594, 0.1388963861591357, -0.11954889437539933, 0, 0, -0.23804373608426369]
    private beatCount: number = -1;
    constructor() {
        super();

    }


    init() {
        super.init();

        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()

        SceneHandler.setScene(SceneHandler.getSceneIDByName("smullen")).then(() => {
            LoadHandler.stopLoading()

        });
        SoundHandler.setBackgroundSounds(["sound/barn-job-81726.mp3"])
        this.beatCount = 0
    }

    configScene() {
        super.configScene()
        LoadHandler.onComplete = () => {
        }
        GameModel.gameRenderer.setModels(SceneHandler.allModels)
        this.setMouseHitObjects(SceneHandler.mouseHitModels);

        GameModel.gameCamera.setLockedViewZoom(new Vector3(0.01, 0.25, 0), new Vector3(0.01, 0.25, 0.65))

        GameModel.gameRenderer.setLevelType("website")
        this.prevBeat = -1
        let t = ""
        for (let i = 1; i < 7; i++) {
            this.letters.push(SceneHandler.getSceneObject("l" + i))

        }
        GameModel.gameRenderer.setRenderSettingsNeutral({ sunColor: new ColorV(0.99, 0.84, 0.56, 0.00), backgroundColor: new ColorV(0.18, 0.16, 0.07, 0.00) })
    }

    public update() {
        super.update()
        SceneHandler.sceneAnimations[0].autoPlay(Timer.delta)
        let beat = (SoundHandler.bgSounds[0].sound.seek() * 1000) % 753;
        if (beat < this.prevBeat) {
            this.beat()

        }
        this.prevBeat = beat

    }

    destroy() {
        super.destroy()
        SoundHandler.killBackgroundSounds()
        for (let i = 0; i < 6; i++) {
            this.letters[i].ry = this.rotArray[i]

        }
        this.letters = []
    }


    private beat() {
        this.beatCount++;
        let beatCountL = this.beatCount % this.letters.length;
        this.letters[beatCountL].ry = this.rotArray[beatCountL]

        this.letters[beatCountL].sx = this.letters[beatCountL].sy = 1.2
        gsap.to(this.letters[beatCountL], { sx: 1, sy: 1, duration: 1, ease: "power3.Out" })


    }
}
