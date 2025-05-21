import Mesh from "../mesh/Mesh.ts";


import Font, {Char} from "./Font.ts"

export default class TextMesh extends Mesh{
    private startX: number =0;
    private posTemp:Array<number> =[]
    private uvTemp:Array<number> =[]
    private normalTemp:Array<number> =[]
    private indexTemp:Array<number> =[]
    private indicesPos: number=0;
    private startY: number=0;
    numLines =0;
    spacing =1;
    public charCount=0;
    setText(text: string,font:Font,fontSize:number=0.003){
        fontSize/=42
        console.log(font)
        this.startX =0;
        this.startY =0;
        this.indicesPos =0;
        this.numLines =1;
        this.charCount =0;
        for (let i = 0; i < text.length; i++) {
            let c = text.charCodeAt(i);
            if(c==32){
                let char =font.charArray[c];
                this.startX +=char.xadvance*fontSize -this.spacing*fontSize
                this.charCount+=2
                continue;
            }
            if(c==10){
                this.startY+=fontSize*42;
                this.startX =0
                this.numLines ++;
                this.charCount+=2
                continue
            }
            let char =font.charArray[c];
            if(char ==undefined){
                console.log("char not found",c,text.charAt(i))
                continue
            }

            this.charCount+=1
            this.addChar( char,fontSize);

            //startPos.x += Font.charSize.x;
            //rect.pos = startPos.clone();
        }

        this.setPositions(new Float32Array(this.posTemp))
        this.setNormals(new Float32Array(this.normalTemp))
        this.setUV0(new Float32Array(this.uvTemp))
        this.setIndices(new Uint16Array(this.indexTemp))


        this.posTemp =[];
        this.normalTemp =[];
        this.uvTemp =[];
        this.indexTemp =[];

    }


    addChar( char: Char,fontSize:number) {



        let posX = this.startX +char.xOffset*fontSize;
        let posY =  this.startY+char.yOffset*fontSize;
        //
        //
        //
        // this.startPos.x+=char.

        let centerX= posX+char.w*fontSize*0.5
        let centerY=this.startY+42*fontSize*0.5

        this.posTemp.push(posX,(posY+char.h*fontSize ),0)
        this.posTemp.push(posX+char.w*fontSize,(posY+char.h*fontSize),0)
        this.posTemp.push(posX,posY,0)
        this.posTemp.push(posX+char.w*fontSize,posY,0)

        this.uvTemp = this.uvTemp.concat( char.uv0.getArray())
        this.uvTemp = this.uvTemp.concat( char.uv1.getArray())
        this.uvTemp = this.uvTemp.concat( char.uv2.getArray())
        this.uvTemp = this.uvTemp.concat( char.uv3.getArray())


        this.normalTemp.push(centerX,centerY, this.charCount);
        this.normalTemp.push(centerX,centerY, this.charCount);
        this.normalTemp.push(centerX,centerY, this.charCount);
        this.normalTemp.push(centerX,centerY, this.charCount);


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

        this.startX+=char.xadvance*fontSize -this.spacing*fontSize
    }





}
