# Tailwind Color Utilities

Tailwind CSS plugin for generating color shades, background tints,
and automatically importing utilities and components.

## Features

- Generate color shades.
- Generate background tints. (CSS filter for adding a tint to images.)
- Automatically import CSS files for Tailwind @layer utilities and components.

## Installation

To install the plugin, you can simply run the following command:

```sh
# Install using npm
npm install -D tailwind-color-utilities

# Install using yarn
yarn add -D tailwind-color-utilities
```

## Usage

After installing the plugin, include it in your tailwind.config.js:

```sh
// tailwind.config.js
import { Colors, Utilities, Components } from "tailwind-color-utilities";

module.exports = {
  //...
  plugins: [
    Colors({
      primary: "#3bb77e",
      secondary: "#fdc040",
      grey: "#243d4e"
    }),
    Utilities(<"utility css files directory">),  // Ex: "./assets/css/utilities"
    Components(<"component css files directory">) //Ex: "./assets/css/components"
 ]
};
```

default color stops: 25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950

```sh
<div class="bg-grey-50">
    <h1 class="text-primary-700">Hello, World!</h1>
    <img class="tint-secondary" src="icon.png" alt="Icon">
</div>
```

## License

This project is licensed under the MIT License.
