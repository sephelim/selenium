/**
 * @file Utilities.js
 * @authors Sephelim
 * @brief This file provides the Selenium utility interface. This simply
 * contains miscellaneous useful things for use in the engine and outside
 * the engine.
 * @since 0.0.1
 *
 * @license AGPLv3
 * @copyright (c) 2025 the Selenium Development Team
 * This source file is under the AGPLv3. For information on what that
 * means, see the LICENSE.md file that should have been provided alongside
 * this project, or https://www.gnu.org/licenses/agpl-3.0.md.
 */
"use strict";

// #region Namespace Declaration

/**
 * Miscellaneous utility objects, like general-purpose regexes and
 * extensions to existing Javascript objects.
 * @since 0.0.1
 */
var Selenium_Utilities = Selenium_Utilities || {};
Selenium_Utilities.__proto__ = null;

/**
 * A group of useful general-purpose regexes, like ones to remove spaces
 * and the like.
 * @since 0.0.3
 */
Selenium_Utilities.Regexes =
    new Map([["space", new RegExp(/^ +| +$| +(?= )/gm)]]);
/**
 * A function to resize the canvas to fit the screen
 * @since 0.0.3
 */
Selenium_Utilities.resizeCanvas = function () {
    GL.canvas.width = window.innerWidth;
    GL.canvas.height = window.innerHeight;
    GL.viewport(0, 0, window.innerWidth, window.innerHeight);
}
// #endregion Namespace Declaration
// #region Module Exports

export { Selenium_Utilities };

// #endregion Module Exports
