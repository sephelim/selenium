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
import {GL, LoadGL} from "./Graphics/GL.js";
import {Selenium_Graphics_Text} from "./Graphics/Text.js";

import {Selenium_Input_Keyboard} from "./Input/Keyboard.js";

import {GLMatrix} from "../Dependencies/GLMatrix.js";

/**
 * @import {Mat4} from "../Dependencies/GLMatrix.js"
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

Selenium_Graphics.Text = Selenium_Graphics_Text;

/**
 * Load a WebGL context for the game.
 * @authors Sephelim
 * @since 0.0.6
 */
Selenium_Graphics.LoadGL = LoadGL;

/**
 * The current projection matrix of the game. This is set in the global
 * resize method.
 * @type {Mat4}
 * @since 0.0.4
 */
Selenium_Graphics.Projection = GLMatrix.Mat4.create();

Selenium_Graphics.ScaleFactor = 1.0;

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

/**
 * Scale the contents of the screen by the specified factor. This is an
 * expensive operation, as it involves recalculating the entire view
 * matrix.
 * @authors Sephelim
 * @since 0.0.5
 *
 * @param {GLclampf} factor The factor by which to change the projection's
 *     current scale.
 */
Selenium_Graphics.Scale = function(factor) {
    Selenium_Graphics.ScaleFactor += factor;

    // The near/far planes are meaningless-Z is rotated 45 degrees.
    GLMatrix.Mat4.ortho(Selenium_Graphics.Projection, 0, window.innerWidth,
        window.innerHeight, 0, -window.innerHeight * 100,
        window.innerWidth * 100);

    // 90 - 35.264 (~arcsin(tan 30°))
    GLMatrix.Mat4.rotateX(Selenium_Graphics.Projection,
        Selenium_Graphics.Projection, GLMatrix.ToRadians(54.736));
    GLMatrix.Mat4.rotateZ(Selenium_Graphics.Projection,
        Selenium_Graphics.Projection, GLMatrix.ToRadians(45));

    GLMatrix.Mat4.scale(Selenium_Graphics.Projection,
        Selenium_Graphics.Projection,
        GLMatrix.Vec3.fromValues(Selenium_Graphics.ScaleFactor,
            Selenium_Graphics.ScaleFactor, Selenium_Graphics.ScaleFactor));
};

Selenium_Input_Keyboard.PressCallbacks.set("Scale", function(args) {
    //! arg checking needed
    if (args[0] == "up") Selenium_Graphics.Scale(0.25);
    else Selenium_Graphics.Scale(-0.25);
});

// #endregion Namespace Declaration
// #region Module Exports

/**
 * @typedef {Object} Color A normalized RGB color.
 * @property {GLclampf} r The normalized red component of the color.
 * @property {GLclampf} g The normalized green component of the color.
 * @property {GLclampf} b The normalized blue component of the color.
 *
 * @typedef {Object} Position A 3D position.
 * @property {number} x The X coordinate of the position.
 * @property {number} y The Y coordinate of the position.
 * @property {number} z The Z coordinate of the position.
 */

export {Selenium_Graphics};

// #endregion Module Exports
