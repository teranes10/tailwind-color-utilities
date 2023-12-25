import { CssFilter, HSL, RGB } from "../types/color";
import Color from "./color";

export default class CssFilterReSolver {
  private rgb: RGB;
  private hsl: HSL;

  private constructor(color: Color) {
    this.rgb = color.toRGB();
    this.hsl = color.toHSL();
  }

  public static from(color: Color) {
    return new CssFilterReSolver(color);
  }

  public solve(): CssFilter {
    const result = this.solveNarrow(this.solveWide());
    return this.css(result.values);
  }

  private solveWide(): Wide {
    const A = 5;
    const c = 15;
    const a = [60, 180, 18000, 600, 1.2, 1.2];

    let best: Wide = { loss: Infinity, values: [] };
    for (let i = 0; best.loss > 25 && i < 3; i++) {
      const initial = [50, 20, 3750, 50, 100, 100];
      const result = this.spsa(A, a, c, initial, 1000);
      if (result.loss < best.loss) {
        best = result;
      }
    }
    return best;
  }

  private solveNarrow(wide: Wide): Wide {
    const A = wide.loss;
    const c = 2;
    const A1 = A + 1;
    const a = [0.25 * A1, 0.25 * A1, A1, 0.25 * A1, 0.2 * A1, 0.2 * A1];
    return this.spsa(A, a, c, wide.values, 500);
  }

  private spsa(
    A: number,
    a: number[],
    c: number,
    values: number[],
    iters: number
  ): Wide {
    const alpha = 1;
    const gamma = 0.16666666666666666;

    let best: number[] = [];
    let bestLoss = Infinity;
    const deltas = new Array(6);
    const highArgs = new Array(6);
    const lowArgs = new Array(6);

    for (let k = 0; k < iters; k++) {
      const ck = c / Math.pow(k + 1, gamma);
      for (let i = 0; i < 6; i++) {
        deltas[i] = Math.random() > 0.5 ? 1 : -1;
        highArgs[i] = values[i] + ck * deltas[i];
        lowArgs[i] = values[i] - ck * deltas[i];
      }

      const lossDiff = this.loss(highArgs) - this.loss(lowArgs);
      for (let i = 0; i < 6; i++) {
        const g = (lossDiff / (2 * ck)) * deltas[i];
        const ak = a[i] / Math.pow(A + k + 1, alpha);
        values[i] = fix(values[i] - ak * g, i);
      }

      const loss = this.loss(values);
      if (loss < bestLoss) {
        best = values.slice(0);
        bestLoss = loss;
      }
    }
    return { values: best, loss: bestLoss };

    function fix(value: number, idx: number): number {
      let max = 100;
      if (idx === 2 /* saturate */) {
        max = 7500;
      } else if (idx === 4 /* brightness */ || idx === 5 /* contrast */) {
        max = 200;
      }

      if (idx === 3 /* hue-rotate */) {
        if (value > max) {
          value %= max;
        } else if (value < 0) {
          value = max + (value % max);
        }
      } else if (value < 0) {
        value = 0;
      } else if (value > max) {
        value = max;
      }
      return value;
    }
  }

  private loss(filters: number[]): number {
    const color = Color.fromRGB({ red: 0, green: 0, blue: 0 });
    color.invert(filters[0] / 100);
    color.sepia(filters[1] / 100);
    color.saturate(filters[2] / 100);
    color.hueRotate(filters[3] * 3.6);
    color.brightness(filters[4] / 100);
    color.contrast(filters[5] / 100);

    const rgb = color.toRGB();
    const hsl = color.toHSL();
    return (
      Math.abs(rgb.red - this.rgb.red) +
      Math.abs(rgb.green - this.rgb.green) +
      Math.abs(rgb.blue - this.rgb.blue) +
      Math.abs(hsl.hue - this.hsl.hue) +
      Math.abs(hsl.saturation - this.hsl.saturation) +
      Math.abs(hsl.lightness - this.hsl.lightness)
    );
  }

  private css(filters: number[]): CssFilter {
    function fmt(idx: number, multiplier = 1) {
      return Math.round(filters[idx] * multiplier);
    }
    return `invert(${fmt(0)}%) sepia(${fmt(1)}%) saturate(${fmt(
      2
    )}%) hue-rotate(${fmt(3, 3.6)}deg) brightness(${fmt(4)}%) contrast(${fmt(
      5
    )}%);`;
  }
}

type Wide = { loss: number; values: number[] };
