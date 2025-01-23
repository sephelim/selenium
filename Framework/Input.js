/**
 * @file Input.js
 * @authors Sephelim
 * @brief This file provides the Selenium input interface. That includes
 * things like keyboard and mouse events.
 * @since 0.0.5
 *
 * @license AGPLv3
 * @copyright (c) 2025 the Selenium Development Team
 * This source file is under the AGPLv3. For information on what that
 * means, see the LICENSE.md file that should have been provided alongside
 * this project, or https://www.gnu.org/licenses/agpl-3.0.md.
 */

// #region Module Dependencies

import {Selenium_Input_Keyboard} from "./Input/Keyboard.js";
import {Selenium_Input_Mouse} from "./Input/Mouse.js";

// #endregion Module Dependencies
// #region Namespace Declaration

/**
 * The Selenium input namespace. This contains all things to do with input;
 * keymaps, rebinding keys, dealing with clicking and dragging, ecetera.
 * @since 0.0.5
 */
var Selenium_Input = Selenium_Input || {};
Selenium_Input.__proto__ = null;

/**
 * The Selenium keyboard subnamespace of the input space. This contains
 * specifically keyboard-related input things, like loading keymaps and
 * re-binding keys.
 * @since 0.0.5
 */
Selenium_Input.Keyboard = Selenium_Input_Keyboard;

/**
 * The Selenium mouse subnamespace of the input space. This contains
 * specifically mouse-related input things, like handling dragging and
 * clicking.
 * @since 0.0.5
 */
Selenium_Input.Mouse = Selenium_Input_Mouse;

// #endregion Namespace Declaration
// #region Module Exports

export {Selenium_Input};

// #endregion Module Exports
