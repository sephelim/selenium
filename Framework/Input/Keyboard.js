/**
 * @file Keyboard.js
 * @authors Sephelim
 * @brief This file provides the Selenium keyboard input interface. That
 * includes things like loading keymaps.
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

import {Selenium_Assets} from "../Assets.js";

// #endregion Module Dependencies
// #region Private Utilities

/**
 * Construct an array of a key and its attributes into an array.
 * @authors Sephelim
 * @since 0.0.5
 *
 * @param {KeyboardEvent} ev The event fired.
 * @returns {[string, boolean, boolean, boolean, boolean]} The key
 *     attribute array, starting with the key code as reported and then a
 *     boolean for the following states (in order); shift, alt, control,
 *     meta.
 */
function ConstructKey(ev)
{
    return [ev.code, ev.shiftKey, ev.altKey, ev.ctrlKey, ev.metaKey];
}

/**
 * Handle a keydown event. This can either output a keypress or keyrepeat.
 * @authors Sephelim
 * @since 0.0.5
 *
 * @param {KeyboardEvent} ev The event fired.
 */
function HandleDown(ev)
{
    const callbacks =
        (ev.repeat ? Selenium_Input_Keyboard.Map.get("Hold") :
                     Selenium_Input_Keyboard.Map.get("Press"));
    if (callbacks == null) return;

    const key = ConstructKey(ev);
    const callback = callbacks.get(key[0]);
    if (callback == null) return;

    if (callback[1].get("tolerant"))
    {
        // @ts-ignore This is bound at load-time.
        callback[0]();
        return;
    }

    if (!callback[1].has("shift") && key[1] == true) return;
    if (!callback[1].has("alt") && key[2] == true) return;
    if (!callback[1].has("control") && key[3] == true) return;
    if (!callback[1].has("meta") && key[4] == true) return;

    // @ts-ignore This is bound at load-time.
    callback[0]();
    return;
}

/**
 * Handle a keyup event.
 * @authors Sephelim
 * @since 0.0.5
 *
 * @param {KeyboardEvent} ev The event fired.
 */
function HandleRelease(ev)
{
    const callbacks = Selenium_Input_Keyboard.Map.get("Release");
    if (callbacks == null) return;

    const key = ConstructKey(ev);
    const callback = callbacks.get(key[0]);
    if (callback == null) return;

    if (callback[1].get("tolerant"))
    {
        // @ts-ignore This is bound at load-time.
        callback[0]();
        return;
    }

    if (!callback[1].has("shift") && key[1] == true) return;
    if (!callback[1].has("alt") && key[2] == true) return;
    if (!callback[1].has("control") && key[3] == true) return;
    if (!callback[1].has("meta") && key[4] == true) return;

    // @ts-ignore This is bound at load-time.
    callback[0]();
    return;
}

// #endregion Private Utilities
// #region Namespace Declaration

/**
 * The Selenium keyboard subnamespace of the input space. This contains
 * specifically keyboard-related input things, like loading keymaps and
 * re-binding keys.
 * @since 0.0.5
 */
var Selenium_Input_Keyboard = Selenium_Input_Keyboard || {};
Selenium_Input_Keyboard.__proto__ = null;

/**
 * The currently assigned keymap.
 * @type {Keymap}
 * @since 0.0.5
 */
Selenium_Input_Keyboard.Map = new Map();

/**
 * A map of keyboard callbacks that may be triggered on key press events.
 * This may be filled out throughout the program; for example, the camera
 * movement callbacks are defined in the Camera.js file.
 * @type {KeyCallbackMap}
 * @since 0.0.5
 */
Selenium_Input_Keyboard.PressCallbacks = new Map();

/**
 * A map of keyboard callbacks that may be triggered on key hold events.
 * This may be filled out throughout the program; for example, the camera
 * movement callbacks are defined in the Camera.js file.
 * @type {KeyCallbackMap}
 * @since 0.0.5
 */
Selenium_Input_Keyboard.HoldCallbacks = new Map();

/**
 * A map of keyboard callbacks that may be triggered on key release events.
 * This may be filled out throughout the program; for example, the camera
 * movement callbacks are defined in the Camera.js file.
 * @type {KeyCallbackMap}
 * @since 0.0.5
 */
Selenium_Input_Keyboard.ReleaseCallbacks = new Map();

/**
 * Load a keymap into memory.
 * @authors Sephelim
 * @since 0.0.5
 *
 * @param {string} name The basename of the keymap file.
 */
Selenium_Input_Keyboard.LoadMap = async function(name) {
    const loaded_map =
        await Selenium_Assets.LoadConfiguration("keymap", name);
    if (loaded_map == null) return;
    Selenium_Input_Keyboard.Map = loaded_map.contents;
};

/**
 * Enable keyboard input.
 * @authors Sephelim
 * @since 0.0.5
 */
Selenium_Input_Keyboard.Enable = function() {
    window.addEventListener("keydown", HandleDown);
    window.addEventListener("keyup", HandleRelease);
};

/**
 * Disable keyboard input.
 * @authors Sephelim
 * @since 0.0.5
 */
Selenium_Input_Keyboard.Disable = function() {
    window.removeEventListener("keydown", HandleDown);
    window.removeEventListener("keyup", HandleRelease);
};

// #endregion Namespace Declaration
// #region Module Exports

/**
 * @callback KeyCallback A callback function triggered once a key is
 * pressed.
 * @param {any[]} args Any extra arguments to be passed to the callback
 *     function.
 * @returns {void} Nothing.
 * @since 0.0.5
 *
 * @typedef {Map<string, Map<string, [KeyCallback, Map<string, any>]>>}
 * Keymap A map of keyboard callbacks. This is basically a renamed
 * ConfigBody.
 * @since 0.0.5
 *
 * @typedef {Map<string, KeyCallback>} KeyCallbackMap A map of key
 * callbacks.
 * @since 0.0.5
 */

export {Selenium_Input_Keyboard};

// #endregion Module Exports
