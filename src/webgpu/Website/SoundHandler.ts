
import { Howl } from 'howler';
class SoundHandler {
    public fxVolume = 1;
    private coin!: Howl;
    private step!: Howl;
    private hitFloor!: Howl;
    private wetHit!: Howl;
    private talking!: Howl;
    playSound = true;
    private scroll!: Howl;
    private drip!: Howl;
    bgSounds: Array<Howl> = [];
    private fart!: Howl;
    private fartCount: number = -1;


    init() {

        // this.fishFood = new Howl({src: ['sound/fishfood.mp3']});
        let talkSound: any = {}
        for (let i = 0; i < 15; i++) {
            talkSound["s" + i] = [i * 100, 100]
        }


        this.talking = new Howl({
            src: ['sound/talking.mp3'],
            sprite: talkSound
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

        this.drip = new Howl({
            src: ['sound/waterdrops.mp3'],
            sprite: {
                s0: [0, 500],
                s1: [500, 500],
                s2: [1000, 500],
                s3: [1500, 500],
                s4: [2000, 500],
                s5: [2500, 500],
                s6: [3000, 500],
                s7: [3500, 500],
                s8: [4000, 500],
                s9: [4500, 500],
            }
        });


        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {

                for (let s of this.bgSounds) {
                    s.fade(1, 0, 1000)
                }
            } else {
                // Resume playing if audio was "playing on hide"
                for (let s of this.bgSounds) {
                    s.fade(0, 1, 1000)
                }
            }
        });

    }





    playCoin() {
        if (!this.playSound) return

        let s = Math.floor(Math.random() * 1000) % 4;

        this.coin.volume(this.fxVolume);
        this.coin.play("s" + s)

    }

    playWetHit(hit: boolean) {
        if (!this.playSound) return

        let s = Math.floor(Math.random() * 4);

        let vol = 0.1
        if (hit) vol = 1;
        this.wetHit.volume(this.fxVolume * vol);
        this.wetHit.play("s" + s)

    }


    playStep() {

        if (!this.playSound) return
        let s = Math.floor(Math.random() * 1000) % 9;

        this.step.volume(this.fxVolume * 0.1);
        this.step.play("s" + s)

    }
    playHitFloor(strength: number) {

        if (!this.playSound) return
        let s = Math.floor(Math.random() * 1000) % 9;

        this.hitFloor.volume(this.fxVolume);
        this.hitFloor.play("s" + s)

    }



    playTalking() {

        if (!this.playSound) return
        let s = Math.floor(Math.random() * 1000) % 4;

        this.talking.volume(this.fxVolume * 0.1);
        this.talking.play("s" + s)

    }


    playScroll(xPos: number, vol: number) {

        if (!this.playSound) return
        let s = Math.floor(Math.random() * 1000) % 4;
        this.scroll.pos(xPos, 0, -0.5);

        this.scroll.volume(this.fxVolume * vol);
        this.scroll.play("s" + s)

    }

    playDrip(xPos: number) {
        if (!this.playSound) return
        let s = Math.floor(Math.random() * 1000) % 9;
        this.drip.pos(xPos, 0, -0.5);
        this.drip.volume(this.fxVolume);
        this.drip.play("s" + s)
    }

    playFart() {
        if (!this.playSound) return
        this.fartCount++;
        this.fartCount %= 8;
        this.fart.volume(this.fxVolume * 0.5);

        this.fart.play("s" + this.fartCount)
    }

    setBackgroundSounds(sounds: string[]) {
        this.killBackgroundSounds()
        for (let s of sounds) {
            let bgSound = new Howl({
                src: [s],
                loop: true,
                autoplay: true,
                onload: () => {

                    bgSound.fade(0, 1, 2000);
                }
            });
            this.bgSounds.push(bgSound);
            console.log(s)
        }
    }

    killBackgroundSounds() {
        for (let s of this.bgSounds) {
            s.unload()
        }
        this.bgSounds = []
    }
}
export default new SoundHandler()
