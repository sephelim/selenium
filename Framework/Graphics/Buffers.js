/**
 * @file Graphics/Buffers.js
 * @authors Sephelim, Ian
 * @brief This file provides the vertex object and data buffer side of
 * graphics programming with Selenium. Included are functions that make it
 * incredibly ease to create a vertex object from an array of positions.
 * @since 0.0.3
 *
 * @license AGPLv3
 * @copyright (c) 2025 the Selenium Development Team
 * This source file is under the AGPLv3. For information on what that
 * means, see the LICENSE.md file that should have been provided alongside
 * this project, or https://www.gnu.org/licenses/agpl-3.0.md.
 */
"use strict";

// #region Module Dependencies

import {Selenium_Assets} from "../Assets.js";
import {Selenium_Utilities} from "../Utilities.js";

import {GL} from "./GL.js";

// #endregion Module Dependencies
// #region Namespace Declarations

/**
 * The object buffer subnamespace of the graphics space. This provides
 * logic for creating things like vertex objects.
 * @since 0.0.3
 */
var Selenium_Graphics_Buffers = Selenium_Graphics_Buffers || {};
Selenium_Graphics_Buffers.__proto__ = null;

/**
 * you are repsonsible for configuring layout
 * @param {Float32Array} positions
 * @returns {[WebGLVertexArrayObject, WebGLBuffer]}
 */
Selenium_Graphics_Buffers.VO = function(positions) {
    const vao = GL.createVertexArray();
    GL.bindVertexArray(vao);

    const vbo = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, vbo);
    GL.bufferData(GL.ARRAY_BUFFER, positions, GL.STATIC_DRAW);

    return [vao, vbo];
};

/**
 *
 * @param {Float32Array} positions
 * @param {Uint32Array} indices
 * @returns
 */
Selenium_Graphics_Buffers.MO = function(positions, indices) {
    const vao = GL.createVertexArray();
    GL.bindVertexArray(vao);

    const vbo = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, vbo);
    GL.bufferData(GL.ARRAY_BUFFER, positions, GL.STATIC_DRAW);

    const ebo = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, ebo);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, indices, GL.STATIC_DRAW);

    return [vao, vbo, ebo];
};

Selenium_Graphics_Buffers.TO = async function(path) {
    let texture = GL.createTexture();
    GL.bindTexture(GL.TEXTURE_2D, texture);

    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.REPEAT);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.REPEAT);

    GL.texParameteri(
        GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);

    const image = await Selenium_Assets.LoadImage("Textures/" + path);
    if (image == null)
    {
        Selenium_Utilities.Error("Failed to load texture.");
        return null;
    }

    GL.texImage2D(
        GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, image);
    GL.generateMipmap(GL.TEXTURE_2D);

    return texture;
};

// #endregion Namespace Declarations
// #region Module Exports

export {Selenium_Graphics_Buffers};

// #endregion Module Exports
