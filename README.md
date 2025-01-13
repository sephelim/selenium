![top-banner](./.github/banner.jpg)

---

### Selenium
Selenium is a Javsscript game framework built for creating isometric pixelart games in the browser. It was built expressly for the [Khaal](https://github.com/sephelim/khaal) RTS game, and as such has many elements that help specifically with RTS games.

---

#### Usage
Selenium is built to be basically braindead usage-wise. Everything is documented via [JSDoc](https://jsdoc.app/) and split into namespaces, all descending from the global Selenium namespace. The engine's structure kind of looks like this;

```
| Selenium
|-- Configuration
|-- Asset Loading
|--|-- Scene Loading
|--|-- Keymap Loading
|--|-- Image Loading
|-- Rendering & Logic
```

Starting the engine is as simple as providing a properly set up project and calling `Selenium.Start`.

---

#### Project Setup
Selenium is an opinionated engine--it was built for a specific game, and that game's structure. As such, in order to understand the environment around it, Selenium needs several directories and files to be provided. One of those files is the Selenium global config. This is a file in your game's root directory named `Game.sconfig` (sic). The Global config file is in Unix INI format, and the sections/keys are as follows;

```ini
# Required options are marked with a (*). All optionals
# have default values, which are listed beneath this block.

# Information about the engine
[Selenium]
mode=<engine_state> # The debug state the engine is in (*)
fatality_level=<fatality_state> # The severity of errors

# Information about the actual game
[Game]
title=<string> # The game's title (*)
    short=<string> # The game's shortened title
author=<string> # The game's author (*)
description=<string> # The game's description
keywords=<string[]> # The game's keywords, comma-separated

license=<string> # The name of the game's license (*)
```

Default values for optional keys are as follows:
```
fatality_level: [Panics]
short: [game_title]
description: [empty_string]
keywords: [empty_string_array]
```

Selenium assumes that a LICENSE and README markdown document is provided at the game root. As for the `<engine_state>` and `<fatality_state>` types, their possible values are as follows;

```
engine_state: Debug, Release
fatality_state: All, Errors, Panics
```

For information on what any of those values mean, check out the inline documentation.

Alongside the `sconfig` file, Selenium also needs a script and asset directory. Those must be named `[short_title]_Scripts` and `[short_title]_Assets` respectively. An HTML entrypoint must also be provided, named `index.html`, in the root directory. That HTML file should be the follow;

```html
<!DOCTYPE html>
<html lang="en-US">
    <head>
        <script type="module">
            import {Selenium} from "./Selenium/Selenium.js";
            Selenium.Start(); 
        </script>
    </head>
    <body></body>
</html>
```

The script directory must contain an exported function that takes no parameters with the name of "Main".

More directories (and files) are needed for certain features to work correctly. These such directories/files are documented in the interfaces that need them.

![bottom-banner](./.github/banner.jpg)