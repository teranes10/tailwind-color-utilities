import chokidar from "chokidar";

const data: Record<string, { timers: NodeJS.Timeout[]; files: string[] }> = {};
export const watchFiles = (
  tag: string,
  src: string[],
  callback: (files: string[]) => void
) => {
  chokidar.watch(src).on("all", (event, path) => {
    if (!data[tag]) {
      data[tag] = { timers: [], files: [] };
    }

    const { timers, files } = data[tag];
    if (event === "add") {
      const i = files.indexOf(path);
      if (i > -1) {
        return;
      }

      files.push(path);
    } else if (event === "unlink") {
      const i = files.indexOf(path);
      if (i == -1) {
        return;
      }

      files.splice(i, 1);
    }

    for (const timer of timers) {
      clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      callback(files);
    }, 2500);

    timers.push(timer);
  });
};
