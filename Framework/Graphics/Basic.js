/**
 * @file Graphics/Basic.js
 * @authors Sephelim
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

Selenium_Graphics_Basic.Model = class
{
    /**
     * The vertex array object (VAO) of the model. This is basically one
     * big list of every vertex within the shape. This is not explicitly
     * constructed in the constructor, and should be created by child
     * classes.
     * @type {WebGLVertexArrayObject}
     * @since 0.0.4
     */
    vao = null;
    /**
     * The vertex buffer object (VBO) of the model. This defines how the
     * vertex list is laid out; the size of each vertex element, the data
     * held within it and in what order its held in, etcetera. This is not
     * explicitly constructed in the constructor, and should be created by
     * child classes.
     * @type {WebGLBuffer}
     * @since 0.0.4
     */
    vbo = null;
    /**
     * The element buffer object (EBO) of the model. This is defined so we
     * don't have to repeat exact same vertices over and over for the sake
     * of overlapping vertices. This is a list of what index into the VAO
     * the vertex at that position is represented by. This is not
     * explicitly constructed in the constructor, and should be created by
     * child classes.
     * @type {WebGLBuffer}
     * @since 0.0.4
     */
    ebo = null;
    /**
     * The model transform matrix. This defines things like rotation,
     * position, etcetera.
     * @type {Mat4}
     * @since 0.0.4
     */
    transform;
    /**
     * The model's color. This is applied to every vertex globally.
     * Vertices given a texture will have this color mixed overtop of said
     * texture.
     * @type {Vec3}
     * @since 0.0.4
     */
    color;

    /**
     * Create a new basic model.
     * @authors Sephelim
     * @since 0.0.4
     *
     * @param {Position} position The initial position of the model.
     * @param {Color} color The initial color of the model.
     */
    constructor(position, color)
    {
        this.transform = GLMatrix.Mat4.create();
        GLMatrix.Mat4.fromTranslation(this.transform,
            GLMatrix.Vec3.fromValues(position.x, position.y, position.z));
        this.color = GLMatrix.Vec3.fromValues(color.r, color.g, color.b);
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
        this.color = GLMatrix.Vec3.fromValues(color.r, color.g, color.b);
    }

    /**
     * Render the model.
     * @authors Sephelim
     * @since 0.0.4
     *
     * @protected This method is technically still public, but should not
     * be used outside of child classes.
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
 * support rotation in 3D space, and therefore to save memory on the faces
 * of the cube possibly facing the player are defined.
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
        super(position, color);

        // Clang-Format makes arrays HIDEOUS.
        // clang-format off
        const buffers = Selenium_Graphics_Buffers.MO(
            // VAO
            new Float32Array([
                scale,     scale,     0.0, // (x, y, z)
                0.0,       scale,     0.0,
                scale,     0.0,       0.0,
                0.0,       0.0,       0.0,
                scale,     scale * 2, 0.0,
                scale * 2, scale * 2, 0.0,
                scale * 2, scale,     0.0
            ]),
            // EBO
            new Uint32Array([
                1, 0, 2, // (v1, v2, v3)
                1, 2, 3,
                1, 4, 0,
                0, 4, 5,
                5, 6, 0,
                0, 6, 2
            ])
        );
        // clang-format on

        this.vao = buffers[0];
        this.vbo = buffers[1];
        this.ebo = buffers[2];

        // This corresponds to `layout(location = 0) in vec4 position`
        // within the shader.
        GL.vertexAttribPointer(0, 3, GL.FLOAT, false, 0, 0);
        GL.enableVertexAttribArray(0);

        // Make sure none of our objects bleed into the global rendering
        // scope on accident.
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

// #endregion Namespace Declaration
// #region Module Exports

export {Selenium_Graphics_Basic};

// #endregion Module Exports
