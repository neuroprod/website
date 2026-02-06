import JsonLoader from "../lib/JsonLoader"
import PreLoader from "../lib/PreLoader"
import { saveFace } from "../lib/SaveUtils"

class FaceDataHandler {



    private faceData: Array<any> = []
    constructor() {

    }
    init(preloader: PreLoader) {
        preloader.startLoad()

        this.loadFile("chars/saveData").then(() => {
            preloader.stopLoad()

        });
    }

    async loadFile(file: string) {

        const response = await fetch("./" + file + ".json")

        let text = await response.text();

        this.faceData = JSON.parse(text);

     

    }
    getDataForLabel(name: string): any {

        let data = []
        for (let d of this.faceData) {
            if (d.name == name) {
                data.push(d)
            }
        }
        return data;
    }

    addFaceData(data: any) {

        for (let i = 0; i < this.faceData.length; i++) {
            if (this.faceData[i].name == data.name && this.faceData[i].state == data.state) {
                this.faceData[i] = data;
                this.saveFaceData()
                return;
            }

        }
        this.faceData.push(data)
        this.saveFaceData()

    }
    saveFaceData() {
        let dataString = JSON.stringify(this.faceData)

        saveFace("saveData", dataString)
    }

}
export default new FaceDataHandler()
