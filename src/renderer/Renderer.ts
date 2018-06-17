
import { Context } from "../base/Context"
import { KernelTask } from "../core/KernelTask"
import { ShaderManager } from "./ShaderManager"

export class Renderer extends KernelTask {

    private gl: WebGL2RenderingContext;
    //private shaderManager: ShaderManager;

    constructor(renderingContext: WebGL2RenderingContext, applicationContext: Context, shaderManager: ShaderManager) {
        super("renderer", applicationContext);
        this.gl = renderingContext;
        //this.shaderManager = shaderManager;

        this.setup(this.gl);
    }

    private setup(gl: WebGL2RenderingContext): void {
        gl.clearColor(0.2, 0.5, 1.0, 1.0);
    }

    update(delta: number): void {
        let gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
}