import Renderer from "../../lib/Renderer.ts";
import {Vector2} from "@math.gl/core";
import UI from "../../lib/UI/UI.ts";
import DrawLine from "./DrawLine.ts";
import DrawBufferTempPass from "./DrawBufferTempPass.ts";

import Project from "../../data/Project.ts";
import Color from "../../lib/UI/math/Color.ts";
import TextureLoader from "../../lib/textures/TextureLoader.ts";
import CopyTexturePass from "../../lib/blit/CopyTexturePass.ts";
import Texture from "../../lib/textures/Texture.ts";
import DefaultTextures from "../../lib/textures/DefaultTextures.ts";
import {ToolType} from "../ModelMaker.ts";


export class LineData {

    smoothing = 0.1;
    pressure = 0.5
    edge = 0.2
    lineSize = 5;
    uiRadius = 3

    constructor(lineSize: number = 5, uiRadius = 5, edge = 0.2) {
        this.lineSize = lineSize
        this.uiRadius = uiRadius
        this.edge = edge
    }

    copy(lineData: LineData) {
        this.smoothing = lineData.smoothing
        this.pressure = lineData.pressure
        this.edge = lineData.edge
        this.lineSize = lineData.lineSize
        this.uiRadius = lineData.uiRadius
    }
}


export default class Drawing {

    public lineColor = new Color(0.14901960784313725, 0.1357942726389747, 0.12798154555940022, 1)
    lineData = new LineData(5, 5, 0.3)
    private currentLine!: DrawLine;
    private isDrawing: boolean = false;


    private renderer: Renderer;


    private bufferNeedsClearing = true;


    private drawBufferTempPass: DrawBufferTempPass;
    private needsRedraw: boolean = false;
    private project!: Project;
    private copy1: CopyTexturePass;
    private copy2: CopyTexturePass;
    private tool!: ToolType;


    constructor(renderer: Renderer) {
        this.renderer = renderer;

        this.drawBufferTempPass = new DrawBufferTempPass(this.renderer)

        this.copy1 = new CopyTexturePass(renderer)
        this.copy2 = new CopyTexturePass(renderer)
    }

    public saveCurrentProject() {

        if (this.project) {
            this.project.baseTexture =new TextureLoader(this.renderer,"")
            this.project.baseTexture.make()
            this.copy1.setTextures(this.project.baseTexture, this.drawBufferTempPass.colorTarget);
            if (!this.project.fullTexture) {

                this.project.fullTexture =new Texture(this.renderer,"fullTexture",{width:2048,height:2048,usage:GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST|GPUTextureUsage.COPY_SRC | GPUTextureUsage.RENDER_ATTACHMENT});
                this.project.fullTexture.make();

            }
            this.copy2.setTextures(this.project.fullTexture, this.drawBufferTempPass.colorTarget);
            this.renderer.startCommandEncoder(this.setTempToBaseTexture.bind(this))


        }
    }

    setTempToBaseTexture() {
        this.copy1.add();
        if (this.project.fullTexture) {
            this.copy2.add();
        }

    }

    setProject(project: Project) {
       // this.saveCurrentProject()

        this.project = project;
        console.log("makenewTexture")

        this.project = project;
        if (!this.project.loadTexture) {

            if(this.project.isNew){
                console.log("makenewTexture")
                this.project.loadTexture =DefaultTextures.getTransparent(this.renderer) as TextureLoader
                this.drawBufferTempPass.blitMat.setTexture("colorTexture", this.project.loadTexture)
                this.updateDrawing()
            }else{

                console.log("cant be here")




            }

        } else{
            this.drawBufferTempPass.blitMat.setTexture("colorTexture", this.project.loadTexture)
            this.updateDrawing()
        }


        //get the png texture;
        //this.drawBufferTempPass.blitMat.setTexture("colorTexture", thePngTexture)
        //

    }

    draw() {

        if (this.bufferNeedsClearing) {
            //   this.drawBufferClearPass.add();
            this.drawBufferTempPass.add();
            this.bufferNeedsClearing = false;
        }
        if (this.needsRedraw) {
            this.drawBufferTempPass.add();
            this.needsRedraw = false;
        }
        // this.mixPass.add();

    }

    public undoLine() {
        if(this.project.drawLines.length){
            let line = this.project.drawLines.pop() as DrawLine
            line.destroy();
            this.updateDrawing();
        }
    }


    setMouse(mouseLocal: Vector2, pressureIn: number, mouseDown: boolean, mouseUp: boolean) {

        if (!this.project) return;
        if (mouseDown && !UI.needsMouse()) {


            this.currentLine = new DrawLine(this.renderer, this.lineColor)
            this.currentLine.lineSize = this.lineData.lineSize / 1000;
            this.currentLine.smoothing = this.lineData.smoothing;
            this.currentLine.edge = this.lineData.edge;

            if(this.tool==ToolType.Eraser){
                this.currentLine.isEraser =true;

                this.currentLine.uniformGroup.setUniform("color", [1,1,1,1])
                this.currentLine.uniformGroup.update();
            }

            this.project.drawLines.push(this.currentLine);
            this.project.setDirty();
            this.isDrawing = true;
            this.updateDrawing()
        }
        if (this.isDrawing) {
            let size = (this.lineData.lineSize + ((pressureIn - 0.5) * this.lineData.pressure * this.lineData.lineSize)) / 1000;
            this.currentLine.addPoint(mouseLocal.clone(), size);
            this.updateDrawing()
        }
        if (mouseUp) {
            if (this.isDrawing) {

                this.isDrawing = false;
                this.currentLine.addPoint(mouseLocal.clone(), 0.01);
                this.currentLine.makeSmooth()


                this.updateDrawing()

            }
        }
    }

    private updateDrawing() {
        this.project.textureDirty = true;
        this.needsRedraw = true;
        this.drawBufferTempPass.lineRenderer.lines = this.project.drawLines;
    }


    setTool(currentTool: ToolType) {
        this.tool = currentTool;
    }
}
