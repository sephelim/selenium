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

import {Selenium_Utilities} from "../Utilities.js";

import {Selenium_Graphics_Shaders} from "../Graphics/Shaders.js";

import {Selenium_Input_Keyboard} from "../Input/Keyboard.js";

import {GLMatrix} from "../../Dependencies/GLMatrix.js";

/**
 * @import {KeyCallback} from "../Input/Keyboard.js"
 * @import {Mat4} from "../../Dependencies/GLMatrix.js"
 */

// #endregion Module Dependencies
// #region Private Utilities

/**
 * The last shader that was bound to the camera. This is used for setting
 * the view matrix without direct user interaction (through intervals).
 * @type {string}
 * @since 0.0.6
 */
let last_shader = "";

/**
 * The interval ID for upward movement. Should this be null, it means the
 * camera is not moving upward at all.
 * @type {number | null}
 * @since 0.0.5
 */
let up_movement_interval = null;

/**
 * The interval ID for downward movement. Should this be null, it means the
 * camera is not moving downward at all.
 * @type {number}
 * @since 0.0.5
 */
let down_movement_interval = null;

/**
 * The interval ID for leftward movement. Should this be null, it means the
 * camera is not moving leftward at all.
 * @type {number}
 * @since 0.0.5
 */
let left_movement_interval = null;

/**
 * The interval ID for leftward movement. Should this be null, it means the
 * camera is not moving leftward at all.
 * @type {number}
 * @since 0.0.5
 */
let right_movement_interval = null;

/**
 * Create a movement interval.
 * @authors Sephelim
 * @since 0.0.5
 *
 * @param {number} x The amount to move in the X direction.
 * @param {number} y The amount to move in the Y direction.
 * @param {number} z The amount to move in the Z direction.
 * @returns {number} The ID of the created interval.
 */
function MovementInterval(x, y, z)
{
    return setInterval(() => {
        GLMatrix.Mat4.translate(Selenium_Input_Camera.Position,
            Selenium_Input_Camera.Position,
            GLMatrix.Vec3.fromValues(x, y, z));
        // This is...not good? Maybe? Probably unnoticeable in 99% of
        // cases.
        Selenium_Input_Camera.SetView();
    }, 5);
}

/**
 * The keyboard callback for moving the camera. This just decided in what
 * direction we should be moving, and continues from there.
 * @authors Sephelim
 * @since 0.0.5
 *
 * @type {KeyCallback}
 */
function MoveCamera(args)
{
    if (args == undefined || typeof (args[0]) != "string")
    {
        Selenium_Utilities.Warning(
            "MoveCamera provided malformed arguments.");
        return;
    }

    switch (args[0])
    {
        case "up":
            if (up_movement_interval != null) return;
            up_movement_interval =
                MovementInterval(0, 0, -Selenium_Input_Camera.Speed);
            break;
        case "down":
            if (down_movement_interval != null) return;
            down_movement_interval =
                MovementInterval(0, 0, Selenium_Input_Camera.Speed);
            break;
        case "left":
            if (left_movement_interval != null) return;
            left_movement_interval =
                MovementInterval(Selenium_Input_Camera.Speed, 0,
                    Selenium_Input_Camera.Speed / 2);
            break;
        case "right":
            if (right_movement_interval != null) return;
            right_movement_interval =
                MovementInterval(-Selenium_Input_Camera.Speed, 0,
                    -Selenium_Input_Camera.Speed / 2);
            break;
        default:
            Selenium_Utilities.Warning(
                "MoveCamera provided malformed arguments.");
            return;
    }
}

/**
 * The keyboard callback for stopping the camera. This just decided in what
 * direction we should be stopping, and clearing the interval corresponding
 * to that movement type.
 * @authors Sephelim
 * @since 0.0.5
 *
 * @type {KeyCallback}
 */
function StopCamera(args)
{
    if (args == undefined || typeof (args[0]) != "string")
    {
        Selenium_Utilities.Warning(
            "StopCamera provided malformed arguments.");
        return;
    }

    switch (args[0])
    {
        case "up":
            clearInterval(up_movement_interval);
            up_movement_interval = null;
            break;
        case "down":
            clearInterval(down_movement_interval);
            down_movement_interval = null;
            break;
        case "left":
            clearInterval(left_movement_interval);
            left_movement_interval = null;
            break;
        case "right":
            clearInterval(right_movement_interval);
            right_movement_interval = null;
            break;
        default:
            Selenium_Utilities.Warning(
                "StopCamera provided malformed arguments.");
            return;
    }
}

// #endregion Private Utilities
// #region Namespace Declaration

/**
 * The Selenium camera subnamespace of the camera space. This provides
 * functionality for setting and moving the camera view matrix.
 * @since 0.0.5
 */
var Selenium_Input_Camera = Selenium_Input_Camera || {};
Selenium_Input_Camera.__proto__ = null;

/**
 * The actual position of the camera. Because of the isometric projection,
 * the X axis goes to the bottom right (positive), the Z axis goes to the
 * bottom (negative), and the Y axis goes to the bottom left (positive).
 * @type {Mat4}
 * @since 0.0.5
 */
Selenium_Input_Camera.Position = GLMatrix.Mat4.create();

/**
 * The movement speed of the camera.
 *
 * @warning Known bug: the camera moves faster on the diagonal. This is
 * because of the Pythagorean theorem, which states the hypotenuse of a
 * triangle is the square root of leg1^2 + leg2^2--our current method
 * simply uses this value for all movement angles.
 *
 * @type {number}
 * @since 0.0.5
 */
Selenium_Input_Camera.Speed = 1.0;

/**
 * Set the view matrix of the given shader.
 * @authors Sephelim
 * @since 0.0.5
 *
 * @param {string} shader The shader to set. This must have a 4x4
 *     matrix uniform named view_matrix, or this call will do nothing.
 */
Selenium_Input_Camera.SetView = function(shader = last_shader) {
    last_shader = shader;
    Selenium_Graphics_Shaders.SetUniform(
        shader, "m4_view_matrix", Selenium_Input_Camera.Position);
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
Selenium_Input_Camera.SetPosition = function(shader, x, y, z) {
    GLMatrix.Mat4.fromTranslation(
        Selenium_Input_Camera.Position, GLMatrix.Vec3.fromValues(x, y, z));
    Selenium_Input_Camera.SetView(shader);
};

// #endregion Namespace Declaration
// #region Module Exports

Selenium_Input_Keyboard.PressCallbacks.set("MoveCamera", MoveCamera);
Selenium_Input_Keyboard.ReleaseCallbacks.set("StopCamera", StopCamera);

export {Selenium_Input_Camera};

// #endregion Module Exports
