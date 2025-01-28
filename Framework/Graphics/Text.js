/**
 * @file Graphics/Text.js
 * @authors Sephelim
 * @brief This file provides the Selenium interface for loading bitmap
 * fonts and rendering them onto the canvas.
 * @since 0.0.6
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
import {GL} from "./GL.js";

import {Selenium_Assets_Textures} from "../Assets/Textures.js";
import {Selenium_Assets_Shaders} from "../Assets/Shaders.js";
import {Selenium_Assets_Fonts} from "../Assets/Fonts.js";

import {GLMatrix} from "../../Dependencies/GLMatrix.js";

// #endregion Module Dependencies
// #region Namespace Declaration

var Selenium_Graphics_Text = Selenium_Graphics_Text || {};
Selenium_Graphics_Text.__proto__ = null;

Selenium_Graphics_Text.Projection = GLMatrix.Mat4.create();
GLMatrix.Mat4.perspective(Selenium_Graphics_Text.Projection, 45,
    window.innerWidth / window.innerHeight, 0, 150);

Selenium_Graphics_Text.RenderString = function(
    font, string, position, color) {
    //! optimize this by storing font/string so we don't have to recalc
    //! this buffer each time
    // clang-format off
    const buffers = Selenium_Graphics_Buffers.MO(
        new Float32Array([
            0.0, 0.0, 0.0, 0.0, 0.0, // (xyz, rs)
            0.0, 100, 0.0, 0.0, 1.0,
            100, 100, 0.0, 1.0, 1.0,
            100, 0.0, 0.0, 1.0, 0.0
        ]),
        new Uint32Array([
            0, 1, 2,
            0, 2, 3
        ]));
    // clang-format on

    GL.vertexAttribPointer(0, 3, GL.FLOAT, false, 20, 0);
    GL.enableVertexAttribArray(0);

    GL.vertexAttribPointer(1, 2, GL.FLOAT, false, 20, 12);
    GL.enableVertexAttribArray(1);

    let transform = GLMatrix.Mat4.create();
    GLMatrix.Mat4.translate(transform, transform,
        GLMatrix.Vec3.fromValues(position.x, position.y, position.z));

    if (!Selenium_Assets_Shaders.Use("text"))
    {
        console.log("hii");
        return;
    }
    GL.bindVertexArray(buffers[0]);

    console.log(Selenium_Assets_Shaders.SetUniform("text",
        "m4_projection_matrix", Selenium_Graphics_Text.Projection));
    console.log(Selenium_Assets_Shaders.SetUniform(
        "text", "m4_model_matrix", transform));
    console.log(Selenium_Assets_Shaders.SetUniform("text", "v4_text_color",
        GLMatrix.Vec4.fromValues(Math.min(color.r / 255, 1.0),
            Math.min(color.g / 255, 1.0), Math.min(color.b / 255, 1.0),
            1.0)));
    console.log(Selenium_Assets_Textures.Use("Fonts/kongtext-16.png"));

    GL.drawElements(GL.TRIANGLES, 6, GL.UNSIGNED_INT, 0);
    GL.bindTexture(GL.TEXTURE_2D, null);
};

// #endregion Namespace Declaration
// #region Module Exports

export {Selenium_Graphics_Text};

// #endregion Module Exports
