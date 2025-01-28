/**
 * @file Assets/Fonts.js
 * @authors Sephelim
 * @brief This file provides functionality for loading and formatting
 * compressed font bitmap files.
 * @since 0.0.6
 *
 * @note Much of the infastructure in this file has existed since
 * v0.0.1, but it only became its own file in v0.0.6.
 *
 * @license AGPLv3
 * @copyright (c) 2025 the Selenium Development Team
 * This source file is under the AGPLv3. For information on what that
 * means, see the LICENSE.md file that should have been provided alongside
 * this project, or https://www.gnu.org/licenses/agpl-3.0.md.
 */
"use strict";

// #region Module Dependencies

import {Selenium_Assets_Textures} from "./Textures.js";

// #endregion Module Dependencies
// #region Namespace Declaration

var Selenium_Assets_Fonts = Selenium_Assets_Fonts || {};
Selenium_Assets_Fonts.__proto__ = null;

Selenium_Assets_Fonts.Loaded = new Map();

/**
 *
 * @param {string} name
 * @returns
 */
Selenium_Assets_Fonts.Register = function(name) {
    const file_name = "Fonts/" + name + ".png";
    const success = Selenium_Assets_Textures.Register(file_name);
    if (!success) return false;

    const size = Number(name.substring(name.indexOf("-") + 1));
    Selenium_Assets_Fonts.Loaded.set(name, [file_name, size]);
};

Selenium_Assets_Fonts.GetLetter = function(font, letter) {

};

// #endregion Namespace Declaration
// #region Module Exports

export {Selenium_Assets_Fonts};

// #endregion Module Exports
