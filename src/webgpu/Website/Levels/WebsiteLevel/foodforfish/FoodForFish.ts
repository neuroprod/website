import PhysX from "physx-js-webidl";
import Timer from "../../../../lib/Timer.ts";
import GameModel from "../../../GameModel.ts";
import Model from "../../../../lib/model/Model.ts";
import GBufferMaterial from "../../../../render/GBuffer/GBufferMaterial.ts";
import Box from "../../../../lib/mesh/geometry/Box.ts";
import ShadowDepthMaterial from "../../../../render/shadow/ShadowDepthMaterial.ts";
import SceneObject3D from "../../../../data/SceneObject3D.ts";
import gsap from "gsap";
import {Vector3} from "@math.gl/core";
export default class FoodForFish{
    private scene!: PhysX.PxScene;
    private boxes: Array<PhysX.PxRigidDynamic>=[];
    private boxModels: Array<Model>=[];
    private boxModels2: Array<Model>=[];
    private numBoxes =50
    private sx =1.2*0.8
    private sy =0.27*0.8
    private sz =0.05
    private nextTime =3;
    private burpTL!: gsap.core.Timeline;
    private mouth!: SceneObject3D;
    private logo!: SceneObject3D;

    private logoIn =new Vector3(0.23,0.11,0)
    private logoOut =new Vector3(0.1,0.13,0)
    private logoHalf:Vector3 = this.logoIn.clone().add(this.logoOut).scale(0.5)
    private boxIndex=0;
    private numShootBoxes =0
    private root!: SceneObject3D;
   private tmpPose!:PhysX.PxTransform;
    private shootVec!: PhysX.PxVec3;
    private firstCount =10;
    constructor() {
        PhysX().then((PhysX) =>{
            let version = PhysX.PHYSICS_VERSION;

            var allocator = new PhysX.PxDefaultAllocator();
            var errorCb = new PhysX.PxDefaultErrorCallback();
            var foundation = PhysX.CreateFoundation(version, allocator, errorCb);

            var tolerances = new PhysX.PxTolerancesScale();
            var physics = PhysX.CreatePhysics(version, foundation, tolerances);

            // create scene
            var tmpVec = new PhysX.PxVec3(0, -9.81, 0);
            var sceneDesc = new PhysX.PxSceneDesc(tolerances);
            sceneDesc.gravity =tmpVec;
            sceneDesc.cpuDispatcher =(PhysX.DefaultCpuDispatcherCreate(0));
            sceneDesc.filterShader  =(PhysX.DefaultFilterShader());
            this.scene = physics.createScene(sceneDesc);


            // create a default material
            var material = physics.createMaterial(0.5, 0.5, 0.5);
            // create default simulation shape flags
            var shapeFlags = new PhysX.PxShapeFlags(PhysX.PxShapeFlagEnum.eSCENE_QUERY_SHAPE | PhysX.PxShapeFlagEnum.eSIMULATION_SHAPE |  PhysX.PxShapeFlagEnum.eVISUALIZATION);

            // create a few temporary objects used during setup
            var tmpPose = new PhysX.PxTransform(PhysX.PxIDENTITYEnum.PxIdentity);
            var tmpFilterData = new PhysX.PxFilterData(1, 1, 0, 0);
            tmpVec.y =-0.95

            tmpPose.p =tmpVec;
            // create a large static box with size 20x1x20 as ground
            var groundGeometry = new PhysX.PxBoxGeometry(100, 1, 10);   // PxBoxGeometry uses half-sizes
            var groundShape = physics.createShape(groundGeometry, material, true, shapeFlags);
            var ground = physics.createRigidStatic(tmpPose);


            groundShape.setSimulationFilterData(tmpFilterData);
            ground.attachShape(groundShape);
            this.scene.addActor(ground);

            // create a few dynamic boxes with size 1x1x1, which will fall on the ground
            var boxGeometry = new PhysX.PxBoxGeometry(this.sx, this.sy, this.sz);

                var lastBox = null;
            for (var y = 0; y < this.numBoxes; y++) {
                tmpVec.x =Math.random()+15; tmpVec.y =y*0.4 + 5; tmpVec.z =Math.random();
                tmpPose.p =tmpVec;
                var boxShape = physics.createShape(boxGeometry, material, true, shapeFlags);
                var box = physics.createRigidDynamic(tmpPose);
                tmpVec.x =-10; tmpVec.y =0; tmpVec.z =0;
                box.setLinearVelocity( tmpVec)
                boxShape.setSimulationFilterData(tmpFilterData);
                box.attachShape(boxShape);

              // this.scene.addActor(box);

                this.boxes.push(box)
            }

            // clean up temp objects
            PhysX.destroy(groundGeometry);
            PhysX.destroy(boxGeometry);
            PhysX.destroy(tmpFilterData);
            PhysX.destroy(tmpPose);
            PhysX.destroy(tmpVec);
            PhysX.destroy(shapeFlags);
            PhysX.destroy(sceneDesc);
            PhysX.destroy(tolerances);


            this.tmpPose = new PhysX.PxTransform(PhysX.PxIDENTITYEnum.PxIdentity);
            this.shootVec = new PhysX.PxVec3(-10, 2, 0);
            console.log('Created scene objects');

        });
    }

    init(root: SceneObject3D, logo: SceneObject3D, mouth: SceneObject3D){
        this.boxModels =[]
        this.root =root;
this.mouth =mouth;
        this.logo =logo;
       let mat = new GBufferMaterial(GameModel.renderer,"boxMaterial")
        let matShadow = new ShadowDepthMaterial(GameModel.renderer,"boxShadow")
        let mesh =new Box(GameModel.renderer,{width:this.sx/5,height:this.sy/5,depth:this.sz/5})
        for(let i=0;i<this.numBoxes;i++){

           /* let b =new Model(GameModel.renderer,"box")
            b.material = mat
            b.setMaterial("shadow",matShadow)
            b.mesh =mesh*:

          //  GameModel.gameRenderer.addModel(b)
           // GameModel.gameRenderer.shadowMapPass.modelRenderer.addModel(b)
            this.boxModels.push(b)
*/
            if( logo.model){

                let b2 =new Model(GameModel.renderer,"box")
                b2.material =  logo.model.material
                b2.setMaterial("shadow",matShadow)
                b2.mesh = logo.model.mesh;
                this.boxModels2.push( b2)


               // GameModel.gameRenderer.addModel(b2)
             // GameModel.gameRenderer.shadowMapPass.modelRenderer.addModel(b2)
            }


        }

    }

    update(){
        this.scene.simulate(Timer.delta);
        this.scene.fetchResults(true);
        this.nextTime-=Timer.delta

        if(this.firstCount>0){
            if(Timer.frame%60==0){
                this.shoot()
                this.firstCount--;
            }
        }

        if(this.nextTime<0){
            this.nextTime=12
            this.burp()
        }

        for(let i =0;i<this.numShootBoxes;i++){
           // this.setBox(this.boxes[i],this.boxModels[i])
            this.setBox(this.boxes[i],this.boxModels2[i])
        }

    }

    private setBox(box: PhysX.PxRigidDynamic, model: Model) {
        let p =box.getGlobalPose().p;
        let q = box.getGlobalPose().q;
        model.x = p.x*0.1
        model.y = p.y*0.1
        model.z = p.z*0.1
        model.setRotation(q.x,q.y,q.z,q.w)

    }

    private burp() {
        if(this.burpTL)this.burpTL.clear()
        this.logo.show()
        this.logo.x=this.logoIn.x
        this.logo.y =this.logoIn.y
        this.burpTL = gsap.timeline()
        this.burpTL.to(this.mouth,{rz:1},0)
        this.burpTL.to(this.logo,{x:this.logoOut.x,y:this.logoOut.y,ease:"power2.inOut",duration:1},0.1)
        this.burpTL.to(this.logo,{x:this.logoHalf.x,y:this.logoHalf.y,ease:"power2.inOut",duration:2})
        this.burpTL.to(this.logo,{x:this.logoOut.x,y:this.logoOut.y,ease:"power2.inOut",duration:2})
        this.burpTL.to(this.logo,{x:this.logoHalf.x,y:this.logoHalf.y,ease:"power2.inOut",duration:2})

        this.burpTL.call(()=>{this.shoot()},[],"<")
        this.burpTL.to(this.mouth,{rz:0.0},"<0.5")



    }
    private shoot(){
this.logo.hide()
        this.numShootBoxes ++;
        let b = this.boxModels2[this.boxIndex]
        this.root.addChild(b);
        GameModel.gameRenderer.addModel(b)
        GameModel.gameRenderer.shadowMapPass.modelRenderer.addModel(b)
        let box =this.boxes[this.boxIndex];
        this.tmpPose.p.x =this.logoHalf.x*10
        this.tmpPose.p.y =this.logoHalf.y*10
        this.tmpPose.p.z =this.logoHalf.z*10
        this.tmpPose.q.z=-0.1
        box.setGlobalPose(this.tmpPose)
        this.shootVec.z =(Math.random()-0.5)*0.1
        this.shootVec.x =(Math.random()*10+2)*-1
        this.shootVec.y =2+Math.random();
        box.setLinearVelocity( this.shootVec)
        this.shootVec.z =(Math.random()-0.5)*0.3
        this.shootVec.x =(Math.random()-0.5)*0.3
        this.shootVec.y =(Math.random()-0.5)*0.3

        box.setAngularVelocity( this.shootVec)
        this.scene.addActor(box);


        this.boxIndex++;

    }
}
