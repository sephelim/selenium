/**
 * @file Graphics/Camera.js
 * @authors Sephelim
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

import {Selenium_Graphics_Shaders} from "./Shaders.js";

import {GLMatrix} from "../../Dependencies/GLMatrix.js";

/**
 * @import {Position} from "../Graphics.js"
 */

// #endregion Module Dependencies
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
 * @type {Position}
 * @since 0.0.5
 */
Selenium_Graphics_Camera.Position = {
    x: 0,
    y: 0,
    z: 0
};

/**
 * The amount in milliseconds before position changes are committed to the
 * camera's actual position.
 * @since 0.0.5
 */
Selenium_Graphics_Camera.CommitTimer = {
    /**
     * The count of milliseconds between a movement and a commit.
     * @type {number}
     * @since 0.0.5
     */
    value: 50,
    /**
     * The actual interval ID of the commit. Should this be zero, no commit
     * is currently pending.
     * @type {number}
     * @since 0.0.5
     */
    timer: 0
};

/**
 * Set the view matrix of the given shader. This is an expensive function,
 * and should only be done when absolutely necessary.
 * @authors Sephelim
 * @since 0.0.5
 *
 * @param {string} shader The shader to set. This must have a 4x4
 *     matrix uniform named view_matrix, or this call will do nothing.
 */
Selenium_Graphics_Camera.SetView = function(shader) {
    const position_vector = GLMatrix.Vec3.fromValues(
        Selenium_Graphics_Camera.Position.x,
        Selenium_Graphics_Camera.Position.y,
        Selenium_Graphics_Camera.Position.z,
    );

    let position_matrix = GLMatrix.Mat4.create();
    GLMatrix.Mat4.translate(
        position_matrix, position_matrix, position_vector);

    Selenium_Graphics_Shaders.SetUniform(
        shader, "m4_view_matrix", position_matrix);
};

/**
 * Move the camera by an amount.
 * @authors Sephelim
 * @since 0.0.5
 *
 * @param {number} x The amount to move the camera on the X axis.
 * @param {number} x The amount to move the camera on the Y axis.
 * @param {number} x The amount to move the camera on the Z axis.
 */
Selenium_Graphics_Camera.Move = function(x, y, z) {
    Selenium_Graphics_Camera.Move.x += x;
    Selenium_Graphics_Camera.Move.y += y;
    Selenium_Graphics_Camera.Move.z += z;

    if (Selenium_Graphics_Camera.CommitTimer.timer == 0)
        Selenium_Graphics_Camera.CommitTimer.timer = setInterval(() => {
            Selenium_Graphics_Camera.Commit();
            clearInterval(Selenium_Graphics_Camera.CommitTimer.timer);
            Selenium_Graphics_Camera.CommitTimer.timer = 0;
        }, Selenium_Graphics_Camera.CommitTimer.value);
};

Selenium_Graphics_Camera.Move.x = 0;
Selenium_Graphics_Camera.Move.y = 0;
Selenium_Graphics_Camera.Move.z = 0;

Selenium_Graphics_Camera.Commit = function() {
    Selenium_Graphics_Camera.Position.x += Selenium_Graphics_Camera.Move.x;
    Selenium_Graphics_Camera.Position.y += Selenium_Graphics_Camera.Move.y;
    Selenium_Graphics_Camera.Position.z += Selenium_Graphics_Camera.Move.z;

    Selenium_Graphics_Camera.Move.x = 0;
    Selenium_Graphics_Camera.Move.y = 0;
    Selenium_Graphics_Camera.Move.z = 0;

    Selenium_Graphics_Camera.SetView(
        Selenium_Graphics_Shaders.Use.current_name);
};

// #endregion Namespace Declaration
// #region Module Exports

export {Selenium_Graphics_Camera};

// #endregion Module Exports
