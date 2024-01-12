import plugin from "tailwindcss/plugin";
import { processCss, processCssObject } from "../utils/postcss";
import { watchFiles } from "../utils/watcher";
import fs from "fs";
import path from "path";
import { comment } from "../utils/text-util";

type Options = { src: string[]; out?: string; includeFileNames?: boolean };

export default plugin.withOptions(
  (options: Options) =>
    async ({ addComponents }) => {
      watchFiles("components", options.src, async (files: string[]) => {
        if (options.out) {
          let css = comment(path.basename(options.out));
          css += await processCss(files, options.includeFileNames);
          fs.writeFileSync(options.out, css);
        } else {
          let cssObject = await processCssObject(files);
          addComponents(cssObject);
        }
      });
    }
);
