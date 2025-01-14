/**
 * @file Graphics/Shaders.js
 * @authors Sephelim
 * @brief This file provides the shader side of graphics programming with
 * Selenium. Things like loading, compiling, and registering shaders are
 * included here.
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

// #endregion Module Dependencies
// #region Namespace Declarations

/**
 * The shader subnamespace of the graphics space. This provides
 * functionality for loading and using shaders.
 * @since 0.0.3
 */
var Selenium_Graphics_Shaders = Selenium_Graphics_Shaders || {};
Selenium_Graphics_Shaders.__proto__ = null;

/**
 * A hashmap of the loaded scenes keyed by their name.
 * @type {Map<string, WebGLProgram>}
 * @since 0.0.3
 */
Selenium_Graphics_Shaders.Loaded = new Map();

/**
 * Load a shader from its file and register it with the engine.
 * @authors Sephelim
 * @since 0.0.3
 *
 * @param {string} name The name of the shader's folder within assets >
 *     shaders.
 * @returns {Promise<boolean>} A flag representing the success state of the
 *     shader's compilation.
 */
Selenium_Graphics_Shaders.Register = async function(name) {
    const shader = await Selenium_Assets.LoadShader(name);
    if (shader == null) return false;
    Selenium_Graphics_Shaders.Loaded.set(name, shader);
    return true;
};

/**
 * Get a shader that has been loaded in the past.
 * @authors Sephelim
 * @since 0.0.3
 *
 * @param {string} name The name of the shader to get.
 * @returns {WebGLProgram | null} The shader, or null if a shader with the
 *     given name didn't exist.
 */
Selenium_Graphics_Shaders.Get = function(name) {
    const shader = Selenium_Graphics_Shaders.Loaded.get(name);
    if (shader == undefined) return null;
    return shader;
};

/**
 * Set a shader as the currently used one.
 * @authors Sephelim
 * @since 0.0.3
 *
 * @param {string} name The name of the shader to get.
 * @returns {boolean} A flag representing whether or not we were able to
 *     find the requested shader.
 */
Selenium_Graphics_Shaders.Use = function(name) {
    const shader = Selenium_Graphics_Shaders.Loaded.get(name);
    if (shader == undefined) return false;
    GL.useProgram(shader);
    return true;
};

// #endregion Namespace Declarations
// #region Module Exports

export {Selenium_Graphics_Shaders};

// #endregion Module exports
