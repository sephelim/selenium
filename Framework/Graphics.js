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

import {Selenium_Graphics_Shaders} from "./Graphics/Shaders.js";

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
 * The WebGL context for the engine, or null should one not have yet been
 * bound.
 * @type {WebGL2RenderingContext}
 * @since 0.0.3
 */
Selenium_Graphics.GL = null;

/**
 * The WebGL context for the engine, or null should one not have yet been
 * bound.
 * @type {WebGL2RenderingContext}
 * @since 0.0.3
 */
globalThis.GL = null;

/**
 * The shader subnamespace of the graphics space. This provides
 * functionality for loading and using shaders.
 * @since 0.0.3
 */
Selenium_Graphics.Shaders = Selenium_Graphics_Shaders;

/**
 * Clears the screen to a pure white.
 * @authors Sephelim
 * @since 0.0.3
 */
Selenium_Graphics.ClearScreen = function() {
    GL.clear(GL.COLOR_BUFFER_BIT);
    GL.clearColor(1.0, 1.0, 1.0, 1.0);
};

// #endregion Namespace Declaration
// #region Module Exports

export {Selenium_Graphics};

// #endregion Module Exports
