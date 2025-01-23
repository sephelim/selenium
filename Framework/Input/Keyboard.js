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
 *
 * @param {KeyboardEvent} ev
 * @returns {[string, boolean, boolean, boolean, boolean]}
 */
function ConstructKey(ev)
{
    return [ev.code, ev.shiftKey, ev.altKey, ev.ctrlKey, ev.metaKey];
}

/**
 *
 * @param {KeyboardEvent} ev
 */
function HandleDown(ev)
{
    let callbacks;

    if (ev.repeat) callbacks = Selenium_Input_Keyboard.Map.get("Hold");
    else callbacks = Selenium_Input_Keyboard.Map.get("Press");
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
    callback[1]();
    return;
}

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
    callback[1]();
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
 * @type {Map<string, KeyCallback>}
 */
Selenium_Input_Keyboard.PressCallbacks = new Map([]);

/**
 * @type {Map<string, KeyCallback>}
 */
Selenium_Input_Keyboard.HoldCallbacks = new Map([]);

/**
 * @type {Map<string, KeyCallback>}
 */
Selenium_Input_Keyboard.ReleaseCallbacks = new Map([]);

Selenium_Input_Keyboard.LoadMap = async function(name) {
    const loaded_map =
        await Selenium_Assets.LoadConfiguration("keymap", name);
    if (loaded_map == null) return;
    Selenium_Input_Keyboard.Map = loaded_map.contents;
};

Selenium_Input_Keyboard.Enable = function() {
    window.addEventListener("keydown", HandleDown);
    window.addEventListener("keyup", HandleRelease);
};

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
 */

export {Selenium_Input_Keyboard};

// #endregion Module Exports
