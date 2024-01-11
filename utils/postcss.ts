import fs from "fs";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import postcssNested from "postcss-nested";
import postcssJs from "postcss-js";

const processor = postcss([autoprefixer, postcssNested]);

export const processCss = async (filePath: string) => {
  const cssContent = fs.readFileSync(filePath, "utf-8");
  const { root, css } = await processor.process(cssContent, { from: filePath });
  return { root, css };
};

export const objectify = (root: postcss.Root) => {
  return postcssJs.objectify(root);
};

export const objectToCss = async (cssObject: any) => {
  var cssString = "";

  for (const selector in cssObject) {
    cssString += `${selector} {\n`;

    for (const prop in cssObject[selector]) {
      cssString += `\t${prop}: ${cssObject[selector][prop]}\n`;
    }

    cssString += `}\n`;
  }

  return cssString;
};
