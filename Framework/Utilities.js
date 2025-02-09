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

import {Selenium_Data} from "./Data.js";

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

/**
 * The buffer of the last 50 logs that have been emitted.
 * @type {LogObject[]}
 * @since 0.0.1
 */
Selenium_Utilities.LogBuffer = [];

/**
 * Get a stacktrace.
 * @authors Sephelim
 * @since 0.0.1
 *
 * @returns {StackTrace}
 */
Selenium_Utilities.GetStackTrace = function() {
    let raw_trace = [];
    try
    {
        throw Error();
    }
    catch (e)
    {
        raw_trace = e.stack;
    }

    const whitespace_regex =
        new RegExp(/^[^\S\r\n]+|[^\S\r\n]+$|[^\S\r\n]+(?=[^\S\r\n])/gm);
    // Replace all non-newline whitespace, split on newline, and remove
    // the first element ("Error: ").
    raw_trace = raw_trace.replaceAll(whitespace_regex, "").split("\n");
    raw_trace = raw_trace.slice(1);

    let trace = [];
    for (let i = 0; i < raw_trace.length; i++)
    {
        const raw_trace_element = raw_trace[i];
        let trace_element = {};

        const file_name =
            raw_trace_element
                .substring(raw_trace_element.indexOf(document.URL) +
                               document.URL.length,
                    raw_trace_element.lastIndexOf(":"))
                .split(":");

        trace_element.file = file_name[0];
        trace_element.line = Number(file_name[1]);

        trace_element.function = raw_trace_element.substring(
            raw_trace_element.indexOf("at") + 3,
            raw_trace_element.indexOf(" ("));

        trace.push(trace_element);
    }

    // @ts-ignore This is in StackTrace format.
    return trace;
};

/**
 * Log the beginning of an operation or just general data.
 * @authors Sephelim
 * @since 0.0.2
 *
 * @param {string} string The string to log.
 */
Selenium_Utilities.Log = function(string) {
    // Remove log overflow.
    if (Selenium_Utilities.LogBuffer.length >= 50)
        Selenium_Utilities.LogBuffer.shift();

    console.log("[LOG] " + string);
    Selenium_Utilities.LogBuffer.push({
        timestamp: performance.now(),
        trace: Selenium_Utilities.GetStackTrace(),
        message: string
    });
};

/**
 * Log a successful operation.
 * @authors Sephelim
 * @since 0.0.1
 *
 * @param {string} string The string to log.
 */
Selenium_Utilities.Success = function(string) {
    // Remove log overflow.
    if (Selenium_Utilities.LogBuffer.length >= 50)
        Selenium_Utilities.LogBuffer.shift();

    console.log("%c[SUC] %c" + string, "color:green", "color:default");
    Selenium_Utilities.LogBuffer.push({
        timestamp: performance.now(),
        trace: Selenium_Utilities.GetStackTrace(),
        message: string
    });
};

/**
 * Log a warning about an operation. Should the engine's fatality level be
 * set to "all", this will be fatal.
 * @authors Sephelim
 * @since 0.0.1
 *
 * @param {string} string The string to log.
 */
Selenium_Utilities.Warning = function(string) {
    // Remove log overflow.
    if (Selenium_Utilities.LogBuffer.length >= 50)
        Selenium_Utilities.LogBuffer.shift();

    console.log("%c[WRN] %c" + string, "color:orange", "color:default");
    Selenium_Utilities.LogBuffer.push({
        timestamp: performance.now(),
        trace: Selenium_Utilities.GetStackTrace(),
        message: string
    });

    if (Selenium_Data.Fatality == 0) throw string;
};

/**
 * Log an error pertaining to an operation. Should the engine's fatality
 * level be set to "errors", this will be fatal.
 * @authors Sephelim
 * @since 0.0.1
 *
 * @param {string} string The string to log.
 */
Selenium_Utilities.Error = function(string) {
    // Remove log overflow.
    if (Selenium_Utilities.LogBuffer.length >= 50)
        Selenium_Utilities.LogBuffer.shift();

    console.log("%c[ERR] %c" + string, "color:darkred", "color:default");
    Selenium_Utilities.LogBuffer.push({
        timestamp: performance.now(),
        trace: Selenium_Utilities.GetStackTrace(),
        message: string
    });

    if (Selenium_Data.Fatality < 2) throw string;
};

/**
 * Log a panic. This kills the game, regardless of fatality level.
 * @authors Sephelim
 * @since 0.0.1
 *
 * @param {string} string The string to log.
 */
Selenium_Utilities.Panic = function(string) {
    // Remove log overflow.
    if (Selenium_Utilities.LogBuffer.length >= 50)
        Selenium_Utilities.LogBuffer.shift();

    console.log("%c[PNC] " + string, "color:red;font-weight:bold");
    Selenium_Utilities.LogBuffer.push({
        timestamp: performance.now(),
        trace: Selenium_Utilities.GetStackTrace(),
        message: string
    });

    throw string;
};

// #endregion Namespace Declaration
// #region Module Exports

/**
 * @typedef {{file:string, line:number, function:string}} StackElement An
 * element of a stack trace. Self-explanatory.
 *
 * @typedef {StackElement[]} StackTrace A stack trace.
 *
 * @typedef {{timestamp:DOMHighResTimeStamp, trace:StackTrace,
 * message:string}} LogObject A logged object. It contains basic
 * information about the log, like its data, timestamp in milliseconds, and
 * stack trace.
 */

export {Selenium_Utilities};

// #endregion Module Exports
