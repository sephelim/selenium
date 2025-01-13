/**
 * @file Data.js
 * @authors Sephelim
 * @brief This file provides the Selenium interface for storing metadata
 * data about the running game.
 * @since 0.0.2
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
 * Data about the engine and the game currently running. This contains
 * things like title, log severity, and more.
 * @since 0.0.2
 */
var Selenium_Data = Selenium_Data || {};
Selenium_Data.__proto__ = null;

/**
 * The debug/release mode of the engine. This enables/disables things like
 * warning and success logging.
 * @type {number}
 * @since 0.0.2
 */
Selenium_Data.Mode = 0;

/**
 * The fatality level of errors. This is panics-only by default.
 * @type {number}
 * @since 0.0.2
 */
Selenium_Data.Fatality = 2;

/**
 * The game's title.
 * @since 0.0.2
 */
Selenium_Data.Title = {
    /**
     * The long title.
     * @type {string}
     * @since 0.0.2
     */
    value: "",
    /**
     * The short title.
     * @type {string | null}
     * @since 0.0.2
     */
    short: null
};

/**
 * The game's author.
 * @type {string}
 * @since 0.0.2
 */
Selenium_Data.Author = "";

/**
 * The game's description.
 * @type {string | null}
 * @since 0.0.2
 */
Selenium_Data.Description = null;

/**
 * An array of the game's keywords.
 * @type {string[]}
 * @since 0.0.2
 */
Selenium_Data.Keywords = [];

/**
 * The game's license.
 * @since 0.0.2
 */
Selenium_Data.License = {
    /**
     * The license's name.
     * @type {string}
     * @since 0.0.2
     */
    value: "",
    /**
     * The body of the license.
     * @type {string}
     * @since 0.0.2
     */
    body: ""
};

/**
 * The game's README.
 * @type {string | null}
 * @since 0.0.2
 */
Selenium_Data.Readme = null;

/**
 * The current game deltatime, or the difference between last frame's speed
 * and this frame's.
 * @type {number}
 * @since 0.0.3
 */
Selenium_Data.Deltatime = 0;

/**
 * The current game FPS.
 * @type {number}
 * @since 0.0.3
 */
Selenium_Data.FPS = 0;

/**
 * Get the shortest set title of the game.
 * @authors Sephelim
 * @since 0.0.2
 *
 * @returns {string} Either the long or short title, depending on if the
 *     short title's been set.
 */
Selenium_Data.GetShortTitle = function() {
    if (Selenium_Data.Title.short != null)
        return Selenium_Data.Title.short;
    return Selenium_Data.Title.value;
};

Selenium_Data.GetAssetDirectory =
    function() { return Selenium_Data.GetShortTitle() + "_Assets"; };

// #endregion Namespace Declaration
// #region Module Exports

/**
 * @typedef {function(WebGL2RenderingContext):void} Renderer A function
 * called every frame to render the game.
 * @since 0.0.3
 *
 * @typedef {function():void} LogicLine A function called every frame after
 * the renderer to handle game updates.
 * @since 0.0.3
 */

export {Selenium_Data};

// #endregion Module Exports
