![top-banner](./.github/banner.jpg)

---

### Contributions
Selenium is under an [open-source license](https://en.wikipedia.org/wiki/Open_source). This means anyone can come along, find a problem or missing feature, and implement it. However, Selenium has a direction, a set purpose that, when deviated from, further removes the engine from its usecase. This is not what we want, and therefore contributions to Selenium must abide by these contribution guidelines.

---

#### Table of Contents

1. [Code Quality](#code-quality)
    - [Direction](#a-direction)
    - [Optimization](#b-optimization)
    - [Continuity](#c-continuity)
2. [Community Interaction](#community-interaction)
    - [Communication](#a-community)
    - [Q & A](#b-q--a)
3. [Documentation](#documentation)
    - [File Headers](#a-file-headers)
    - [Inline](#b-inline)
    - [Commits](#c-commits)

---

#### Code Quality
All code submitted to the repository must be held to a standard. AI is a tool that's good for learning what code **means**. It should not be how you **write** code.

#### [a] Direction
All code must have a direction or purpose. This doesn't have to be a specific feature--it could be "fixing typos in documentation". However, something like "miscellaneous fixes" is not valid. That difficult to statically check, and poor form. Should your patch be broad, split it into different patches, each with an explicit purpose.

#### [b] Optimization
Submitted code cannot be slop. Slop code is good for testing, but in an environment like Selenium final code structure should be streamlined. It should take as little memory as possible in Javascript, and be readable. For example, in a place where it's possible, `array.prototype.forEach` functions should be removed in favor of `for` loops or other, more efficient methods. Should you find grossly unoptimized code, please let maintainers know.

#### [c] Continuity
Code must fit well with the rest of the engine. New features are completely fine, encouraged even should they fit the engine's usecase, but they must be implemented in similar ways to the rest of the engine. For example, a namespace with methods implemented within a nested scope is not allowed--no other namespace within the framework is implemented in this way. The goal of Selenium is to streamline the process of game development as much as possible.

---

#### Community Interaction
All contributors must maintain composure when within the community. Beyond the projects's walls, you may do and say whatever you wish, that is not the maintainer's juristiction.

#### [a] Community
All community conversations must be civil and on-topic. This is not a general discussion forum, it is a project. Should questions arise about certain features or design choices, debate is welcomed, but it should stay on topic. Civility is expected. Overly hostile comments will result in disciplinary action.

#### [b] Q & A
During Q & As or within project forums, civility is also expected. No question is stupid. Should the question have been already answered, kindly guide the asker to the previous answer. Debate should remain civil but criticism should be expected.

---

#### Documentation
All code submitted to the project must be documented properly, and in the proper format.

#### [a] File Headers
All source files must begin with the following signature;

```javascript
/**
 * @file [file name]
 * @authors [author list]
 * @brief [file description]
 * @since [current version]
 * 
 * @license AGPLv3
 * @copyright (c) 2025 the Selenium Development Team
 * This source file is under the AGPLv3. For information on what that
 * means, see the LICENSE.md file that should have been provided alongside
 * this project, or https://www.gnu.org/licenses/agpl-3.0.md.
 */
```

When a new person edits a file, they should add their name to the author list. Should a file's purpose change, the description should change as well. However, the version number must stay static from the file's creation. If you are unsure about the current version for whatever reason, contact a maintainer.

#### [b] Inline
Inline documentation is also incredibly important for proper understanding. However, comment rot should not set in. The following is "comment rot":

```javascript
// imports "selenium_assets"
import {Selenium_Assets} from "./Framework/Assets.js";
```

This provides exactly nothing of use to the reader. Instead, let variable names do the talking for you. However, should code not be immediately self-explanatory (in the rare case such code is allowed), make a small note about functionality or design choices.

Certain objects must also **always** be described via documentation. Things like functions, globals, and namespaces. The signatures for such things are as follows;

```javascript
// function signature
/**
 * [function description]
 * @authors [author list]
 * @since [version number]
 * 
 * @param [any params]
 * @returns [return explanation if not void]
 */

// global variable & namespace signature
/**
 * [variable description]
 * @since [version number]
 */
```

The version numbers and author lists follow along with the file signature. However, function parameters and return values are special. They do not have to be documented if they don't exist (no `@param n/a`).

#### [c] Commits
Commits are simple; tell us what you changed. There is no word count on commit messages; go into as much detail as you wish. However, you **have** to document large changes. Things like `updated readme` and `added xxx to Assets.js` must be included in your commits. Occasional slip-ups with commit messages are to be expected, but making it a habit is dangerous and leads to confusion once your code is merged.

---

![bottom-banner](./.github/banner.jpg)