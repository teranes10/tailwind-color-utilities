import fs from "fs";
import path from "path";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import postcssNested from "postcss-nested";
import postcssJs from "postcss-js";
import { comment } from "../utils/text-util";

export const processCss = async (files: string[], includeFileNames = true) => {
  var result = "";

  for (const fileName of files) {
    const { css } = await process(fileName);

    if (includeFileNames) {
      result += `\n\n${comment(path.basename(fileName))}`;
    }

    result += `\n\n${css}`;
  }

  return result;
};

export const processCssObject = async (
  files: string[],
  includeFileNames = true
) => {
  var result = {};

  for (const fileName of files) {
    const { root } = await process(fileName);
    const cssObject = objectify(root);
    result = { ...result, ...cssObject };
  }

  return result;
};

const processor = postcss([autoprefixer, postcssNested]);

export const process = async (filePath: string) => {
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
