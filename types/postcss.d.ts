import postcss from "postcss";

declare module "postcss/lib/processor" {
  export default interface Processor {
    process(
      css: string,
      opts: { from: string; to: string }
    ): postcss.LazyResult;
  }
}
