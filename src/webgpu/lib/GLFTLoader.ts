import Renderer from "./Renderer.ts";
import Object3D from "./model/Object3D.ts";
import Model from "./model/Model.ts";
import Mesh from "./mesh/Mesh.ts";
import PreLoader from "./PreLoader.ts";
import {Matrix4, Quaternion, Vector3} from "@math.gl/core";


type Accessor = {
    accessor: any;
    bufferView: any;
}
type ModelData = {
    model: Model;
    meshID: number;
    skinID: number
}


export default class GLFTLoader {
    public root: Object3D;
    public models: Array<Model> = []

    public modelsByName: { [name: string]: Model } = {};

    public modelData: Array<ModelData> = [];

    public objects: Array<Object3D> = []
    public objectsByID: { [id: number]: Object3D } = {};
    public objectsByName: { [name: string]: Object3D } = {};

    public meshes: Array<Mesh> = []
    public animations: Array<Animation> = []

    private meshBuffer!: SharedArrayBuffer | ArrayBuffer;
    private byteLength: any;
    private json: any;
    private accessors: Array<Accessor> = []
    private renderer: Renderer;

    private url: string;





    constructor(renderer: Renderer, url: string, preLoader: PreLoader) {
        this.renderer = renderer;

        this.root = new Object3D(renderer, "sceneRoot");

        this.url = url;
        preLoader.startLoad();
        this.loadURL(url).then(() => {
            preLoader.stopLoad();
        });

    }

    async loadURL(url: any) {

        const responseBuffer = await fetch(url + ".bin")

        this.meshBuffer = await responseBuffer.arrayBuffer();

        const response = await fetch(url + ".json")

        let text = await response.text()
        this.json = JSON.parse(text)

        // this.makeBuffer()
        // console.log(this.json)


            this.parseAccessors()
            this.parseMeshes();
            this.parseScene();

            this.makeModels();


        this.json = null;
    }

    toMatrixData(f: Float32Array) {

        let v = [];
        for (let i = 0; i < f.length; i += 16) {
            let m = new Matrix4()
            for (let j = 0; j < 16; j++) {
                m[j] = f[i + j]
            }
            v.push(m)
        }
        return v;
    }

    toVector3Array(f: Float32Array) {

        let v = [];
        for (let i = 0; i < f.length; i += 3) {
            v.push(new Vector3(f[i], f[i + 1], f[i + 2]))
        }
        return v;
    }

    toQuaternionArray(f: Float32Array) {
        let v = [];
        for (let i = 0; i < f.length; i += 4) {
            v.push(new Quaternion(f[i], f[i + 1], f[i + 2], f[i + 3]))
        }
        return v;
    }

    private makeModels() {

    }






    private addNodesToObject(parent: Object3D, nodes: Array<number>) {
        for (let nodeID of nodes) {

            let nodeData = this.json.nodes[nodeID];
            let node;
            if (nodeData.mesh != undefined) {


                node = new Model(this.renderer, nodeData.name)
                this.modelData.push({model: node, skinID: nodeData.skin, meshID: nodeData.mesh})

                this.modelsByName[node.label] = node;
            } else {
                node = new Object3D(this.renderer, nodeData.name)
            }

            this.objectsByID[nodeID] = node;
            this.objects.push(node);
            this.objectsByName[node.label] = node;
            parent.addChild(node);
            let translation = nodeData.translation;
            if (translation) {
                node.setPosition(translation[0], translation[1], translation[2])

            }

            let scale = nodeData.scale
            if (scale) {
                node.setScale(scale[0], scale[1], scale[2])
            }
            let rotation = nodeData.rotation
            if (rotation) {
                node.setRotation(rotation[0], rotation[1], rotation[2], rotation[3])
            }
            if (nodeData.children) {

                this.addNodesToObject(node, nodeData.children)
            }
        }

    }

    private parseScene() {

        let sceneData = this.json.scenes[0]

        this.addNodesToObject(this.root, sceneData.nodes);

    }

    private parseAccessors() {
        for (let accessor of this.json.accessors) {

            let bufferView = this.json.bufferViews[accessor.bufferView];

            this.accessors.push({accessor: accessor, bufferView: bufferView});
        }
    }

    private parseMeshes() {

        for (let m of this.json.meshes) {
            let primitive = m.primitives[0];


            let mesh = new Mesh(this.renderer, m.name);

                //5126 float
                //5123 ushort
                //5125  uint
                //5121 ubyte
                let accessorIndices = this.accessors[primitive.indices]
                let indexData = this.getSlize(accessorIndices);
                let indices;
                if (accessorIndices.accessor.componentType == 5123) {
                    indices = new Uint16Array(indexData);

                    mesh.setIndices(indices)


                } else if (accessorIndices.accessor.componentType == 5125) {
                    indices = new Uint32Array(indexData);
                    mesh.setIndices32(indices)
                }


                //POSITION, NORMAL TANGENT TEXCOORD_0,....
                let posAccessor = this.accessors[primitive.attributes.POSITION];

                let positionData = this.getSlize(posAccessor);
                let floatPos = new Float32Array(positionData)


                mesh.setPositions(floatPos);


                let normalAccessor = this.accessors[primitive.attributes.NORMAL];
                let normalData = this.getSlize(normalAccessor);
                mesh.setNormals(new Float32Array(normalData));

                let uv0Accessor = this.accessors[primitive.attributes.TEXCOORD_0];
                let uv0Data = this.getSlize(uv0Accessor);
                mesh.setUV0(new Float32Array(uv0Data));

                if (primitive.attributes.TANGENT) {
                    let tangentAccessor = this.accessors[primitive.attributes.TANGENT];
                    let tangentData = this.getSlize(tangentAccessor);
                    mesh.setTangents(new Float32Array(tangentData));
                } else {
                    //  console.warn("no tangent for mesh", m.name)
                }

                if (primitive.attributes.WEIGHTS_0) {
                    let weightAccessor = this.accessors[primitive.attributes.WEIGHTS_0];
                    let weightData = this.getSlize(weightAccessor); //bytes

                    mesh.setWeights(new Float32Array(weightData));

                }
                if (primitive.attributes.JOINTS_0) {
                    let jointAccessor = this.accessors[primitive.attributes.JOINTS_0];
                    let jointData = this.getSlize(jointAccessor);
                    let data = new Uint32Array(new Int8Array(jointData));
                    mesh.setJoints(data);
                }

            this.meshes.push(mesh);


        }
    }

    private getSlize(accessor: any) {
        let byteLength = accessor.bufferView.byteLength
        let byteOffset = accessor.bufferView.byteOffset
        let buffer = accessor.bufferView.buffer
        return this.meshBuffer.slice(byteOffset, byteOffset + byteLength);
    }




}
