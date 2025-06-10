import Mesh from "../lib/mesh/Mesh.ts";


import Font, {Char} from "../data/Font.ts";
export enum HAlign {
    Right,
    Center,
    Left

}

export enum VAlign {
    Top,
    Center,
    Bottom

}
export default class FontMesh extends Mesh{
    private startX: number =0;
    private startY: number =0;
    private centerArr:Array<number> =[]
    private posTemp:Array<number> =[]
    private uvTemp:Array<number> =[]
    private normalTemp:Array<number> =[]
    private indexTemp:Array<number> =[]
    private indicesPos: number=0;

    setText(text: string, font: Font,fontSpacing =-1, fontSize = 0.0021, hAligh: HAlign = HAlign.Left, vAligh: VAlign = VAlign.Top) {

        this.indicesPos = 0;
        let textArr = text.split("\n")
        let fontHeight = fontSize * 45;
        let numLines = textArr.length

        this.startY = 0;

        if (vAligh == VAlign.Bottom) {
            this.startY = -(fontHeight * numLines);//-fontSize;
        }
        if (vAligh == VAlign.Center) {
            this.startY = -(fontHeight * numLines) / 2;
        }

        this.startX = 0;


        for (let i = 0; i < numLines; i++) {
            this.addLine(textArr[i], font, fontSpacing,fontSize, hAligh)
            this.startY += fontHeight;

        }
        this.setPositions(new Float32Array(this.posTemp))
        this.setAttribute("aCenter",new Float32Array(this.centerArr))
        this.setNormals(new Float32Array(this.normalTemp))
        this.setUV0(new Float32Array(this.uvTemp))
        this.setIndices(new Uint16Array(this.indexTemp))


        this.posTemp =[];
        this.normalTemp =[];
        this.uvTemp =[];
        this.indexTemp =[];
        this.centerArr =[];

    }

    addLine(line: string, font: Font,fontSpacing:number, fontSize: number, hAligh: HAlign) {

        this.startX =0;


        if (hAligh == HAlign.Center) {
            let lineSize = this.getLineSize(line, font,fontSpacing, fontSize);
            this.startX = -lineSize / 2
        }
        if (hAligh == HAlign.Right) {
            let lineSize = this.getLineSize(line, font,fontSpacing, fontSize);
            this.startX = -lineSize
        }

        for (let i = 0; i < line.length; i++) {
            let c = line.charCodeAt(i);
            let char = font.charArray[c];

            this.addChar(char, fontSpacing,fontSize);

        }

    }
    getLineSize(line: string, font: Font,fontSpacing:number, fontSize: number) {
        let size = 0
        for (let i = 0; i < line.length; i++) {
            let c = line.charCodeAt(i);
            let char = font.charArray[c];
            size += char.xadvance * fontSize+fontSpacing*fontSize;

        }
        return size;

    }
    addChar( char: Char,fontSpacing:number,fontSize:number) {



        let posX = this.startX + char.xOffset * fontSize;
        let posY = this.startY + char.yOffset * fontSize;
        //
        //
        //
        // this.startPos.x+=char.
        this.centerArr.push(posX+char.h*fontSize,-posY,0);
        this.centerArr.push(posX+char.h*fontSize,-posY,0);
        this.centerArr.push(posX+char.h*fontSize,-posY,0);
        this.centerArr.push(posX+char.h*fontSize,-posY,0);

        this.posTemp.push(posX,(posY+char.h*fontSize )*-1,0)
        this.posTemp.push(posX+char.w*fontSize,(posY+char.h*fontSize)*-1,0)
        this.posTemp.push(posX,posY*-1,0)
        this.posTemp.push(posX+char.w*fontSize,posY*-1,0)

        this.uvTemp = this.uvTemp.concat( char.uv0.getArray())
        this.uvTemp = this.uvTemp.concat( char.uv1.getArray())
        this.uvTemp = this.uvTemp.concat( char.uv2.getArray())
        this.uvTemp = this.uvTemp.concat( char.uv3.getArray())


        this.normalTemp.push(0,0,1)
        this.normalTemp.push(0,0,1)
        this.normalTemp.push(0,0,1)
        this.normalTemp.push(0,0,1)


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

        this.startX+=char.xadvance*fontSize +fontSpacing*fontSize
    }





}
