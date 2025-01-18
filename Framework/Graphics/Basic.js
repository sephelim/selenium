/**
 * @file Graphics/Basic.js
 * @authors Sephelim
 * @brief This file provides the basic shape rendering side of graphics
 * programming with Selenium. Provides are vertex buffers and shaders built
 * only to render primitives like squares.
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
 * @import {Color} from "../Graphics.js"
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

Selenium_Graphics_Basic.Cube = class
{
    vertex_object;
    vertex_buffer;
    vertex_indices;
    model_matrix;

    constructor(position = {x: 0, y: 0, z: 0}, scale = 40,
        color = {r: 255, g: 0, b: 0})
    {
        const buffers = Selenium_Graphics_Buffers.CreateModelObject(
            new Float32Array([
                // clang-format off
                scale,     scale,     0.0, color.r, color.g, color.b,
                0.0,       scale,     0.0, color.r, color.g, color.b,
                scale,     0.0,       0.0, color.r, color.g, color.b,
                0.0,       0.0,       0.0, color.r, color.g, color.b,
                scale,     scale * 2, 0.0, color.r, color.g, color.b,
                scale * 2, scale * 2, 0.0, color.r, color.g, color.b,
                scale * 2, scale, 0.0, color.r, color.g, color.b,
                // clang-format on
            ]),
            new Uint32Array(
                [0, 1, 2, 3, 2, 1, 1, 4, 0, 0, 4, 5, 5, 6, 0, 0, 6, 2]));

        //! create index buffer
        this.vertex_object = buffers[0];
        this.vertex_buffer = buffers[1];
        this.vertex_indices = buffers[2];

        // Align our vertex buffer properly so the shade can understand it.
        GL.vertexAttribPointer(0, 3, GL.FLOAT, false, 24, 0);
        GL.enableVertexAttribArray(0);
        GL.vertexAttribPointer(1, 3, GL.FLOAT, false, 24, 12);
        GL.enableVertexAttribArray(1);
        GL.bindBuffer(GL.ARRAY_BUFFER, null);

        this.model_matrix = GLMatrix.Mat4.create();
        GLMatrix.Mat4.fromTranslation(this.model_matrix,
            GLMatrix.Vec3.fromValues(position.x, position.y, position.z));
    }

    Move(x, y = 0, z = 0) {}

    Rotate(angle) {}

    Destroy()
    {
        GL.deleteBuffer(this.vertex_indices);
        GL.deleteBuffer(this.vertex_buffer);
        GL.deleteVertexArray(this.vertex_object);
    }

    Render(shader)
    {
        Selenium_Graphics_Shaders.Use(shader);
        GL.bindVertexArray(this.vertex_object);
        Selenium_Graphics_Shaders.SetUniform(
            shader, "m4_model_matrix", this.model_matrix);
        GL.drawElements(GL.TRIANGLES, 18, GL.UNSIGNED_INT, 0);
    }
};

/**
 *
 * @param {TileOrientation} orientation
 * @param {number} scale
 * @param {Color} color
 * @returns {WebGLVertexArrayObject}
 */
Selenium_Graphics_Basic.CreateTile = function(orientation, scale, color) {
    const size = 1.0 * scale;
    switch (orientation)
    {
        case "up":
            const up_object = [
                size, size, 0.0, color.r, color.g, color.b, // top right
                0.0, size, 0.0, color.r, color.g, color.b,  // top left
                size, 0.0, 0.0, color.r, color.g, color.b,  // bottom right
                0.0, 0.0, 0.0, color.r, color.g, color.b,   // bottom left
                size, 0.0, 0.0, color.r, color.g, color.b,  // bottom right
                0.0, size, 0.0, color.r, color.g, color.b   // top left
            ];
            return Selenium_Graphics_Buffers.CreateVertexObject(
                new Float32Array(up_object));
        case "left":
            const left_object = [
                size, size, 0.0, color.r, color.g, color.b, // top right
                0.0, size, 0.0, color.r, color.g, color.b,  // top left
                size, 0.0, 0.0, color.r, color.g, color.b,  // bottom right
                0.0, 0.0, 0.0, color.r, color.g, color.b,   // bottom left
                0.0, 0.0, 0.0, color.r, color.g, color.b,   // bottom right
                0.0, size, 0.0, color.r, color.g, color.b   // top left
            ];
            return Selenium_Graphics_Buffers.CreateVertexObject(
                new Float32Array(left_object));
    }
};

// #endregion Namespace Declaration
// #region Module Exports

/**
 * @typedef {"up" | "left"} TileOrientation
 */

export {Selenium_Graphics_Basic};

// #endregion Module Exports
