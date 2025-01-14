/**
 * @file Graphics/GL.js
 * @authors Sephelim
 * @brief This file provides one single thing; the WebGL context for the
 * engine.
 * @since 0.0.3
 *
 * @license AGPLv3
 * @copyright (c) 2025 the Selenium Development Team
 * This source file is under the AGPLv3. For information on what that
 * means, see the LICENSE.md file that should have been provided alongside
 * this project, or https://www.gnu.org/licenses/agpl-3.0.md.
 */
"use strict";

/**
 * The WebGL context currently active, or null if one has not yet been
 * created.
 * @type {WebGL2RenderingContext}
 * @since 0.0.3
 */
let gl = null;

/**
 * Bind a WebGL context. Before this function call a canvas element with
 * the ID "view" must have been created.
 * @authors Sephelim
 * @since 0.0.3
 */
function BindGL()
{
    // @ts-ignore This is a canvas element.
    gl = document.getElementById("view").getContext("webgl2");
}

// #region Module Exports

export {gl, BindGL};

// #endregion Module Exports
