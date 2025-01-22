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

import {GLMatrix} from "../../Dependencies/GLMatrix.js";

// #endregion Module Dependencies
// #region Namespace Declaration

var Selenium_Graphics_Camera = Selenium_Graphics_Camera || {};
Selenium_Graphics_Camera.__proto__ = null;

Selenium_Graphics_Camera.Position = {
    x: 0,
    y: 0,
    z: 0
};

Selenium_Graphics_Camera.Matrix = GLMatrix.Mat4.create();

GLMatrix.Mat4.translate(Selenium_Graphics_Camera.Matrix,
    Selenium_Graphics_Camera.Matrix,
    GLMatrix.Vec3.fromValues(Selenium_Graphics_Camera.Position.x,
        Selenium_Graphics_Camera.Position.y,
        Selenium_Graphics_Camera.Position.z));

// #endregion Namespace Declaration
// #region Module Exports

export {Selenium_Graphics_Camera};

// #endregion Module Exports
