# Tailwind Color Utilities

Tailwind CSS plugin for generating color shades, background tints,
and automatically importing utilities and components.

## Features

- Generate color shades.
- Generate background tints. (CSS filter for adding a tint to images.)
- Automatically import CSS files for Tailwind @layer utilities and components.

 Tailwind CSS @layer classes may not work as expected in style-per-component libraries like Vue, Svelte, and React. These frameworks are processing every single <style> block independently. In such cases, one viable option is to generate and inject utilities and components using Tailwind plugins. [More](https://tailwindcss.com/docs/adding-custom-styles#layers-and-per-component-css)
## Installation

To install the plugin, you can simply run the following command:

```sh
# Install using npm
npm install -D tailwind-color-utilities

# Install using yarn
yarn add -D tailwind-color-utilities
```

## Setup

After installing the plugin, include it in your tailwind.config.js:

```sh
// tailwind.config.js
import { Colors, Utilities, Components } from "tailwind-color-utilities";

module.exports = {
  //...
  plugins: [
    Colors({
      colors: {
        primary: "#3bb77e",
        secondary: "#fdc040",
        grey: "#243d4e",
        white: "#ffffff",
      },
      out: "./src/assets/css/output/tints.css", //optional
    }),
    Utilities({
      src: ["./src/assets/css/utilities/**/*.css"],
      out: "./src/assets/css/output/utilities.css", //optional
    }),
    Components({
      src: ["./src/layouts/**/*.css"],
      out: "./src/assets/css/output/components.css", //optional
    }),
 ]
};
```
### Note
If you provide an output file path, the CSS code will be written directly to the specified file instead of being injected into the Tailwind CSS. This means that manual configuration is required to set the output file.
```sh
@import "tailwindcss/base";

@import "tailwindcss/utilities";
@import "./output/tints.css";
@import "./output/utilities.css";

@import "tailwindcss/components";
@import "./output/components.css";

```
## Usage
default color stops: 25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950

```sh
<div class="bg-grey-50">
    <h1 class="text-primary-700">Hello, World!</h1>
    <img class="tint-secondary" src="icon.png" alt="Icon">
</div>
```

## License

This project is licensed under the MIT License.
