import plugin from "tailwindcss/plugin";
import { processCss, objectify } from "../utils/postcss";
import { watchFiles } from "../utils/watcher";
import fs from "fs";
import path from "path";

type Options = { src: string[]; out?: string };

export default plugin.withOptions(
  (options: Options) =>
    async ({ addComponents }) => {
      watchFiles("components", options.src, async (files: string[]) => {
        if (options.out) {
          fs.writeFileSync(
            options.out,
            `/* --------- ${path.basename(options.out)} --------- */`
          );
        }

        for (const fileName of files) {
          const { root, css } = await processCss(fileName);

          if (options.out) {
            fs.appendFileSync(
              options.out,
              `\n\n/* --------- ${path.basename(
                fileName
              )} --------- */\n\n${css}`
            );
          } else {
            const cssJs = objectify(root);
            addComponents(cssJs);
          }
        }
      });
    }
);
