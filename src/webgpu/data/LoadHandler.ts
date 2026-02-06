import GameModel from "../Website/GameModel.ts";

class LoadHandler {

    private loadingCount = 0;
    private _isLoading = false;


    onComplete!: () => void

    update() {
        if (this.loadingCount == 0 && this._isLoading) {
            this._isLoading = false;

            if (this.onComplete) this.onComplete()

        }
    }

    isLoading() {

        return this._isLoading;
    }

    startLoading() {
        if (this.loadingCount == 0) {

            this._isLoading = true;
        }
        this.loadingCount++;

    }
    stopLoading() {
        this.loadingCount--



    }




}
export default new LoadHandler()
