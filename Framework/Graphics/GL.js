/**
 * @file Graphics/GL.js
 * @authors Sephelim
 * @brief This file provides the WebGL context for the engine, along with
 * a helper function to get it configured correctly. Note that this file is
 * an outlier and does not export a namespace, instead the LoadGL function
 * (to be inserted into the graphics namespace) and the GL handle, which is
 * for use throughout the program.
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

import {Selenium_Utilities} from "../Utilities.js";

// #endregion Module Dependencies
// #region Namespace Declaration

/**
 * The WebGL context for the engine, or null should one not have yet been
 * bound.
 * @type {WebGL2RenderingContext}
 * @since 0.0.6
 */
var GL = null;

/**
 * Load a WebGL context for the game.
 * @authors Sephelim
 * @since 0.0.6
 */
function LoadGL()
{
    const view_canvas = document.getElementById("view");
    if (view_canvas instanceof HTMLCanvasElement)
        GL = view_canvas.getContext("webgl2", {antialias: false});
    else Selenium_Utilities.Panic("Missing view canvas!");

    GL.enable(GL.DEPTH_TEST);
}

// #endregion Namespace Declaration
// #region Module Exports

export {GL, LoadGL};

// #endregion Module Exports
