import Mesh from "../mesh/Mesh.ts";


import Font, { Char } from "./Font.ts"

export default class TextMesh extends Mesh {
    private startX: number = 0;
    private posTemp: Array<number> = []
    private uvTemp: Array<number> = []
    private normalTemp: Array<number> = []
    private indexTemp: Array<number> = []
    private indicesPos: number = 0;
    private startY: number = 0;
    numLines = 0;
    spacing = 1;
    public charCount = 0;
    fontSize: number = 1;
    font!: Font;


    setText(text: string, font: Font, fontSize: number = 0.003, HAlignCenter = false, VAlignCenter = false) {
        this.fontSize = fontSize /= 42
        this.font = font;

        let lines = text.split("\n")
        this.numLines = lines.length;

        this.indicesPos = 0;
        this.charCount = 0;
        this.startY = 0
        if (VAlignCenter) {
            this.startY = -(fontSize * 42 * this.numLines) / 2;
        }


        for (let l of lines) {
            this.startX = 0

            if (HAlignCenter) {
                let w = this.messure(l)
                this.startX = -w / 2;
            }
            this.setLine(l)
            this.startY += fontSize * 42;
        }





        this.setPositions(new Float32Array(this.posTemp))
        this.setNormals(new Float32Array(this.normalTemp))
        this.setUV0(new Float32Array(this.uvTemp))
        this.setIndices(new Uint16Array(this.indexTemp))


        this.posTemp = [];
        this.normalTemp = [];
        this.uvTemp = [];
        this.indexTemp = [];

    }
    messure(text: string) {
        let width = 0
        for (let i = 0; i < text.length; i++) {
            let c = text.charCodeAt(i);
            if (c == 10) {
                width += this.fontSize * 42;
            } else {
                let char = this.font.charArray[c]
                width += char.xadvance * this.fontSize - this.spacing * this.fontSize
            }

        }
        return width
    }
    setLine(text: string) {
        for (let i = 0; i < text.length; i++) {
            let c = text.charCodeAt(i);
            if (c == 32) {
                let char = this.font.charArray[c];
                this.startX += char.xadvance * this.fontSize - this.spacing * this.fontSize
                this.charCount += 2
                continue;
            }
            if (c == 10) {
                this.startY += this.fontSize * 42;
                this.startX = 0
                this.numLines++;
                this.charCount += 2
                continue
            }
            let char = this.font.charArray[c];
            if (char == undefined) {
                console.log("char not found", c, text.charAt(i))
                continue
            }

            this.charCount += 1
            this.addChar(char, this.fontSize);

            //startPos.x += Font.charSize.x;
            //rect.pos = startPos.clone();
        }
    }


    addChar(char: Char, fontSize: number) {



        let posX = this.startX + char.xOffset * fontSize;
        let posY = this.startY + char.yOffset * fontSize;
        //
        //
        //
        // this.startPos.x+=char.

        let centerX = posX + char.w * fontSize * 0.5

        let centerY = this.startY + (fontSize * 42 / 2)

        this.posTemp.push(posX, (posY + char.h * fontSize), 0)
        this.posTemp.push(posX + char.w * fontSize, (posY + char.h * fontSize), 0)
        this.posTemp.push(posX, posY, 0)
        this.posTemp.push(posX + char.w * fontSize, posY, 0)

        this.uvTemp = this.uvTemp.concat(char.uv0.getArray())
        this.uvTemp = this.uvTemp.concat(char.uv1.getArray())
        this.uvTemp = this.uvTemp.concat(char.uv2.getArray())
        this.uvTemp = this.uvTemp.concat(char.uv3.getArray())


        this.normalTemp.push(centerX, centerY, this.charCount);
        this.normalTemp.push(centerX, centerY, this.charCount);
        this.normalTemp.push(centerX, centerY, this.charCount);
        this.normalTemp.push(centerX, centerY, this.charCount);


        this.indexTemp.push(
            this.indicesPos,
            this.indicesPos + 1,
            this.indicesPos + 3
        );
        this.indexTemp.push(
            this.indicesPos,
            this.indicesPos + 3,
            this.indicesPos + 2
        );
        this.indicesPos += 4;

        this.startX += char.xadvance * fontSize - this.spacing * fontSize
    }





}
