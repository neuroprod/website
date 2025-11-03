
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
    clock!: Howl;

    sea!: Howl;
    gun!: Howl;
    gunShot!: Howl;
    splash!: Howl;
    squatch!: Howl;

    init() {

        // this.fishFood = new Howl({src: ['sound/fishfood.mp3']});
        let talkSound: any = {}
        for (let i = 0; i < 15; i++) {
            talkSound["s" + i] = [i * 100, 100]
        }

        this.sea = new Howl({
            src: ['sound/653311__mfedward__relaxing-sea.mp3'],
            loop: true
        });
        this.gun = new Howl({
            src: ['sound/465488__janthracite__1911-pistol-cocking.mp3'],

        });
        this.gunShot = new Howl({
            src: ['sound/416417__superphat__automatic-assault-rifle.mp3'],

        });
        this.splash = new Howl({
            src: ['sound/442773__qubodup__big-water-splash.mp3'],

        });
        this.squatch = new Howl({
            src: ['sound/641046__magnuswaker__gore-impact-lot-of-heart.mp3'],
        })
        this.talking = new Howl({
            src: ['sound/talking.mp3'],
            sprite: talkSound
        });
        this.clock = new Howl({
            src: ['sound/clock-ticking.mp3'],
            sprite: {
                s0: [0, 1000],
                s1: [1000, 1000],
                s2: [2000, 1000],
                s3: [3000, 1000],
                s4: [4000, 1000],
                s5: [5000, 1000],

            }
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
    playSquatch() {
        if (!this.playSound) return



        this.squatch.volume(this.fxVolume * 0.2);
        this.squatch.rate(1.3 + Math.random() * 0.5);
        this.squatch.play()
    }


    playTick(count: number) {
        if (!this.playSound) return



        this.clock.volume(this.fxVolume * 0.1);

        this.clock.pos(count % 2 - 0.5, 0, -0.5);
        this.clock.play("s" + count % 6)

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

        this.talking.volume(this.fxVolume * 0.2);
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
    playGun() {
        if (!this.playSound) return
        this.gun.volume(this.fxVolume);

        this.gun.play()
    }
    playSplash() {
        if (!this.playSound) return
        this.splash.volume(this.fxVolume * 0.1);

        this.splash.play()
    }
    playGunShot() {
        if (!this.playSound) return

        this.gunShot.volume(this.fxVolume);
        this.gunShot.play()
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

        }
    }
    fadeBackground() {
        for (let s of this.bgSounds) {
            s.fade(1, 0, 3000)
        }
    }

    killBackgroundSounds() {
        for (let s of this.bgSounds) {
            s.unload()
        }
        this.bgSounds = []
    }
    playSeaSound() {
        this.sea.play()
        this.sea.volume(this.fxVolume * 0.1);
    }
    fadeSea() {
        this.sea.fade(this.fxVolume * 0.1, 0, 1000)
    }
    setSeaSoundTranstion(seaSoundTransition: number) {
        for (let s of this.bgSounds) {
            s.volume(this.fxVolume * (1 - seaSoundTransition));
        }
        this.sea.volume(this.fxVolume * (seaSoundTransition) * 0.1);
    }

}
export default new SoundHandler()
