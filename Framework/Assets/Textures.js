/**
 * @file Assets/Textures.js
 * @authors Sephelim
 * @brief This file provides the texture side of graphics programming with
 * Selenium. This includes the global texture table, functions to insert
 * items into said table, and functions for properly binding textures.
 * @since 0.0.6
 *
 * @license AGPLv3
 * @copyright (c) 2025 the Selenium Development Team
 * This source file is under the AGPLv3. For information on what that
 * means, see the LICENSE.md file that should have been provided alongside
 * this project, or https://www.gnu.org/licenses/agpl-3.0.md.
 */
"use strict";

// #region Module Dependencies

import {Selenium_Assets} from "../Assets.js"; // Import cycle, but it doesn't affect anything.
import {Selenium_Utilities} from "../Utilities.js";

import {GL} from "../Graphics/GL.js";

// #endregion Module Dependencies
// #region Namespace Declaration

var Selenium_Assets_Textures = Selenium_Assets_Textures || {};
Selenium_Assets_Textures.__proto__ = null;

Selenium_Assets_Textures.Loaded = new Map();

Selenium_Assets_Textures.Load = async function(name) {
    // Prevent extraneous load operations.
    if (Selenium_Assets_Textures.Loaded.has(name)) return true;

    let texture = GL.createTexture();
    GL.bindTexture(GL.TEXTURE_2D, texture);

    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.REPEAT);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.REPEAT);

    GL.texParameteri(
        GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);

    const image = await Selenium_Assets.LoadImage("Textures/" + name);
    if (image == null)
    {
        Selenium_Utilities.Error("Failed to load texture.");
        return false;
    }

    // All images are converted to RGBA when loaded via typical JS methods,
    // so this works perfectly fine with GL.RGBA always.
    GL.texImage2D(
        GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, image);
    GL.generateMipmap(GL.TEXTURE_2D);

    Selenium_Assets_Textures.Loaded.set(name, texture);
    GL.bindTexture(GL.TEXTURE_2D, null);
    return true;
};

// #endregion Namespace Declaration
// #region Module Exports

export {Selenium_Assets_Textures};

// #endregion Module Exprots
