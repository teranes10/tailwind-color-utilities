import plugin from "tailwindcss/plugin";
import { readMultipleObjectCss } from "../utils/postcss";

export default plugin.withOptions(
  (dirPath: string) =>
    ({ addComponents }) =>
      readMultipleObjectCss(dirPath).then((css) => addComponents(css))
);
