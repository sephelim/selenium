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
 * @type {Map<string, Shader>}
 * @since 0.0.3
 */
Selenium_Graphics_Shaders.Loaded = new Map();

/**
 * A shader structure. This contains some information beyond the raw
 * program, notably any already-grabbed shader uniforms.
 * @since 0.0.3
 */
Selenium_Graphics_Shaders.Shader = class
{
    /**
     * The underlying shader program.
     * @type {WebGLProgram}
     * @since 0.0.3
     */
    program;
    /**
     * Any already-grabbed shader uniform and attribute locations.
     * @type {Map<string, WebGLUniformLocation | number>}
     */
    locations;

    /**
     * Create a new shader object.
     * @authors Sephelim
     * @since 0.0.3
     *
     * @param {WebGLProgram} program The already-loaded WebGL program.
     */
    constructor(program)
    {
        this.program = program;
        this.locations = new Map();
    }
}

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
    Selenium_Graphics_Shaders.Loaded.set(
        name, new Selenium_Graphics_Shaders.Shader(shader));
    return true;
};

/**
 * Get a shader that has been loaded in the past.
 * @authors Sephelim
 * @since 0.0.3
 *
 * @param {string} name The name of the shader to get.
 * @returns {Shader | null} The shader, or null if a shader with the given
 *     name didn't exist.
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
    GL.useProgram(shader.program);

    Selenium_Graphics_Shaders.Use.current = shader;
    Selenium_Graphics_Shaders.Use.current_name = name;
    return true;
};

/**
 * The currently used shader program.
 * @type {Shader}
 * @since 0.0.5
 */
Selenium_Graphics_Shaders.Use.current = null;

/**
 * The currently used shader program's name.
 * @type {string}
 * @since 0.0.5
 */
Selenium_Graphics_Shaders.Use.current_name = "";

/**
 * Grab a uniform location from a given preloaded shader.
 * @authors Sephelim
 * @since 0.0.3
 *
 * @param {string} name The name of the shader to load from.
 * @param {string} uniform_name The name of the uniform.
 * @returns {WebGLUniformLocation | null} The uniform location, or null if
 *     something went wrong (shader nonexistant, unknown uniform name,
 *     etc).
 */
Selenium_Graphics_Shaders.GetUniform = function(name, uniform_name) {
    const shader = Selenium_Graphics_Shaders.Loaded.get(name);
    if (shader == undefined) return null;
    const cached_location = shader.locations.get(uniform_name);
    if (cached_location != undefined && cached_location instanceof
                                            WebGLUniformLocation)
        return cached_location;

    const found_location =
        GL.getUniformLocation(shader.program, uniform_name);
    if (found_location == null) return null;
    shader.locations.set(uniform_name, found_location);
    return found_location;
};

/**
 * Grab an attribute location from a given preloaded shader.
 * @authors Sephelim
 * @since 0.0.3
 *
 * @param {string} name The name of the shader to load from.
 * @param {string} attribute_name The name of the attribute.
 * @returns {number | null} The attribute location, or null if
 *     something went wrong (shader nonexistant, unknown attribute name,
 *     etc).
 */
Selenium_Graphics_Shaders.GetAttribute = function(name, attribute_name) {
    const shader = Selenium_Graphics_Shaders.Loaded.get(name);
    if (shader == undefined) return null;
    const cached_location = shader.locations.get(attribute_name);
    if (cached_location != undefined &&
        typeof (cached_location) == "number")
        return cached_location;

    const found_location =
        GL.getAttribLocation(shader.program, attribute_name);
    if (found_location == null) return null;
    shader.locations.set(attribute_name, found_location);
    return found_location;
};

/**
 * Set a uniform within the shader. Note that this system is incredibly
 * rudimentary at the moment--it decides type based off of the first two
 * letters of the uniform name.
 * @authors Sephelim
 * @since 0.0.3
 *
 * @note This "use"s the given shader.
 *
 * @param {string} name The name of the shader whose uniform we're setting.
 * @param {string} uniform_name The string name of the uniform.
 * @param {any} value The value to set the uniform to.
 * @returns {boolean} A flag representing whether or not the operation
 *     succeeded.
 */
Selenium_Graphics_Shaders.SetUniform = function(
    name, uniform_name, value) {
    const location =
        Selenium_Graphics_Shaders.GetUniform(name, uniform_name);
    if (location == null) return false;

    Selenium_Graphics_Shaders.Use(name);
    const uniform_type = uniform_name.substring(0, 2);
    switch (uniform_type)
    {
        case "m4": GL.uniformMatrix4fv(location, false, value); break;
        case "v3": GL.uniform3fv(location, value); break;
    }

    return true;
};

// #endregion Namespace Declarations
// #region Module Exports

/**
 * @typedef {Selenium_Graphics_Shaders.Shader} Shader A shader object.
 * @since 0.0.3
 */

export {Selenium_Graphics_Shaders};

// #endregion Module exports
