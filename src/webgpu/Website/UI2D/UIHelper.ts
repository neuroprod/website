import Renderer from "../../lib/Renderer";

class UIHelper {
    getWidth() {
        if (this.renderer.ratio > 1) { return this.renderer.htmlWidth }
        return this.renderer.htmlHeight
    }
    renderer!: Renderer;
    constructor() {


    }
    init(renderer: Renderer) {
        this.renderer = renderer;
    }


}

export default new UIHelper()