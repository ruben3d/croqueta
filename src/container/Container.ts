
import { Context } from "../base/Context";
import { WebGL2NotSupportedException } from "../base/Exceptions"
import { Option } from "../base/Option";
import { EventManager } from "../core/EventManager";
import { Kernel } from "../core/Kernel";
import { Renderer } from "../renderer/Renderer";
import { ShaderManager } from "../renderer/ShaderManager";

export class Container {

    private applicationContext: Context;
    private eventManager: EventManager;
    private kernel: Kernel;
    private renderer: Renderer;
    private shaderManager: ShaderManager;

    private canvasId: string;
    private renderingContext: WebGL2RenderingContext;

    constructor(canvasId: string) {
        this.canvasId = canvasId;
        this.eventManager = new EventManager();
    }

    start() {
        this.renderingContext = this.createContext(this.canvasId);

        this.applicationContext = new Context();
        this.shaderManager = new ShaderManager(this.renderingContext);
        this.renderer = new Renderer(this.renderingContext, this.applicationContext, this.shaderManager);

        this.kernel = new Kernel(this.eventManager, 6);
        this.kernel.addTask(this.renderer);

        this.kernel.start();
    }

    shutdown() {
        this.kernel.stop();
    }

    private createContext(canvasId: string): WebGL2RenderingContext {
        let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        let gl = canvas.getContext('webgl2');
        return Option(gl).getOrElse(() => { throw new WebGL2NotSupportedException() });
    }
}
