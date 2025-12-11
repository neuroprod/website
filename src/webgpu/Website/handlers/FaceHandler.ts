import FaceDataHandler from "../../data/FaceDataHandler";
import SceneObject3D from "../../data/SceneObject3D";
import Object3D from "../../lib/model/Object3D";
import { saveFace } from "../../lib/SaveUtils";
import SelectItem from "../../lib/UI/math/SelectItem";
import UI from "../../lib/UI/UI";
import gsap from "gsap";
export default class FaceHandler {


    intrests = ["pupil", "brow", "mouth"];

    private objects: Array<Object3D> = []
    name: string;
    groups: { label: string; objects: Object3D[]; }[];
    data: Array<any> = [];
    selectItems: Array<SelectItem> = []

    countID = 0;
    statename: string = "";
    tween: boolean = false;

    constructor(char: SceneObject3D) {

        this.name = char.label
        this.findObjects(char)

        this.groups = this.intrests.map(sub => ({
            label: sub,
            objects: this.objects.filter(item =>
                item.label.toLowerCase().includes(sub.toLowerCase())
            ),
        }));
        this.data = FaceDataHandler.getDataForLabel(this.name)
        this.updateSelect()
    }
    onUI() {
        if (this.tween) return
        UI.pushGroup(this.name)
        UI.pushID(this.countID + "");
        if (this.selectItems.length) {
            let a = UI.LSelect("states", this.selectItems, 0)
            if (UI.LButton("set")) {
                this.setState(a)
                UI.popID()
                this.countID++
                UI.pushID(this.countID + "");
            }
        }

        let state = UI.LTextInput("state", this.statename)
        if (UI.LButton("save")) {
            if (state == "") {

                UI.logEvent("error", "fill in state", true)
                return;
            }
            let data = this.getFaceData(state)


            FaceDataHandler.addFaceData(data)

            this.data = FaceDataHandler.getDataForLabel(this.name)
            this.updateSelect()
            this.countID++

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
        UI.popID()
        UI.popGroup()


    }
    setState(state: string) {

        let tl = gsap.timeline();
        this.countID++
        let s = this.getStateByName(state)
        this.statename = s.state;
        this.tween = true
        for (let prop of s.props) {
            let obj = this.getObjectByID(prop.id) as SceneObject3D
            if (obj) {
                gsap.killTweensOf(obj)

                if (prop.x) {
                    gsap.to(obj, { x: prop.x, ease: "power2.out", duration: 0.5 })
                    // obj.x = prop.x

                }
                if (prop.y) {
                    gsap.to(obj, { y: prop.y, ease: "power2.out", duration: 0.5 })
                    // obj.y = prop.y
                }
                if (prop.rz) {
                    gsap.to(obj, { rz: prop.rz, ease: "power2.out", duration: 0.5 })
                    // obj.rz = prop.rz
                }

            }

        }

        setTimeout(() => { this.tween = false }, 500)
    }
    getObjectByID(id: string) {
        for (let f of this.objects) {

            if (f.UUID == id) {

                return f
            }
        }
        return undefined
    }
    getStateByName(state: string) {
        for (let f of this.data) {

            if (f.state == state) {

                return f
            }
        }
    }
    updateSelect() {

        this.selectItems = []
        for (let f of this.data) {
            this.selectItems.push(new SelectItem(f.state, f.state))
        }

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