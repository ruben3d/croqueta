import { ShaderException } from "../base/Exceptions";
import { None, Option, Some } from "../base/Option";


enum CrShaderType {
    VertexShader = WebGL2RenderingContext.VERTEX_SHADER,
    FragmentShader = WebGL2RenderingContext.FRAGMENT_SHADER
}

class CrShader {
    private gl: WebGL2RenderingContext;
    private shader: Option<WebGLShader>;

    constructor(gl: WebGL2RenderingContext, type: CrShaderType, source: ShaderSource) {
        this.gl = gl;
        this.shader = None();
        const shader = Option(gl.createShader(type)).getOrElse(() => { throw new ShaderException("Error requesting a new WebGLShader") });
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const msg = Option(gl.getShaderInfoLog(shader)).getOrElse(() => "Unknown error on shader compilation");
            gl.deleteShader(shader);
            throw new ShaderException(msg);
        }
        this.shader = Some(shader);
    }

    get(): WebGLShader {
        return this.shader.getOrElse(() => { throw new ShaderException("Invalid shader") });
    }

    isValid(): boolean {
        return this.shader.nonEmpty();
    }

    release(): void {
        this.shader.forEach(s => this.gl.deleteShader(s));
        this.shader = None();
    }
}

class CrProgram {
    private gl: WebGL2RenderingContext;
    private program: Option<WebGLProgram>;

    constructor(gl: WebGL2RenderingContext, vs: WebGLShader, fs: WebGLShader) {
        this.gl = gl;
        this.program = None();
        const p = Option(gl.createProgram()).getOrElse(() => { throw new ShaderException("Error requesting new WebGLProgram") });
        gl.attachShader(p, vs);
        gl.attachShader(p, fs);
        gl.linkProgram(p);
        if (!gl.linkProgram(p)) {
            const msg = Option(gl.getProgramInfoLog(p)).getOrElse(() => "Unknown error on program linking");
            gl.deleteProgram(p);
            throw new ShaderException(msg);
        }
        this.program = Some(p);
    }

    get(): WebGLProgram {
        return this.program.getOrElse(() => { throw new ShaderException("Invalid program") });
    }

    isValid(): boolean {
        return this.program.nonEmpty();
    }

    release(): void {
        this.program.forEach(p => this.gl.deleteProgram(p));
        this.program = None();
    }
}

export type ShaderSource = string;

export class Shader {

    private program: CrProgram;
    private vs: CrShader;
    private fs: CrShader;

    constructor(gl: WebGL2RenderingContext, vertexShaderSource: ShaderSource, fragmentShaderSource: ShaderSource) {
        this.vs = new CrShader(gl, CrShaderType.VertexShader, vertexShaderSource);
        this.fs = new CrShader(gl, CrShaderType.FragmentShader, fragmentShaderSource);
        this.program = new CrProgram(gl, this.vs.get(), this.fs.get());
    }

    get(): WebGLProgram {
        return this.program;
    }

    release(): void {
        this.program.release();
        this.vs.release();
        this.fs.release();
    }
}
