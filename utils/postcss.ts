import fs from "fs";
import path from "path";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import postcssNested from "postcss-nested";
import postcssJs from "postcss-js";

const processor = postcss([autoprefixer, postcssNested]);

export const readMultipleObjectCss = async (dirPath: string) => {
  const files = fs.readdirSync(dirPath);
  const result = [];

  for (const fileName of files) {
    const filePath = path.join(dirPath, fileName);
    const css = await readObjectCss(filePath);
    result.push(css);
  }

  return result;
};

const readObjectCss = async (filePath: string) => {
  const css = fs.readFileSync(filePath, "utf-8");
  const { root } = await processor.process(css, { from: filePath });
  return postcssJs.objectify(root);
};
