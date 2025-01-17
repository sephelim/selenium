/**
 * @file Graphics.js
 * @authors Sephelim
 * @brief This file provides the Selenium general graphics interface. This
 * provides several useful global functions, alongside the various
 * subcomponents it pulls in.
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

import {Selenium_Graphics_Basic} from "./Graphics/Basic.js";
import {Selenium_Graphics_Buffers} from "./Graphics/Buffers.js";
import {Selenium_Graphics_Shaders} from "./Graphics/Shaders.js";

import {GLMatrix} from "../Dependencies/GLMatrix.js";

/**
 * @import * as GLM from "../Dependencies/GLMatrix.js"
 */

// #endregion Module Dependencies
// #region Namespace Declaration

/**
 * The Selenium graphics namespace. This provides all the functionality
 * needed to render complex objects easily.
 * @since 0.0.3
 */
var Selenium_Graphics = Selenium_Graphics || {};
Selenium_Graphics.__proto__ = null;

/**
 * The basic rendering subnamespace of the graphics space.  This provides
 * the ability to render a primitive shape like a rectangle sans any
 * boilerplate.
 * @since 0.0.4
 */
Selenium_Graphics.Basic = Selenium_Graphics_Basic;

/**
 * The object buffer subnamespace of the graphics space. This provides
 * logic for creating things like vertex objects.
 * @since 0.0.3
 */
Selenium_Graphics.Buffers = Selenium_Graphics_Buffers;

/**
 * The shader subnamespace of the graphics space. This provides
 * functionality for loading and using shaders.
 * @since 0.0.3
 */
Selenium_Graphics.Shaders = Selenium_Graphics_Shaders;

/**
 * The WebGL context for the engine, or null should one not have yet been
 * bound.
 * @type {WebGL2RenderingContext}
 * @since 0.0.3
 */
Selenium_Graphics.GL = null;

/**
 * The current projection matrix of the game. This is, by defaut, set in
 * the global resize method. To disable this behavior, set
 * Selenium_Graphics.CustomProjection to true.
 * @type {GLM.Mat4}
 * @since 0.0.4
 */
Selenium_Graphics.Projection = GLMatrix.Mat4.create();

/**
 * A boolean flag representing whether or not a custom projection is set as
 * the current one. This disabled certain things, like automatic
 * recalculation on window resize.
 * @type {boolean}
 * @since 0.0.4
 */
Selenium_Graphics.CustomProjection = false;

/**
 * The WebGL context for the engine, or null should one not have yet been
 * bound.
 * @type {WebGL2RenderingContext}
 * @since 0.0.3
 */
globalThis.GL = null;

/**
 * Clears the screen to a pure color.
 * @authors Sephelim
 * @since 0.0.3
 *
 * @param {GLclampf} r The red component of the color to clear screen to.
 * @param {GLclampf} g The green component of the color to clear screen to.
 * @param {GLclampf} b The blue component of the color to clear screen to.
 */
Selenium_Graphics.ClearScreen = function(r, g, b) {
    GL.clearColor(r, g, b, 1.0);
    GL.clearDepth(1.0);
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
};

// #endregion Namespace Declaration
// #region Module Exports

export {Selenium_Graphics};

// #endregion Module Exports
