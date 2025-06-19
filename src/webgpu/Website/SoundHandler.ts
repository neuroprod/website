
import {Howl} from 'howler';
 class SoundHandler {
    public fxVolume =1;
    private coin!: Howl;
     private step!: Howl;
     private hitFloor!: Howl;
     private wetHit!: Howl;
     private talking!: Howl;
    playSound =true;
     private scroll!: Howl;


    init() {

       // this.fishFood = new Howl({src: ['sound/fishfood.mp3']});
        let talkSound:any={}
        for(let i=0;i<15;i++){
            talkSound["s"+i]=[i*100,100]
        }


        this.talking = new Howl({
            src: ['sound/talking.mp3'],
            sprite:talkSound
        });


        this.coin = new Howl({
            src: ['sound/coins.mp3'],
            sprite: {
                s0: [0, 800],
                s1: [1000, 800],
                s2: [2000, 800],
                s3: [3000, 800],


            }
        });

        this.wetHit = new Howl({
            src: ['sound/wetHit.mp3'],
            sprite: {
                s0: [0, 400],
                s1: [400, 400],
                s2: [800, 400],
                s3: [1200, 400],


            }
        });
        this.step = new Howl({
            src: ['sound/step.mp3'],
            sprite: {
                s0: [0, 90],
                s1: [100, 90],
                s2: [200, 90],
                s3: [300, 90],
                s4: [400, 90],
                s5: [500, 90],
                s6: [600, 90],
                s7: [700, 90],
                s8: [800, 90],
                s9: [900, 90],



            }
        });

        this.hitFloor = new Howl({
            src: ['sound/step.mp3'],
            sprite: {
                s0: [0, 90],
                s1: [100, 90],
                s2: [200, 90],
                s3: [300, 90],
                s4: [400, 90],
                s5: [500, 90],
                s6: [600, 90],
                s7: [700, 90],
                s8: [800, 90],
                s9: [900, 90],



            }
        });


        this.scroll = new Howl({
            src: ['sound/scroll.mp3'],
            sprite: {
                s0: [0, 3000],
                s1: [3000, 3000],
                s2: [6000, 3000],
                s3: [9000, 3000],


            }
        });

    }





    playCoin() {
if(!this.playSound) return

        let s = Math.floor(Math.random() * 1000) % 4;

        this.coin.volume( this.fxVolume);
        this.coin.play("s" + s)

    }

     playWetHit(hit:boolean) {
         if(!this.playSound) return

         let s = Math.floor(Math.random() * 4) ;

        let vol =0.1
         if(hit)vol=1;
         this.wetHit.volume( this.fxVolume*vol);
         this.wetHit.play("s" + s)

     }


     playStep() {

         if(!this.playSound) return
         let s = Math.floor(Math.random() * 1000) % 9;

         this.step.volume( this.fxVolume*0.1);
         this.step.play("s" + s)

     }
     playHitFloor(strength:number) {

         if(!this.playSound) return
         let s = Math.floor(Math.random() * 1000) % 9;

         this.hitFloor.volume( this.fxVolume);
         this.hitFloor.play("s" + s)

     }



     playTalking() {

         if(!this.playSound) return
         let s = Math.floor(Math.random() * 1000) % 4;

         this.talking.volume( this.fxVolume*0.1);
         this.talking.play("s" + s)

     }


     playScroll(xPos:number,vol:number) {

         if(!this.playSound) return
         let s = Math.floor(Math.random() * 1000) % 4;
         this.scroll.pos(xPos, 0, -0.5);

         this.scroll.volume( this.fxVolume*vol);
         this.scroll.play("s" + s)

     }

}
export default new SoundHandler()
