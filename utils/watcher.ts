import chokidar from "chokidar";

const data: Record<string, { timers: NodeJS.Timeout[]; files: string[] }> = {};
export const watchFiles = (
  tag: string,
  src: string[],
  callback: (files: string[]) => void
) => {
  if (data[tag]) {
    return;
  }

  data[tag] = { timers: [], files: [] };
  chokidar.watch(src).on("all", (event, path) => {
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

    timers.splice(0, timers.length);
    const timer = setTimeout(() => {
      callback(files);
    }, 150);

    timers.push(timer);
  });
};
