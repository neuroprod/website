import SceneObject3D from "../../data/SceneObject3D";
import Object3D from "../../lib/model/Object3D";
import { saveFace } from "../../lib/SaveUtils";
import UI from "../../lib/UI/UI";

export default class FaceHandler {


    intrests = ["pupil", "brow", "mouth"];

    private objects: Array<Object3D> = []
    name: string;
    groups: { label: string; objects: Object3D[]; }[];

    constructor(char: SceneObject3D) {

        this.name = char.label
        this.findObjects(char)

        this.groups = this.intrests.map(sub => ({
            label: sub,
            objects: this.objects.filter(item =>
                item.label.toLowerCase().includes(sub.toLowerCase())
            ),
        }));


    }
    onUI() {

        UI.pushGroup(this.name)
        let state = UI.LTextInput("state", "")
        if (UI.LButton("save")) {
            if (state == "") {

                UI.logEvent("error", "fill in state", true)
                return;
            }
            let data = this.getFaceData(state)
            console.log(data)
            // saveFace( this.name, this.getFaceData(state))
        }
        for (let g of this.groups) {
            UI.pushGroup(g.label)

            if (g.label == "pupil") {
                for (let ob of g.objects) {
                    UI.floatPrecision = 4
                    ob.x = UI.LFloat(ob.label + "_x", ob.x, ob.label + "_x");
                    ob.y = UI.LFloat(ob.label + "_y", ob.y, ob.label + "_y");

                }
            }
            if (g.label == "brow") {
                for (let ob of g.objects) {
                    UI.floatPrecision = 4
                    ob.x = UI.LFloat(ob.label + "_x", ob.x, ob.label + "_x");
                    ob.y = UI.LFloat(ob.label + "_y", ob.y, ob.label + "_y");
                    UI.floatPrecision = 2
                    ob.rz = UI.LFloat(ob.label + "_rz", ob.rz, ob.label + "_rz");

                }
            }



            UI.popGroup()

        }
        UI.popGroup()


    }
    getFaceData(state: string): any {

        let data = { name: this.name, state: state, props: new Array<any>() }


        for (let g of this.groups) {


            if (g.label == "pupil") {
                for (let ob of g.objects) {
                    let propObj = { label: ob.label, id: ob.UUID, x: ob.x, y: ob.y }
                    data.props.push(propObj)

                }
            }
            if (g.label == "brow") {
                for (let ob of g.objects) {

                    let propObj = { label: ob.label, id: ob.UUID, x: ob.x, y: ob.y, rz: ob.rz }
                    data.props.push(propObj)
                }
            }





        }
        return data;
    }
    findObjects(obj: Object3D) {



        const hasMatch = this.intrests.some(sub => obj.label.includes(sub));
        if (hasMatch) {

            this.objects.push(obj)
        }
        for (let f of obj.children) {

            this.findObjects(f)
        }
    }




}