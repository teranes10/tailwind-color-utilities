import plugin from "tailwindcss/plugin";
import { processCss, processCssObject } from "../utils/postcss";
import path from "path";
import fs from "fs";
import { watchFiles } from "../utils/watcher";
import { comment } from "../utils/text-util";

type Options = { src: string[]; out?: string; includeFileNames?: boolean };

export default plugin.withOptions(
  (options: Options) =>
    async ({ addUtilities }) => {
      watchFiles("utilities", options.src, async (files: string[]) => {
        if (options.out) {
          let css = comment(path.basename(options.out));
          css += await processCss(files, options.includeFileNames);
          fs.writeFileSync(options.out, css);
        } else {
          let cssObject = await processCssObject(files);
          addUtilities(cssObject);
        }
      });
    }
);
