/**
 * @file Graphics/Basic.js
 * @authors Sephelim, Ian
 * @brief This file provides the basic shape rendering side of graphics
 * programming with Selenium. Provides are definitions of interfaces built
 * to describe things like cubes and pyraminds.
 * @since 0.0.4
 *
 * @license AGPLv3
 * @copyright (c) 2025 the Selenium Development Team
 * This source file is under the AGPLv3. For information on what that
 * means, see the LICENSE.md file that should have been provided alongside
 * this project, or https://www.gnu.org/licenses/agpl-3.0.md.
 */
"use strict";

// #region Module Dependencies

import {Selenium_Graphics_Buffers} from "./Buffers.js";
import {Selenium_Graphics_Shaders} from "./Shaders.js";

import {Selenium_Logging} from "../Logging.js";

import {GLMatrix} from "../../Dependencies/GLMatrix.js";

/**
 * @import {Mat4, Vec3} from "../../Dependencies/GLMatrix.js"
 * @import {Position, Color} from "../Graphics.js"
 */

// #endregion Module Dependencies
// #region Namespace Declaration

/**
 * The basic rendering subnamespace of the graphics space.  This provides
 * the ability to render a primitive shape like a rectangle sans any
 * boilerplate.
 * @since 0.0.4
 */
var Selenium_Graphics_Basic = Selenium_Graphics_Basic || {};
Selenium_Graphics_Basic.__proto__ = null;

/**
 * A general-purpose model type. This contains information about verticies,
 * indices, coloring, and transformations.
 */
Selenium_Graphics_Basic.Model = class
{
    /**
     * The vertex array object (VAO) of the model. This is basically one
     * big list of every vertex within the shape.
     *
     * @type {WebGLVertexArrayObject}
     * @since 0.0.4
     * @protected
     */
    vao;
    /**
     * The vertex buffer object (VBO) of the model. This defines how the
     * vertex list is laid out; the size of each vertex element, the data
     * held within it and in what order its held in, etcetera.
     *
     * @type {WebGLBuffer}
     * @since 0.0.4
     * @protected
     */
    vbo;
    /**
     * The element buffer object (EBO) of the model. This is defined so we
     * don't have to repeat exact same vertices over and over for the sake
     * of overlapping vertices. This is a list of what index into the VAO
     * the vertex at that position is represented by.
     *
     * @type {WebGLBuffer}
     * @since 0.0.4
     * @protected
     */
    ebo;
    /**
     * The model transform matrix. This defines things like rotation,
     * position, etcetera.
     *
     * @type {Mat4}
     * @since 0.0.4
     * @protected
     */
    transform;
    /**
     * The model's color. This is applied to every vertex globally.
     * Vertices given a texture will have this color mixed overtop of said
     * texture.
     *
     * @type {Vec3}
     * @since 0.0.4
     * @protected
     */
    color;

    /**
     * Create a new basic model. This does NOT unbind VAO/VBO/EBO, so child
     * classes should do such.
     * @authors Sephelim
     * @since 0.0.4
     *
     * @param {Position} position The initial position of the model.
     * @param {Color} color The initial color of the model.
     * @param {[Float32Array, Uint32Array]} data
     */
    constructor(position, color, data)
    {
        const buffers = Selenium_Graphics_Buffers.MO(data[0], data[1]);
        this.vao = buffers[0];
        this.vbo = buffers[1];
        this.ebo = buffers[2];

        // I have exactly zero idea why stride is 2x the size of
        // the attribute. I truly couldn't tell you. This is why I
        // like Vulkan better. Man I miss Vulkan T-T
        GL.vertexAttribPointer(0, 3, GL.FLOAT, false, 24, 0);
        GL.enableVertexAttribArray(0);

        GL.vertexAttribPointer(1, 3, GL.FLOAT, true, 24, 12);
        GL.enableVertexAttribArray(1);

        this.transform = GLMatrix.Mat4.create();
        GLMatrix.Mat4.fromTranslation(this.transform,
            GLMatrix.Vec3.fromValues(position.x, position.y, position.z));
        this.Dye(color);
        // this.color = GLMatrix.Vec3.fromValues(Math.min(color.r /
        // 255, 1.0),
        //     Math.min(color.g / 255, 1.0), Math.min(color.b / 255, 1.0));
    }

    /**
     * Destroy all allocated memory within the model. This effectively
     * makes the model useless from a rendering standpoint, and it is up to
     * the user to not render the object post-deletion.
     * @authors Sephelim
     * @since 0.0.4
     */
    Destroy()
    {
        GL.deleteBuffer(this.ebo);
        GL.deleteBuffer(this.vbo);
        GL.deleteVertexArray(this.vao);
        delete this.ebo;
        delete this.vbo;
        delete this.vao;

        delete this.transform;
        delete this.color;
    }

    /**
     * Move the model.
     * @authors Sephelim
     * @since 0.0.4
     *
     * @param {Position} position The amount to move the model.
     */
    Move(position)
    {
        GLMatrix.Mat4.translate(this.transform, this.transform,
            GLMatrix.Vec3.fromValues(position.x, position.y, position.z));
    }

    /**
     * Recolor the model.
     * @authors Sephelim
     * @since 0.0.4
     *
     * @param {Color} color The new color for the model.
     */
    Dye(color)
    {
        this.color = GLMatrix.Vec3.fromValues(Math.min(color.r / 255, 1.0),
            Math.min(color.g / 255, 1.0), Math.min(color.b / 255, 1.0));
    }

    /**
     * Render the model.
     * @authors Sephelim
     * @since 0.0.4
     * @protected
     *
     * @param {string} shader The shader to render the model with.
     * @param {number} index_count The count of indices contained within
     *     the EBO.
     * @param {GLenum} mode The mode to render in.
     */
    _Render(shader, index_count, mode)
    {
        if (!Selenium_Graphics_Shaders.Use(shader)) return;
        GL.bindVertexArray(this.vao);

        Selenium_Graphics_Shaders.SetUniform(
            shader, "m4_model_matrix", this.transform);
        Selenium_Graphics_Shaders.SetUniform(
            shader, "v3_model_color", this.color);

        GL.drawElements(mode, index_count, GL.UNSIGNED_INT, 0);
    }
}

/**
 * A "cube." Because of the isometric nature of Selenium, it does not
 * support rotation in 3D space, and therefore to save memory only the
 * faces of the cube possibly facing the player are defined.
 * @since 0.0.4
 */
Selenium_Graphics_Basic.Cube = class extends Selenium_Graphics_Basic.Model
{
    /**
     * Create a new cube model.
     * @authors Sephelim
     * @since 0.0.4
     *
     * @param {Position} position The initial position of the cube in
     *     relation to the origin.
     * @param {number} scale The scale of the cube.
     * @param {Color} color The color to dye the cube.
     */
    constructor(position = {x: 0, y: 0, z: 0}, scale = 40,
        color = {r: 255, g: 0, b: 0})
    {
        // Clang-Format makes arrays HIDEOUS.
        // clang-format off
        const raw_vao = new Float32Array([
            // Top tile
            0.0,     0.0,     0.0,  0.0, 0.0, 1.0, // (xyz, uvw)
            0.0,     scale,   0.0,  0.0, 0.0, 1.0,
            scale,   scale,   0.0,  0.0, 0.0, 1.0,
            scale,   0.0,     0.0,  0.0, 0.0, 1.0,
            // Left tile
            scale*2, scale*2, 0.0, 1.0, 0.0, 0.0,
            scale,   scale,   0.0, 1.0, 0.0, 0.0,
            scale,   0.0,     0.0, 1.0, 0.0, 0.0,
            scale*2, scale,   0.0, 1.0, 0.0, 0.0,
            // Right tile 
            scale,   scale*2, 0.0, 0.0, 1.0, 0.0,
            0.0,     scale,   0.0, 0.0, 1.0, 0.0,
            scale,   scale,   0.0, 0.0, 1.0, 0.0,
            scale*2, scale*2, 0.0, 0.0, 1.0, 0.0,
        ]);
        const raw_ebo = new Uint32Array([
            0,  1,  2, // (v1, v2, v3)
            0,  2,  3,
            4,  5,  6,
            4,  6,  7,
            8,  9, 10,
            8, 10, 11
        ]);
        // clang-format on

        super(position, color, [raw_vao, raw_ebo]);

        // Make sure none of our objects bleed into the global
        // rendering scope on accident.
        GL.bindBuffer(GL.ARRAY_BUFFER, null);
        GL.bindVertexArray(null);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);
    }

    /**
     * Render the cube. This does not check internal cube state, if the
     * cube's been destroyed this call will generate many warnings.
     * @authors Sephelim
     * @since 0.0.4
     *
     * @note The given shader must have vertex locations taken as a vec3 of
     * floats in attribute location 0, and two uniforms, a 4x4 matrix for
     * the model transformation and a three component vector for color,
     * "model_matrix" and "model_color" respectively.
     *
     * @param {string} shader The shader to render with. If this shader
     *     isn't real, this function will return without operation.
     */
    Render(shader) { this._Render(shader, 18, GL.TRIANGLES); }
};

/**
 * A "pyramid." Because of the isometric nature of Selenium, it does not
 * support rotation in 3D space, and therefore to save memory only the
 * faces of the pyramid possibly facing the player are defined.
 * @since 0.0.4
 */
Selenium_Graphics_Basic.Pyramid =
    class extends Selenium_Graphics_Basic.Model
{
    /**
     * Create a new pyramid model.
     * @authors Sephelim
     * @since 0.0.4
     *
     * @param {Position} position The initial position of the pyramid in
     *     relation to the origin.
     * @param {number} scale The scale of the pyramid.
     * @param {Color} color The color to dye the pyramid.
     */
    constructor(position = {x: 0, y: 0, z: 0}, scale = 40,
        color = {r: 255, g: 0, b: 0})
    {
        // clang-format off
        const raw_vao = new Float32Array([
            // Left tile 
            scale, scale * 2, 0.0, 0.0, 0.70710678118, 0.70710678118, // (xyz, uvw)
            scale * 2, scale * 2, 0.0, 0.0, 0.70710678118, 0.70710678118,
            scale, scale, 0.0, 0.0, 0.70710678118, 0.70710678118,
            // Right tile
            scale * 2, scale * 2, 0.0, 0.70710678118, 0.0, 0.70710678118,
            scale, scale, 0.0, 0.70710678118, 0.0, 0.70710678118,
            scale * 2, scale, 0.0, 0.70710678118, 0.0, 0.70710678118
        ]);
        const raw_ebo = new Uint32Array([
            0, 1, 2, // (v1, v2, v3)
            3, 4, 5
        ]);
        // clang-format on

        super(position, color, [raw_vao, raw_ebo]);

        // Make sure none of our objects bleed into the global
        // rendering scope on accident.
        GL.bindBuffer(GL.ARRAY_BUFFER, null);
        GL.bindVertexArray(null);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);
    }

    /**
     * Render the pyramid. This does not check internal pyramid state, if
     * the pyramid's been destroyed this call will generate many warnings.
     * @authors Sephelim
     * @since 0.0.4
     *
     * @note The given shader must have vertex locations taken as a vec3 of
     * floats in attribute location 0, and two uniforms, a 4x4 matrix for
     * the model transformation and a three component vector for color,
     * "model_matrix" and "model_color" respectively.
     *
     * @param {string} shader The shader to render with. If this shader
     *     isn't real, this function will return without operation.
     */
    Render(shader) { this._Render(shader, 6, GL.TRIANGLES); }
};

// #endregion Namespace Declaration
// #region Module Exports

export {Selenium_Graphics_Basic};

// #endregion Module Exports
