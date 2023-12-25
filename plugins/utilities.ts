import plugin from "tailwindcss/plugin";
import { readMultipleObjectCss } from "../utils/postcss";

export default plugin.withOptions(
  (dirPath: string) =>
    ({ addUtilities }) =>
      readMultipleObjectCss(dirPath).then((css) => addUtilities(css))
);
