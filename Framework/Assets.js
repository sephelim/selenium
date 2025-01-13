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
import {Selenium_Logging} from "./Logging.js";
import {Selenium_Utilities} from "./Utilities.js";

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
        case 400: Selenium_Logging.Error("Bad request."); return;
        case 401: Selenium_Logging.Error("Unauthorized."); return;
        case 403: Selenium_Logging.Error("Forbidden."); return;
        case 404: Selenium_Logging.Error("Not found."); return;
        case 408: Selenium_Logging.Error("Request timeout."); return;
        case 414: Selenium_Logging.Error("URI too long."); return;
        case 415: Selenium_Logging.Error("Unsupported media."); return;
        case 429: Selenium_Logging.Error("Too many requests."); return;
        default:  return false;
    }
}

/**
 * Decide where the given configuration file type is located.
 * @authors Sephelim
 * @since 0.0.1
 *
 * @param {ConfigType} type The type of configuration file.
 * @returns {string} The decided location.
 */
function DecideConfigLocation(type)
{
    switch (type)
    {
        case "global": return "/";
    }
}

/**
 * Validate that the given section name is valid in the the context of the
 * given config type.
 * @authors Sephelim
 * @since 0.0.1
 *
 * @param {ConfigType} type The type of config this section is within.
 * @param {string} name The given section name.
 * @returns {boolean} Whether or not the section name is valid.
 */
function CheckSectionName(type, name)
{
    switch (type)
    {
        case "global":
            if (name != "Selenium" && name != "Game") return false;
            return true;
    }
}

/**
 * Validate whether the given key name makes sense in the given config type
 * and section name. You should validate the section name before calling
 * this function.
 * @authors Sephelim
 * @since 0.0.1
 *
 * @param {ConfigType} type The type of config we're working on.
 * @param {string} section The name of the section this key is within.
 * @param {string} name The key.
 * @returns {boolean} Whether or not the key is valid.
 */
function CheckKeyName(type, section, name)
{
    switch (type)
    {
        case "global":
            if (section == "Selenium")
            {
                if (name != "mode" && name != "fatality_level")
                    return false;
                return true;
            }

            // [Game] section
            if (name != "title" && name != "short" && name != "author" &&
                name != "description" && name != "keywords" &&
                name != "license")
                return false;
            return true;
    }
}

/**
 * Validate the given subkey within the context of the key, section, and
 * config type. Both section validation and key validation should be done
 * before this function.
 * @authors Sephelim
 * @since 0.0.1
 *
 * @param {ConfigType} type The type of config we're working on.
 * @param {string} section The name of the section we're currently in.
 * @param {string} name The name of the key this subkey belongs to.
 * @param {string} subname The subkey.
 * @returns {boolean} Whether or not the subkey is valid.
 */
function CheckSubkeyName(type, section, name, subname)
{
    switch (type)
    {
        case "global":
            if (section == "Selenium") return false;

            if (subname == "short")
            {
                if (name != "title") return false;
                return true;
            }

            return false;
    }
}

/**
 * Parse the value of a given string based off of the key it was assigned
 * to. You should check the validity of the key and section before calling
 * this function.
 * @authors Sephelim
 * @since 0.0.1
 *
 * @param {ConfigType} type The type of config we're currently loading.
 * @param {string} section The section we're in.
 * @param {string} key The key this value was assigned to.
 * @param {string} value The value string loaded.
 * @returns {any} The parsed value.
 */
function ParseValue(type, section, key, value)
{
    switch (type)
    {
        case "global":
            if (section == "Selenium")
            {
                if (key == "mode")
                {
                    if (value == "Debug") return 0;
                    if (value == "Release") return 1;
                }
                else
                {
                    if (value == "All") return 0;
                    else if (value == "Errors") return 1;
                    else if (value == "Panics") return 2;
                    else Selenium_Logging.Panic("Malformed game config.");
                }
            }

            if (key == "keywords")
            {
                const keywords = value.split(",");
                // Really, really inefficient, but keywords are not
                // typically particularly long so who cares.
                keywords.forEach(
                    (v, i) => {
                        keywords[i] = v.replaceAll(
                            Selenium_Utilities.Regexes.get("space"), "")});
                return keywords;
            }
            return value;
    }
}

/**
 * Parse a config file in the (mostly) standard Unix INI format.
 * @authors Sephelim
 * @since 0.0.1
 *
 * @param {ConfigType} type The type of config to parse this as.
 * @param {string} contents The string that represents the loaded file.
 * @returns {ConfigBody} The parsed file.
 */
function ParseConfig(type, contents)
{
    let parsed_contents = new Map();

    // Strip leading/trailing spaces, split on newlines, and remove
    // empty lines/comments.
    const lines =
        contents.replaceAll(Selenium_Utilities.Regexes.get("space"), "")
            .split("\n")
            .filter((v) => v != "" && v[0] != "#" && v[0] != ";");

    let section_name = "";
    let key = "";
    let section = new Map();

    for (const line of lines)
    {
        if (line[0] == "[")
        {
            if (section_name != "")
                parsed_contents.set(section_name, section);

            let section_name_temp = line.substring(1, line.length - 1);
            if (!CheckSectionName(type, section_name_temp))
            {
                if (type == "global")
                    Selenium_Logging.Panic("Malformed game config.");
                else
                {
                    Selenium_Logging.Warning("Malformed config section.");
                    continue;
                }
            }
            section_name = section_name_temp;
            section = new Map();
            continue;
        }

        if (line[0] != "\t")
        {
            key = line.substring(0, line.indexOf("="));
            if (!CheckKeyName(type, section_name, key))
                Selenium_Logging.Panic("Malformed game config.");

            const value_string = line.substring(line.indexOf("=") + 1);
            const value =
                ParseValue(type, section_name, key, value_string);
            section.set(key, [value, new Map()]);
        }
        else
        {
            let subkey = line.substring(1, line.indexOf("="));
            if (!CheckSubkeyName(type, section_name, key, subkey))
                Selenium_Logging.Panic("Malformed game config.");

            const value_string = line.substring(line.indexOf("=") + 1);
            section.get(key)[1].set(subkey, value_string);
        }
    }

    // Push any trailing sections to the map.
    if (section_name != "") parsed_contents.set(section_name, section);

    if (type == "global")
    {
        const engine_section = parsed_contents.get("Selenium");
        const game_section = parsed_contents.get("Game");
        if (engine_section == undefined || game_section == undefined)
            Selenium_Logging.Panic("Malformed game config.");

        if (engine_section.get("mode") == undefined ||
            game_section.get("title") == undefined ||
            game_section.get("author") == undefined ||
            game_section.get("license") == undefined)
            Selenium_Logging.Panic("Malformed game config.");
    }

    return parsed_contents;
}

// #endregion Private Utilities
// #region Namespace Declaration

/**
 * The Selenium asset loading interface. This provides logic for
 * loading things like fonts and images.
 * @since 0.0.1
 */
var Selenium_Assets = Selenium_Assets || {};

/**
 * A configuration file's contents. This is split into sections based
 * off its contents and type.
 * @since 0.0.1
 */
Selenium_Assets.Configuration = class
{
    /**
     * The type of file this is.
     * @type {ConfigType}
     * @since 0.0.1
     */
    type;
    /**
     * The contents of the file, split into sections.
     * @type {ConfigBody}
     * @since 0.0.1
     */
    contents;

    /**
     * Create a config structure from the body of a loaded config file.
     * @authors Sephelim
     * @since 0.0.1
     *
     * @param {ConfigType} type The type of config we're parsing.
     * @param {string} contents The loaded string contents of the
     *     config file.
     */
    constructor(type, contents)
    {
        this.type = type;
        this.contents = ParseConfig(type, contents);
        Selenium_Logging.Success("Loaded config of type '" + type + "'.");
    }
}

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

    Selenium_Logging.Log("Loading file from '" + path + "'.");
    try
    {
        file = await fetch(path);
    }
    catch (error)
    {
        Selenium_Logging.Error(
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
 * @returns {Promise<ImageBitmap>} The loaded image.
 */
Selenium_Assets.LoadImage = async function(path) {
    const file_response = await Selenium_Assets.LoadFile(
        "/" + Selenium_Data.GetShortTitle() + "_Assets/" + path);
    return await createImageBitmap(await file_response.blob());
};

/**
 * Load a configuration file.
 * @authors Sephelim
 * @since 0.0.1
 *
 * @param {ConfigType} type The type of configuration file we're
 *     loading.
 * @param {string} name The basename of the configuration file.
 */
Selenium_Assets.LoadConfiguration = async function(type, name) {
    const file_path = DecideConfigLocation(type) + name + ".sconfig";
    const file = await Selenium_Assets.LoadFile(file_path);
    if (file == null) return null;

    return new Selenium_Assets.Configuration(type, await file.text());
};

/**
 * Load and compile a complete WebGL shader.
 * @authors Sephelim
 * @since 0.0.3
 *
 * @param {WebGL2RenderingContext} gl The WebGL rendering context of the
 *     application.
 * @param {string} name The name of the shader. This is the folder searched
 *     for within the game assets > shaders folder.
 */
Selenium_Assets.LoadShader = async function(gl, name) {
    const base_path =
        Selenium_Data.GetAssetDirectory() + "/Shaders/" + name;
    const vertex_path = base_path + "/vertex.vs";
    const fragment_path = base_path + "/fragment.fs";

    const vertex_file = await Selenium_Assets.LoadFile(vertex_path);
    const fragment_file = await Selenium_Assets.LoadFile(fragment_path);
    if (vertex_file == null || fragment_file == null) return null;

    let vertex_shader = gl.createShader(gl.VERTEX_SHADER);
    let fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertex_shader, await vertex_file.text());
    gl.shaderSource(fragment_shader, await fragment_file.text());

    gl.compileShader(vertex_shader);
    if (gl.getShaderParameter(vertex_shader, gl.COMPILE_STATUS) == true)
        console.log("error?");

    // unsigned int vertexShader = glCreateShader(GL_VERTEX_SHADER);
    // glShaderSource(vertexShader, 1, &vertexShaderSource, NULL);
    // glCompileShader(vertexShader);
    // // check for shader compile errors
    // int success;
    // char infoLog[512];
    // glGetShaderiv(vertexShader, GL_COMPILE_STATUS, &success);
    // if (!success)
    // {
    //     glGetShaderInfoLog(vertexShader, 512, NULL, infoLog);
    //     std::cout << "ERROR::SHADER::VERTEX::COMPILATION_FAILED\n" <<
    //     infoLog << std::endl;
    // }
    // // fragment shader
    // unsigned int fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);
    // glShaderSource(fragmentShader, 1, &fragmentShaderSource, NULL);
    // glCompileShader(fragmentShader);
    // // check for shader compile errors
    // glGetShaderiv(fragmentShader, GL_COMPILE_STATUS, &success);
    // if (!success)
    // {
    //     glGetShaderInfoLog(fragmentShader, 512, NULL, infoLog);
    //     std::cout << "ERROR::SHADER::FRAGMENT::COMPILATION_FAILED\n" <<
    //     infoLog << std::endl;
    // }
    // // link shaders
    // unsigned int shaderProgram = glCreateProgram();
    // glAttachShader(shaderProgram, vertexShader);
    // glAttachShader(shaderProgram, fragmentShader);
    // glLinkProgram(shaderProgram);
    // // check for linking errors
    // glGetProgramiv(shaderProgram, GL_LINK_STATUS, &success);
    // if (!success) {
    //     glGetProgramInfoLog(shaderProgram, 512, NULL, infoLog);
    //     std::cout << "ERROR::SHADER::PROGRAM::LINKING_FAILED\n" <<
    //     infoLog << std::endl;
    // }
    // glDeleteShader(vertexShader);
    // glDeleteShader(fragmentShader);
};

// #endregion Namespace Declaration
// #region Module Exports

/**
 * @typedef {"global"} ConfigType The type of a config. This provides
 * the loader information like where to find the file, what to expect
 * within it, and more.
 * @since 0.0.1
 *
 * @typedef {Map<string, Map<string, [any, Map<string, any>]>>} ConfigBody
 * The body of a configuration file. This is split via key names, with one
 * level of possible nesting.
 * @since 0.0.1
 *
 * @typedef {"vertex" | "fragment"} ShaderType The possible types a shader
 * can have.
 * @since 0.0.3
 */

export {Selenium_Assets};

// #endregion Module Exports
