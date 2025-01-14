/**
 * @file Selenium.js
 * @authors Sephelim
 * @brief The base file of the Selenium framework. This provides connection
 * to all other interfaces--and such interfaces should not be included
 * directly.
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

import {Selenium_Assets} from "./Framework/Assets.js";
import {Selenium_Data} from "./Framework/Data.js";
import {Selenium_Graphics} from "./Framework/Graphics.js";
import {Selenium_Logging} from "./Framework/Logging.js";
import {Selenium_Utilities} from "./Framework/Utilities.js";

/**
 * @import {ConfigBody} from "./Framework/Assets.js"
 * @import {Renderer, LogicLine} from "./Framework/Data.js"
 */

// #endregion Module Dependencies
// #region Private Utilities

/**
 * The time it took to render/update last frame.
 * @type {DOMHighResTimeStamp}
 * @since 0.0.3
 */
let last_frame_time = performance.now();

/**
 * The time that the last frame batch began. This is reset every second.
 * @type {DOMHighResTimeStamp}
 * @since 0.0.3
 */
let frame_batch_start = performance.now();

/**
 * The amount of frames rendered in the last second.
 * @type {number}
 * @since 0.0.3
 */
let frame_count = 0;

/**
 * The game's render function.
 * @type {Renderer}
 * @since 0.0.3
 */
let renderer = () => {};

/**
 * The game's logic line.
 * @type {LogicLine}
 * @since 0.0.3
 */
let logic_line = () => {};

/**
 * Enter all config data into the global data structure.
 * @authors Sephelim
 * @since 0.0.2
 *
 * @param {ConfigBody} global_config The loaded global config.
 */
function EnterGameData(global_config)
{
    const engine_section = global_config.get("Selenium");
    Selenium.Data.Mode = engine_section.get("mode")[0];
    const fatality_level = engine_section.get("fatality_level");
    if (fatality_level != undefined)
        Selenium.Data.Fatality = fatality_level[0];

    const game_section = global_config.get("Game");
    Selenium.Data.Title.value = game_section.get("title")[0];
    const short_title = game_section.get("title")[1].get("short");
    if (short_title != undefined) Selenium.Data.Title.short = short_title;

    Selenium.Data.Author = game_section.get("author")[0];
    const description = game_section.get("description");
    if (description != undefined)
        Selenium.Data.Description = description[0];
    const keywords = game_section.get("keywords");
    if (keywords != undefined) Selenium.Data.Keywords = keywords[0];

    Selenium.Data.License.value = game_section.get("license")[0];
    Selenium.Logging.Success("Created game data interface.");
}

/**
 * Load the license and README of the game.
 * @authors Sephelim
 * @since 0.0.2
 */
async function LoadGameDocuments()
{
    Selenium.Logging.Log("Grabbing license and README.");
    const license_response = await Selenium.Assets.LoadFile("/LICENSE.md");
    const readme_response = await Selenium.Assets.LoadFile("/README.md");

    if (license_response != null)
    {
        Selenium.Data.License.body = await license_response.text();
        Selenium.Logging.Success("Found license.");
    }
    else Selenium.Logging.Panic("Missing license.");
    // We don't panic here because READMEs are not necessarily required.
    if (readme_response != null)
    {
        Selenium.Data.Readme = await readme_response.text();
        Selenium.Logging.Success("Found README.");
    }
}

/**
 * Construct the DOM in the format the engine expects it to be. This also
 * attempts to load a favicon file at the game's asset directory >
 * Icon.png.
 * @authors Sephelim
 * @since 0.0.2
 */
function ConstructDocument()
{
    document.head.innerHTML = `
        <!-- Site Metadata -->
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="charset" content="UTF-8">
        <!-- Document Metadata -->
        <meta name="generator" content="Selenium">
        <title>${Selenium.Data.Title.value}</title>
        <meta name="application-name" content=${
        Selenium.Data.GetShortTitle()}>
        <meta name="author" content="${Selenium.Data.Author}">
        <meta name="description" content="${Selenium.Data.Description}">
        <meta name="keywords" content="${Selenium.Data.Keywords}">
        <!-- Resources -->
        <link rel="icon" type="image/x-icon" href="/${
        Selenium.Data.GetShortTitle()}_Assets/Icon.png">
        <style>
            body {
                width: 100vw;
                height: 100vh;
                overflow: hidden;
                margin: 0;
                padding: 0;
            }
            
            canvas {
                width: 100%;
                height: 100%;
            }
        </style>
    `;

    document.body.innerHTML = `
        <!-- The render target. -->
        <canvas id="view" width=${window.innerWidth} height=${
        window.innerHeight}></canvas>
    `;
}

/**
 * Render exactly one frame.
 * @authors Sephelim
 * @since 0.0.3
 *
 * @param {DOMHighResTimeStamp} time The time that the previous frame
 *     finished rendering.
 */
function HandleFrame(time)
{
    Selenium.Data.Deltatime = time - last_frame_time;
    last_frame_time = time;

    if (time - frame_batch_start > 1000)
    {
        Selenium.Data.FPS = frame_count;
        frame_batch_start = time;
        frame_count = 0;
    }
    else frame_count++;

    renderer(GL);
    logic_line();

    requestAnimationFrame(HandleFrame);
}

// #endregion Private Utilities
// #region Namespace Declaration

/**
 * The global Selenium interface. This object contains all there is to see
 * in regards to the Selenium framework.
 * @since 0.0.1
 */
var Selenium = Selenium || {};
Selenium.__proto__ = null;

/**
 * The Selenium asset loading interface. This provides logic for loading
 * things like fonts and images.
 * @since 0.0.1
 */
Selenium.Assets = Selenium_Assets;

/**
 * The Selenium graphics namespace. This provides all the functionality
 * needed to render complex objects easily.
 * @since 0.0.3
 */
Selenium.Graphics = Selenium_Graphics;

/**
 * The Selenium logging namespace. This provides logic for logging
 * strings to the console and pushing them into the log buffer, along
 * with things like stack traces.
 * @since 0.0.1
 */
Selenium.Logging = Selenium_Logging;

/**
 * Miscellaneous utility objects, like general-purpose regexes and
 * extensions to existing Javascript objects.
 * @since 0.0.1
 */
Selenium.Utilities = Selenium_Utilities;

/**
 * Data about the engine and the game currently running. This contains
 * things like title, log severity, and more.
 * @since 0.0.2
 */
Selenium.Data = Selenium_Data;

/**
 * Begin the engine's runtime. This loads all needed
 * resources into memory, and unlocks the ability to
 * start the rendering and logic loops of your game.
 * @authors Sephelim
 * @since 0.0.2
 */
Selenium.Start = async function() {
    const global_config =
        await Selenium.Assets.LoadConfiguration("global", "Game");
    EnterGameData(global_config.contents);
    await LoadGameDocuments();
    ConstructDocument();

    const view_canvas = document.getElementById("view");
    if (view_canvas instanceof HTMLCanvasElement)
        Selenium.Graphics.GL = view_canvas.getContext("webgl2");
    else Selenium.Logging.Panic("Missing view canvas!");
    globalThis.GL = Selenium.Graphics.GL;

    window.onresize = () => {
        GL.canvas.width = window.innerWidth;
        GL.canvas.height = window.innerHeight;
    };

    // Load in the game entry function and call it.
    const entry_script = await import(
        "/" + Selenium.Data.GetShortTitle() + "_Scripts/Entry.js");
    if (entry_script.Main == undefined ||
        typeof (entry_script.Main) != "function")
        Selenium.Logging.Panic("Missing script entrypoint.");

    entry_script.Main();
    window.requestAnimationFrame(HandleFrame);
};

/**
 * Register a rendering function. This will be called every frame to render
 * the game's contents.
 * @authors Sephelim
 * @since 0.0.3
 *
 * @param {Renderer} render_function The render function.
 */
Selenium.RegisterRenderer = function(
    render_function) { renderer = render_function; };

/**
 * Register a logic function. This will be called every frame after the
 * renderer to update the game's contents.
 * @authors Sephelim
 * @since 0.0.3
 *
 * @param {LogicLine} logic_function The logic function.
 */
Selenium.RegisterLogicLine = function(
    logic_function) { logic_line = logic_function; };

// #endregion Namespace Declaration
// #region Module Exports

export {Selenium};

// #endregion Module Exports
