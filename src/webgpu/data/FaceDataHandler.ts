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
        this.faceData.push(data)
        this.saveFaceData()

    }
    saveFaceData() {
        let dataString = JSON.stringify(this.faceData)

        saveFace("saveData", dataString)
    }

}
export default new FaceDataHandler()
