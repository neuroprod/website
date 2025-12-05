import TextBalloonHandler from "./TextBalloonHandler.ts";


import Renderer from "../../lib/Renderer.ts";
import SceneHandler from "../../data/SceneHandler.ts";
import GameModel from "../GameModel.ts";
import gsap from "gsap";
export default class ConversationHandler {
    textReady: boolean = false;
    private textBalloonHandler: TextBalloonHandler;
    private dataArr!: any;
    private renderer: Renderer;
    private dataIndex: number = 0;
    private currentData!: any;
    private isChoice!: boolean;
    private choiceIndex: number = 0;
    private numChoices = 0;
    public replaceMap: Map<string, string> = new Map()
    isDone: boolean = false;
    doneCallBack!: () => void;
    dataCallBack!: (data: string) => void;
    private data: any;
    tl!: gsap.core.Timeline;
    constructor(renderer: Renderer, textBalloonHandler: TextBalloonHandler) {
        this.renderer = renderer;
        this.textBalloonHandler = textBalloonHandler;
        this.data = GameModel.gameCopy
    }
    setSingleSentence(id: string) {


        this.dataArr = this.getCopyData(id);

        this.dataIndex = 0
        this.isChoice = false;
        this.isDone = true
        this.setText();


    }
    startConversation(id: string) {


        this.dataArr = this.getCopyData(id);

        this.dataIndex = 0
        this.isChoice = false;
        this.isDone = false;
        this.setText();


    }

    setText() {

        if (this.dataArr.length == this.dataIndex) {

            return true;
        }



        let data = this.dataArr[this.dataIndex]

        if (data.char && data.pos) {
            let m = SceneHandler.getSceneObject(data.char);

            this.textBalloonHandler.setModel(m, data.pos)

        }
        this.currentData = data;

        if (this.currentData.choice) {
            this.setChoice()
        } else {

            let delay = 0

            if (this.currentData.delay) delay = this.currentData.delay;

            this.displayText(data.text, 0, 0, delay)
            this.dataIndex++;
        }


        return false

    }

    displayText(text: string, numAnswers: number, currentAnswer: number, delay = 0) {

        this.textReady = false
        if (this.tl) this.tl.clear()


        this.tl = gsap.timeline()
        if (delay != 0) {
            this.textBalloonHandler.hideText()
            this.tl.call(() => { this.textBalloonHandler.setText(this.replace(text), numAnswers, currentAnswer) }, [], delay)
        }
        else {
            this.textBalloonHandler.setText(this.replace(text), numAnswers, currentAnswer)
        }


        this.tl.call(() => { this.textReady = true }, [], delay + 0.5)


    }


    getCopyData(id: string) {

        for (let data of this.data) {
            if (data && data.name == id) return data.data
        }

    }

    setInput(hInput: number, jump: boolean) {

        if (!this.textReady) {
            return;

        }
        if (this.isChoice) {

            let s = 0;
            if (hInput > 0) {
                s = 1
            } else if (hInput < 0) {
                s = -1
            }

            if (s != 0) {

                this.choiceIndex += s;
                this.choiceIndex = ((this.choiceIndex % this.numChoices) + this.numChoices) % this.numChoices;

                let text = this.currentData.choice[this.choiceIndex].text;
                this.displayText(text, this.numChoices, this.choiceIndex)

            } else if (jump) {

                this.setCallBack(this.currentData.choice[this.choiceIndex].callBack)
                if (this.currentData.choice[this.choiceIndex].callText) {

                    this.startConversation(this.currentData.choice[this.choiceIndex].callText)
                } else {
                    // this.setCallBack(this.currentData.choice[this.choiceIndex].callBack)
                    this.setDone();
                }


            }

            return;
        }

        if (jump) {
            this.setCallBack(this.currentData.callBack)
            if (this.setText()) this.setDone()
        }


    }
    replace(input: string) {

        return input.replace(/#(\w+)/g, (_, $1) => {
            return this.replaceMap.get($1) as string
        })
    }
    public setCallBack(data: string | undefined) {

        if (this.dataCallBack && data) this.dataCallBack(data)
    }

    setChoice() {
        this.isChoice = true;
        this.choiceIndex = 0;
        this.numChoices = this.currentData.choice.length;
        let text = this.currentData.choice[this.choiceIndex].text;


        this.displayText(text, this.numChoices, this.choiceIndex)

    }

    private setDone() {
        this.isDone = true;
        this.textReady = false;
        this.textBalloonHandler.hideText()
        this.doneCallBack()
    }
}
