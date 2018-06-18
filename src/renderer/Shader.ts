import { Either, Right, Left } from "../base/Either";
import { Option } from "../base/Option";


enum CrShaderType {
    VertexShader = WebGL2RenderingContext.VERTEX_SHADER,
    FragmentShader = WebGL2RenderingContext.FRAGMENT_SHADER
}

class CrShader {
    private gl: WebGL2RenderingContext;
    private shader: Either<string, WebGLShader>;

    constructor(gl: WebGL2RenderingContext, type: CrShaderType, source: ShaderSource) {
        this.gl = gl;
        this.shader = Option(gl.createShader(type))
            .fold(() => Left("Error requesting new WebGLShader"), s => Right(s))
            .flatMap(shader => {
                gl.shaderSource(shader, source);
                gl.compileShader(shader);
                if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                    return Right(shader);
                } else {
                    const msg = Option(gl.getShaderInfoLog(shader)).getOrElse(() => "Unknown error on shader compilation");
                    gl.deleteShader(shader);
                    return Left(msg);
                }
            });
    }

    get(): Either<string, WebGLShader> {
        return this.shader;
    }

    release(): void {
        this.shader = this.shader.flatMap(s => {
            this.gl.deleteShader(s);
            return Left("Deleted");
        });
    }
}

export type ShaderSource = string;

export class Shader {

    private gl: WebGL2RenderingContext;
    private program: Either<string, WebGLProgram>

    constructor(gl: WebGL2RenderingContext, vertexShaderSource: ShaderSource, fragmentShaderSource: ShaderSource) {
        this.gl = gl;
        const vs = new CrShader(gl, CrShaderType.VertexShader, vertexShaderSource).get();
        const fs = new CrShader(gl, CrShaderType.FragmentShader, fragmentShaderSource).get();

        // TODO Some more functional utilities so this code looks nicer and shorter
        if (vs.isRight() && fs.isRight()) {
            this.program = Option(gl.createProgram())
                .fold(() => Left("Error requesting new WebGLProgram"), s => Right(s))
                .flatMap(p => {
                    vs.forEach(s => gl.attachShader(p, s));
                    fs.forEach(s => gl.attachShader(p, s));
                    gl.linkProgram(p);
                    if (gl.linkProgram(p)) {
                        return Right(p);
                    } else {
                        const msg = Option(gl.getProgramInfoLog(p)).getOrElse(() => "Unknown error on program linking");
                        gl.deleteProgram(p);
                        return Left(msg);
                    }
                });
        } else {
            const msg = `Error on shader compilation: 
                Vertex shader: ${vs.swap().getOrElse(() => 'Success')}
                Fargment shader: ${fs.swap().getOrElse(() => 'Success')}`;
            this.program = Left(msg);
        }
    }

    release(): void {
        this.program = this.program.flatMap(p => {
            this.gl.deleteProgram(p);
            return Left("Deleted");
        });
    }
}
