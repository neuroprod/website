export default class KeyInput {

    jumpTime: number = 0;

    leftDown = false;
    rightDown = false;


    upDown = false;
    downDown = false;

    space = false;
    m = false;

    private rightDownTime!: DOMHighResTimeStamp;
    private leftDownTime!: DOMHighResTimeStamp;
    private upDownTime!: DOMHighResTimeStamp;
    private downDownTime!: DOMHighResTimeStamp;

    private spaceDownTime!: DOMHighResTimeStamp;



    constructor() {
        //w
        //asd
        document.addEventListener('keydown', (event) => {
            console.log(event.key)
            switch (event.key) {
                case "a":
                case "ArrowLeft":


                    this.leftDown = true;
                    this.leftDownTime = event.timeStamp

                    break;
                case "d":
                case "ArrowRight":

                    this.rightDown = true;
                    this.rightDownTime = event.timeStamp

                    break;
                case "w":
                case "ArrowUp":
                    this.upDown = true;

                    this.upDownTime = event.timeStamp
                    break;
                case "s":
                case "ArrowDown":
                    this.downDown = true
                    this.downDownTime = event.timeStamp
                    break;
                case " ":
                    this.space = true;
                    this.spaceDownTime = event.timeStamp

                    break;
                case "m":
                    this.m = true;


                    break;
            }

        });

        document.addEventListener('keyup', (event) => {
            switch (event.key) {
                case "a":
                case "ArrowLeft":
                    this.leftDown = false
                    break;
                case "d":
                case "ArrowRight":
                    this.rightDown = false
                    break;
                case " ":
                    this.jumpTime = event.timeStamp - this.spaceDownTime;
                    this.space = false
                    break;
                    ;
                case "w":
                case "ArrowUp":

                    this.jumpTime = event.timeStamp - this.upDownTime;
                    this.upDown = false
                    this.space = false
                    break;
                case "s":
                case "ArrowDown":


                    this.downDown = false

                    break;
            }
        });
    }
    getJump() {
        if (this.space || this.upDown) {
            // this.space =false;
            return true;
        }
        return false;
    }
    getSpace() {
        if (this.space) {
            return true;
        }
        return false;
    }
    getHdir() {
        if (this.rightDown && !this.leftDown) {
            return 1
        }
        if (this.leftDown && !this.rightDown) {
            return -1
        }
        if (this.leftDown && this.rightDown) {
            if (this.leftDownTime > this.rightDownTime) return -1
            else return 1;
        }
        return 0;
    }
    getVdir() {
        if (this.upDown && !this.downDown) {
            return -1
        }
        if (this.downDown && !this.upDown) {
            return 1
        }
        if (this.upDown && this.downDown) {
            if (this.downDownTime > this.upDownTime) return 1
            else return -1;
        }
        return 0;
    }



    clear() {
        this.m = false;
        this.space = false;
        this.leftDown = false;
        this.rightDown = false;
        this.upDown = false;
        this.downDown = false;
    }
}
