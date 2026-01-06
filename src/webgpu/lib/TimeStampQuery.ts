import Renderer from "./Renderer";
import RenderPass from "./RenderPass";
import UI from "./UI/UI";

export class TimeStampData {

    index: number = 0;
    name = "";
    timestampWrites!: GPURenderPassTimestampWrites | null;
    time!: number;

}


export default class TimeStampQuery {
    public totalTime: number = 0;
    public timeArray: Array<number> = [];
    public names: Array<string> = []


    private capacity: number = 0;
    private device: GPUDevice;

    private renderer: Renderer;
    private useTimeStampQuery: boolean = false;

    private querySet!: GPUQuerySet;
    private resolveBuffer!: GPUBuffer;
    private resultBuffer!: GPUBuffer;
    private bufferSize!: number;
    private done: boolean = true;
    numStamps: number = 0;
    private timeStamps: Array<TimeStampData> = []

    constructor(renderer: Renderer) {

        this.renderer = renderer;
        this.device = this.renderer.device;
        this.useTimeStampQuery = renderer.useTimeStampQuery;


    }
    add(name: string) {
        let timeStampData = new TimeStampData()
        timeStampData.index = this.numStamps;
        timeStampData.name = name;
        this.timeStamps.push(timeStampData)
        this.numStamps += 2;
        return timeStampData;

    }
    init() {

        if (this.numStamps == 0) return;

        this.capacity = this.numStamps;//Max number of timestamps we can store
        this.timeArray = new Array<number>(this.numStamps);
        this.timeArray.fill(0);
        this.useTimeStampQuery = this.renderer.useTimeStampQuery
        if (this.useTimeStampQuery) {
            this.querySet = this.device.createQuerySet({
                type: "timestamp",
                count: this.capacity,
            });
            this.bufferSize = this.numStamps * BigInt64Array.BYTES_PER_ELEMENT;
            this.resolveBuffer = this.device.createBuffer({
                size: this.bufferSize,
                usage: GPUBufferUsage.QUERY_RESOLVE | GPUBufferUsage.COPY_SRC,
            });

            this.resultBuffer = this.device.createBuffer({
                size: this.bufferSize,
                usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
            });
            for (let ts of this.timeStamps) {
                ts.timestampWrites = this.getSet(ts.index, ts.index + 1)

            }

        }

    }
    getSet(start: number, stop: number) {
        if (!this.useTimeStampQuery) return null;

        let timestampWrites: GPURenderPassTimestampWrites = {
            querySet: this.querySet,
            beginningOfPassWriteIndex: start, // Write timestamp in index 0 when pass begins.
            endOfPassWriteIndex: stop, // Write timestamp in index 1 when pass ends.
        };
        return timestampWrites;
    }


    readback() {

        if (!this.useTimeStampQuery) return;


        if (this.done) {
            this.done = false;
            this.read().then(() => {
                this.done = true
            })
        }



    }


    getData() {
        if (!this.useTimeStampQuery) return;
        if (this.done && this.querySet) {
    
            this.renderer.commandEncoder.resolveQuerySet(this.querySet, 0, this.capacity, this.resolveBuffer, 0);

            // Read GPUBuffer memory.
            this.renderer.commandEncoder.copyBufferToBuffer(this.resolveBuffer, 0, this.resultBuffer, 0, this.bufferSize);
        }


    }

    async read() {
        await this.resultBuffer.mapAsync(GPUMapMode.READ);
        const times = new BigInt64Array(this.resultBuffer.getMappedRange());

        for (let t of this.timeStamps) {

            t.time = Number(times[t.index + 1] - times[t.index]);

        }


        this.resultBuffer.unmap();
    }

    onUI() {
        for (let t of this.timeStamps) {


            UI.LText(t.time + "", t.name)
        }

    }
}
