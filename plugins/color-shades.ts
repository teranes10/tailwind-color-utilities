import { Hex, HSL, CssFilter } from "../types/color";
import Color from "../utils/color";
import CssFilterReSolver from "../utils/css-filter-resolver";
import plugin from "tailwindcss/plugin";
import fs from "fs";
import { objectToCss } from "../utils/postcss";
import { deepEqual } from "../utils/compare";

var _colors: Colors;

type Options = { colors: Colors; out?: string; cssVariables?: boolean };
export default plugin.withOptions(
  (options: Options) =>
    async ({ addBase, addUtilities }) => {
      if (options?.cssVariables) {
        const colorVariables = flattenColorObject(
          createColorObject(
            options.colors,
            (key, value) => `--${key}` + (value ? `-${value}` : "")
          )
        );

        addBase({
          ":root": colorVariables,
        });
      }

      const filters = createColorFilterObject(
        options.colors,
        (key, value) => `.tint-${key}` + (value ? `-${value}` : "")
      );

      if (options?.out) {
        if (!(_colors && deepEqual(_colors, options.colors))) {
          _colors = options.colors;
          const css = await objectToCss(filters);
          fs.writeFileSync(options.out, css);
        }
      } else {
        addUtilities(filters);
      }
    },

  (options: Options) => {
    const colorPalette = flattenColorObject(
      createColorObject(
        options.colors,
        (key, value) => key + (value ? `-${value}` : "")
      )
    );

    return {
      theme: { colors: colorPalette },
    };
  }
);

const flattenColorObject = (input: ReturnType<typeof createColorObject>) => {
  const result: { [key: string]: string } = {};

  for (const key in input) {
    const nestedColors = input[key];

    for (const nestedKey in nestedColors) {
      result[nestedKey] = nestedColors[nestedKey];
    }
  }

  return result;
};

const createColorObject = (
  colors: Colors,
  valueFormatter: (key: string, value?: ColorStop) => string
) => {
  const colorObject: Record<string, Record<string, string>> = {};

  Object.entries(colors).forEach(([key, value]) => {
    colorObject[key] = {
      [valueFormatter(key)]: value,
    };

    const { hue, saturation } = hexToHsl(value);
    COLOR_STOPS.forEach((stop) => {
      const lightness = getLightnessForColorStop(stop);
      colorObject[key][
        valueFormatter(key, stop)
      ] = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    });
  });

  return colorObject;
};

const createColorFilterObject = (
  colors: Colors,
  valueFormatter: (key: string, value?: ColorStop) => string
) => {
  const colorObject: Record<string, Record<string, string>> = {};

  Object.entries(colors).forEach(([key, value]) => {
    colorObject[valueFormatter(key)] = {
      ["filter"]: hexToFilter(value),
    };

    const { hue, saturation } = hexToHsl(value);

    COLOR_STOPS.forEach((stop) => {
      const lightness = getLightnessForColorStop(stop);

      colorObject[valueFormatter(key, stop)] = {
        ["filter"]: hslToFilter({ hue, saturation, lightness }),
      };
    });
  });

  return colorObject;
};

const COLOR_STOPS = [
  25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;

type Colors = Record<string, Hex>;
type ColorStop = (typeof COLOR_STOPS)[number];
const getLightnessForColorStop = (stop: ColorStop) => 100 - stop / 10;

const hexToHsl = (hex: Hex): HSL => {
  return Color.fromHex(hex).toHSL();
};

const hexToFilter = (hex: Hex): CssFilter => {
  const color = Color.fromHex(hex);
  return CssFilterReSolver.from(color).solve();
};

const hslToFilter = (hsl: HSL): CssFilter => {
  const color = Color.fromHSL(hsl);
  return CssFilterReSolver.from(color).solve();
};
