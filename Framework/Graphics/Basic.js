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

/**
 *
 * @param {TileOrientation} orientation
 * @param {number} scale
 * @param {Color} color
 * @returns {WebGLVertexArrayObject}
 */
Selenium_Graphics_Basic.CreateTile = function(orientation, scale, color) {
    switch (orientation)
    {
        case "up":
            const size = 1.0 * scale;
            const object = [
                size, size, 0.0, color.r, color.g, color.b, // top right
                0.0, size, 0.0, color.r, color.g, color.b,  // top left
                size, 0.0, 0.0, color.r, color.g, color.b,  // bottom right
                0.0, 0.0, 0.0, color.r, color.g, color.b,   // bottom left
                size, 0.0, 0.0, color.r, color.g, color.b,  // bottom right
                0.0, size, 0.0, color.r, color.g, color.b   // top left
            ];
            return Selenium_Graphics_Buffers.CreateVertexObject(
                new Float32Array(object));
    }
};

// #endregion Namespace Declaration
// #region Module Exports

/**
 * @typedef {"up"} TileOrientation
 */

export {Selenium_Graphics_Basic};

// #endregion Module Exports
