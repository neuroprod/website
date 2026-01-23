import LoadHandler from "../../data/LoadHandler.ts";
import { Textures } from "../../data/Textures.ts";
import Renderer from "../Renderer.ts";
import TextureLoader from "../textures/TextureLoader.ts";

import VideoRenderPass from "./VideoRenderPass.ts";
import { Vector2 } from "@math.gl/core";

export default class VideoPlayer {

    video: HTMLVideoElement;
    private renderer: Renderer;
    private videoRenderPass: VideoRenderPass;
    holdTexture: TextureLoader;
hasFrame:boolean=false;
    onPlay!: () => void;

    constructor(renderer: Renderer, file: string, size: Vector2) {

        this.video = document.createElement("Video") as HTMLVideoElement;

        this.renderer = renderer
        this.videoRenderPass = new VideoRenderPass(renderer, file, size)
        this.video.src = file;
        this.video.autoplay = false;
        this.video.loop = true;
        this.video.muted = true;
        this.video.playsInline = true;
        this.video.preload = 'auto';

LoadHandler.startLoading();
        this.holdTexture = new TextureLoader(this.renderer, Textures.PATATO)
        this.holdTexture.onComplete=()=>{
        
         LoadHandler.stopLoading();
        }

    }
    getTexture() {
        if(!this.hasFrame){
        return this.holdTexture;
    }
        return this.videoRenderPass.texture
    }

    play() {

        this.video.play().then(() => {

            this.video.requestVideoFrameCallback(this.setFrame.bind(this));
        })

    }
    public pauze() {
        this.video.pause()

    }
    public setFrame() {
        // this.isReady = true;
        let videoFrame = new VideoFrame(this.video)

        this.videoRenderPass.material.uniformGroups[0].setVideoFrameTexture("colorTexture", videoFrame)
        this.videoRenderPass.material.uniformGroups[0].update();

        let comEncoder = this.renderer.device.createCommandEncoder()
        this.videoRenderPass.addToCommandEncoder(comEncoder)

        this.renderer.device.queue.submit([comEncoder.finish()]);


        //console.log(videoFrame)

        this.video.requestVideoFrameCallback(this.setFrame.bind(this));
        // this.onVideoFrame()*/
        videoFrame.close()

        console.log("play",this.hasFrame,this.onPlay);

        if(!this.hasFrame && this.onPlay){
            this.hasFrame = true;
            this.onPlay();
           
        }


    }

}
