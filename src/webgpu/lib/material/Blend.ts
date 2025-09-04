import { BlendFactor, BlendOperation } from "../WebGPUConstants.ts";


export default class Blend {


    static preMultAlpha(): GPUBlendState {
        return {

            color: {
                srcFactor: BlendFactor.One,
                dstFactor: BlendFactor.OneMinusSrcAlpha,
                operation: BlendOperation.Add,
            },
            alpha: {
                srcFactor: BlendFactor.One,
                dstFactor: BlendFactor.OneMinusSrcAlpha,
                operation: BlendOperation.Add,
            }
        }
    }

    static mult(): GPUBlendState {
        return {
            color: {
                srcFactor: BlendFactor.DST,
                dstFactor: BlendFactor.Zero,
                operation: BlendOperation.Add,
            },
            alpha: {
                srcFactor: BlendFactor.DST,
                dstFactor: BlendFactor.Zero,
                operation: BlendOperation.Add,
            },
        }
    }

    static alpha(): GPUBlendState {
        return {

            color: {
                srcFactor: BlendFactor.SrcAlpha,
                dstFactor: BlendFactor.OneMinusSrcAlpha,
                operation: BlendOperation.Add,
            },
            alpha: {
                srcFactor: BlendFactor.One,
                dstFactor: BlendFactor.OneMinusSrcAlpha,
                operation: BlendOperation.Add,
            }
        }
    }
    static add(): GPUBlendState {
        return {

            color: {
                srcFactor: BlendFactor.One,
                dstFactor: BlendFactor.One,
                operation: BlendOperation.Add,
            },
            alpha: {
                srcFactor: BlendFactor.One,
                dstFactor: BlendFactor.OneMinusSrcAlpha,
                operation: BlendOperation.Add,
            }
        }
    }
    static zero(): GPUBlendState {
        return {

            color: {
                srcFactor: BlendFactor.Zero,
                dstFactor: BlendFactor.One,
                operation: BlendOperation.Add,
            },
            alpha: {
                srcFactor: BlendFactor.Zero,
                dstFactor: BlendFactor.One,
                operation: BlendOperation.Add,
            }
        }
    }
    static getErase(): GPUBlendState {
        return {

            color: {
                srcFactor: BlendFactor.One,
                dstFactor: BlendFactor.OneMinusSrcAlpha,
                operation: BlendOperation.ReverseSubtract,
            },
            alpha: {
                srcFactor: BlendFactor.One,
                dstFactor: BlendFactor.OneMinusSrcAlpha,
                operation: BlendOperation.ReverseSubtract,
            }
        }
    }
}
