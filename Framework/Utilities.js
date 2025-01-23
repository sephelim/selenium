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

// #region Module Dependencies

import {Selenium_Logging} from "./Logging.js";

/**
 * @import {KeyCallback} from "./Input/Keyboard.js"
 */

// #endregion Module Dependencies
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

//! figure out a place for these minus an import cycle

/**
 * @type {Map<string, KeyCallback>}
 */
Selenium_Utilities.PressCallbacks = new Map([[
    "MoveCamera",
    function(args) {
        if (typeof (args[0]) != "string")
        {
            Selenium_Logging.Warning(
                "Keyboard callback 'MoveCamera' provided malformed arguments.");
            return;
        }
    }
]]);

/**
 * @type {Map<string, KeyCallback>}
 */
Selenium_Utilities.HoldCallbacks = new Map([[
    "MoveCamera",
    function(args) {
        console.log(args);
        if (args == undefined || typeof (args[0]) != "string")
        {
            Selenium_Logging.Warning(
                "Keyboard callback 'MoveCamera' provided malformed arguments.");
            return;
        }
    }
]]);

/**
 * @type {Map<string, KeyCallback>}
 */
Selenium_Utilities.ReleaseCallbacks = new Map([[
    "StopCamera",
    function(_args) {
        // inertia here
    }
]]);

// #endregion Namespace Declaration
// #region Module Exports

export {Selenium_Utilities};

// #endregion Module Exports
