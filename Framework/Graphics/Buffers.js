/**
 * @file Graphics/Buffers.js
 * @authors Sephelim
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

// #region Namespace Declarations

var Selenium_Graphics_Buffers = Selenium_Graphics_Buffers || {};
Selenium_Graphics_Buffers.__proto__ = null;

/**
 *
 * @param {Float32Array} positions
 * @returns {WebGLBuffer}
 */
Selenium_Graphics_Buffers.CreateVertexObject = function(positions) {
    const created_buffer = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, created_buffer);
    GL.bufferData(GL.ARRAY_BUFFER, positions, GL.STATIC_DRAW);

    return created_buffer;
};

// #endregion Namespace Declarations
// #region Module Exports

export {Selenium_Graphics_Buffers};

// #endregion Module Exports
