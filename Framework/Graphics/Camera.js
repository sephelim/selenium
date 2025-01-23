/**
 * @file Graphics/Camera.js
 * @authors Sephelim, Ian
 * @brief This file provides functionality for creating and utilizing a
 * camera within Selenium. This includes things like 4-dimensional
 * movement, inertia, etcetera.
 * @since 0.0.5
 *
 * @license AGPLv3
 * @copyright (c) 2025 the Selenium Development Team
 * This source file is under the AGPLv3. For information on what that
 * means, see the LICENSE.md file that should have been provided alongside
 * this project, or https://www.gnu.org/licenses/agpl-3.0.md.
 */
"use strict";

// #region Module Dependencies

import {Selenium_Logging} from "../Logging.js";

import {Selenium_Graphics_Shaders} from "./Shaders.js";

import {Selenium_Input_Keyboard} from "../Input/Keyboard.js";

import {GLMatrix} from "../../Dependencies/GLMatrix.js";

/**
 * @import {Position} from "../Graphics.js"
 * @import {Mat4} from "../../Dependencies/GLMatrix.js"
 */

// #endregion Module Dependencies
// #region Private Utilities

let up_movement_interval = 0;
let down_movement_interval = 0;
let left_movement_interval = 0;
let right_movement_interval = 0;

// #endregion Private Utilities
// #region Namespace Declaration

/**
 * The Selenium camera subnamespace of the camera space. This provides
 * functionality for setting and moving the camera view matrix.
 * @since 0.0.5
 */
var Selenium_Graphics_Camera = Selenium_Graphics_Camera || {};
Selenium_Graphics_Camera.__proto__ = null;

/**
 * The actual position of the camera. Because of the isometric projection,
 * the X axis goes to the bottom right (positive), the Z axis goes to the
 * bottom (negative), and the Y axis goes to the bottom left (positive).
 * @type {Mat4}
 * @since 0.0.5
 */
Selenium_Graphics_Camera.Position = GLMatrix.Mat4.create();

/**
 * Set the view matrix of the given shader.
 * @authors Sephelim
 * @since 0.0.5
 *
 * @param {string} shader The shader to set. This must have a 4x4
 *     matrix uniform named view_matrix, or this call will do nothing.
 */
Selenium_Graphics_Camera.SetView = function(shader) {
    Selenium_Graphics_Shaders.SetUniform(
        shader, "m4_view_matrix", Selenium_Graphics_Camera.Position);
};

/**
 * Set the position of the camera.
 * @authors Ian
 * @since 0.0.5
 *
 * @param {string} shader The shader for which to set the camera's
 *     position.
 * @param {number} x The x coordinte to move to.
 * @param {number} y The y coordinte to move to.
 * @param {number} z The z coordinte to move to.
 */
Selenium_Graphics_Camera.SetPosition = function(shader, x, y, z) {
    GLMatrix.Mat4.fromTranslation(Selenium_Graphics_Camera.Position,
        GLMatrix.Vec3.fromValues(x, y, z));
    Selenium_Graphics_Camera.SetView(shader);
};

Selenium_Input_Keyboard.PressCallbacks.set("MoveCamera", function(args) {
    if (args == undefined || typeof (args[0]) != "string")
    {
        Selenium_Logging.Warning(
            "Keyboard callback 'MoveCamera' provided malformed arguments.");
        return;
    }

    switch (args[0])
    {
        case "up":
            up_movement_interval = setInterval(() => {
                GLMatrix.Mat4.translate(Selenium_Graphics_Camera.Position,
                    Selenium_Graphics_Camera.Position,
                    GLMatrix.Vec3.fromValues(0, 0, -1));
                Selenium_Graphics_Camera.SetView(
                    Selenium_Graphics_Shaders.Use.current_name);
            }, 5);
            break;
        case "down":
            down_movement_interval = setInterval(() => {
                GLMatrix.Mat4.translate(Selenium_Graphics_Camera.Position,
                    Selenium_Graphics_Camera.Position,
                    GLMatrix.Vec3.fromValues(0, 0, 1));
                Selenium_Graphics_Camera.SetView(
                    Selenium_Graphics_Shaders.Use.current_name);
            }, 5);
            break;
        case "left":
            left_movement_interval = setInterval(() => {
                GLMatrix.Mat4.translate(Selenium_Graphics_Camera.Position,
                    Selenium_Graphics_Camera.Position,
                    GLMatrix.Vec3.fromValues(1, 0, 0.5));
                Selenium_Graphics_Camera.SetView(
                    Selenium_Graphics_Shaders.Use.current_name);
            }, 5);
            break;
        case "right":
            right_movement_interval = setInterval(() => {
                GLMatrix.Mat4.translate(Selenium_Graphics_Camera.Position,
                    Selenium_Graphics_Camera.Position,
                    GLMatrix.Vec3.fromValues(-1, 0, -0.5));
                Selenium_Graphics_Camera.SetView(
                    Selenium_Graphics_Shaders.Use.current_name);
            }, 5);
            break;
        default:
            Selenium_Logging.Warning(
                "Keyboard callback 'MoveCamera' provided malformed arguments.");
            return;
    }
});

Selenium_Input_Keyboard.ReleaseCallbacks.set("StopCamera", function(args) {
    if (args == undefined || typeof (args[0]) != "string")
    {
        Selenium_Logging.Warning(
            "Keyboard callback 'MoveCamera' provided malformed arguments.");
        return;
    }

    switch (args[0])
    {
        case "up":    clearInterval(up_movement_interval); break;
        case "down":  clearInterval(down_movement_interval); break;
        case "left":  clearInterval(left_movement_interval); break;
        case "right": clearInterval(right_movement_interval); break;
        default:
            Selenium_Logging.Warning(
                "Keyboard callback 'MoveCamera' provided malformed arguments.");
            return;
    }
});

// #endregion Namespace Declaration
// #region Module Exports

export {Selenium_Graphics_Camera};

// #endregion Module Exports
