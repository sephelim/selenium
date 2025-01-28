/**
 * @file Assets.js
 * @authors Sephelim
 * @brief This file provides the Selenium interface for loading asset
 * files, such as images, fonts, and configuration files.
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

import {Selenium_Data} from "./Data.js";
import {Selenium_Utilities} from "./Utilities.js";

import {Selenium_Assets_Configurations} from "./Assets/Configurations.js";
import {Selenium_Assets_Fonts} from "./Assets/Fonts.js";
import {Selenium_Assets_Shaders} from "./Assets/Shaders.js";
import {Selenium_Assets_Textures} from "./Assets/Textures.js";

// #endregion Module Dependencies
// #region Private Utilities

/**
 * Handle the failure of a file load. This mostly just involves logging the
 * failure to the console.
 * @authors Sephelim
 * @since 0.0.1
 *
 * @param {Response} response The response returned.
 * @returns {boolean} Whether or not the application can continue.
 */
function HandleResponse(response)
{
    switch (response.status)
    {
        case 200: return true; // Success!
        case 400: Selenium_Utilities.Error("Bad request."); return;
        case 401: Selenium_Utilities.Error("Unauthorized."); return;
        case 403: Selenium_Utilities.Error("Forbidden."); return;
        case 404: Selenium_Utilities.Error("Not found."); return;
        case 408: Selenium_Utilities.Error("Request timeout."); return;
        case 414: Selenium_Utilities.Error("URI too long."); return;
        case 415: Selenium_Utilities.Error("Unsupported media."); return;
        case 429: Selenium_Utilities.Error("Too many requests."); return;
        default:  return false;
    }
}

// #endregion Private Utilities
// #region Namespace Declaration

/**
 * The Selenium asset loading interface. This provides logic for
 * loading things like fonts and images.
 * @since 0.0.1
 */
var Selenium_Assets = Selenium_Assets || {};
Selenium_Assets.__proto__ = null;

/**
 * The configuration subnamespace of the asset space. This provides
 * functionality for loading and parsing INI-style configuration files.
 * @since 0.0.6
 */
Selenium_Assets.Configurations = Selenium_Assets_Configurations;

/**
 * The shader subnamespace of the asset space. This provides functionality
 * for loading and using shaders.
 * @since 0.0.3
 */
Selenium_Assets.Shaders = Selenium_Assets_Shaders;

Selenium_Assets.Textures = Selenium_Assets_Textures;

Selenium_Assets.Fonts = Selenium_Assets_Fonts;

/**
 * Load a file from the given path.
 * @authors Sephelim
 * @since 0.0.1
 *
 * @param {string} path The path to the file.
 * @returns {Promise<Response | null>} The file loaded, or null should
 *     the load have failed.
 */
Selenium_Assets.LoadFile = async function(path) {
    let file = null;

    Selenium_Utilities.Log("Loading file from '" + path + "'.");
    try
    {
        file = await fetch(path);
    }
    catch (error)
    {
        Selenium_Utilities.Error(
            "Failed to load file at path'" + path + "'.");
        return null;
    }

    const success = HandleResponse(file);
    if (!success) return null;
    return file;
};

/**
 * Load an image buffer from within the game asset directory.
 * @authors Sephelim
 * @since 0.0.3
 *
 * @param {string} path The path to the file within the game asset
 *     directory.
 * @returns {Promise<ImageBitmap | null>} The loaded image, or null if an
 *     error occurred.
 */
Selenium_Assets.LoadImageBitmap = async function(path) {
    const file_response = await Selenium_Assets.LoadFile(
        "/" + Selenium_Data.GetShortTitle() + "_Assets/" + path);
    if (file_response == null) return null;
    return await createImageBitmap(await file_response.blob());
};

/**
 * Load an image buffer from within the game asset directory.
 * @authors Sephelim
 * @since 0.0.6
 *
 * @param {string} path The path to the file within the game asset
 *     directory.
 * @returns {Promise<HTMLImageElement | null>} The loaded image, or null
 *     if an error occurred.
 */
Selenium_Assets.LoadImage = async function(path) {
    let image = new Image();
    image.src = Selenium_Data.GetAssetDirectory() + "/" + path;

    await new Promise(
        (resolve) => {image.onload = async () => { resolve(true) }});
    return image;
};

// #endregion Namespace Declaration
// #region Module Exports

/**
 * @typedef {"vertex" | "fragment"} ShaderType The possible types a shader
 * can have.
 * @since 0.0.3
 */

export {Selenium_Assets};

// #endregion Module Exports
