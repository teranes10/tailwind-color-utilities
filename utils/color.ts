import { HSL, Hex, RGB } from "../types/color";

export default class Color {
  private r = 0;
  private g = 0;
  private b = 0;

  private constructor(r: number, g: number, b: number) {
    this.r = this.clamp(r);
    this.g = this.clamp(g);
    this.b = this.clamp(b);
  }

  public static fromHex(hex: Hex): Color {
    let value = hex.replace("#", "");

    let red = 0;
    let green = 0;
    let blue = 0;

    if (value.length === 4) value = value.substring(0, 3);
    if (value.length === 8) value = value.substring(0, 6);

    function parseHexChannels(hex: string, channels: number[]) {
      return parseInt(`0x${channels.map((channel) => hex[channel]).join("")}`);
    }

    if (value.length === 3) {
      red = parseHexChannels(value, [0, 0]);
      green = parseHexChannels(value, [1, 1]);
      blue = parseHexChannels(value, [2, 2]);
    } else {
      red = parseHexChannels(value, [0, 1]);
      green = parseHexChannels(value, [2, 3]);
      blue = parseHexChannels(value, [4, 5]);
    }

    return new Color(red, green, blue);
  }

  public static fromRGB(rgb: RGB): Color {
    return new Color(rgb.red, rgb.green, rgb.blue);
  }

  public static fromHSL(hsl: HSL): Color {
    var { hue: h, saturation: s, lightness: l } = hsl;

    if (h < 0) h = 0;
    if (s < 0) s = 0;
    if (l < 0) l = 0;
    if (h >= 360) h = 359;
    if (s > 100) s = 100;
    if (l > 100) l = 100;
    s /= 100;
    l /= 100;

    var C = (1 - Math.abs(2 * l - 1)) * s;
    var hh = h / 60;
    var X = C * (1 - Math.abs((hh % 2) - 1));
    var r = 0,
      g = 0,
      b = 0;

    if (hh >= 0 && hh < 1) {
      r = C;
      g = X;
    } else if (hh >= 1 && hh < 2) {
      r = X;
      g = C;
    } else if (hh >= 2 && hh < 3) {
      g = C;
      b = X;
    } else if (hh >= 3 && hh < 4) {
      g = X;
      b = C;
    } else if (hh >= 4 && hh < 5) {
      r = X;
      b = C;
    } else {
      r = C;
      b = X;
    }

    var m = l - C / 2;
    r += m;
    g += m;
    b += m;
    r *= 255.0;
    g *= 255.0;
    b *= 255.0;
    r = Math.round(r);
    g = Math.round(g);
    b = Math.round(b);

    return new Color(r, g, b);
  }

  public toHSL(): HSL {
    let red = this.r,
      green = this.g,
      blue = this.b;

    red /= 255;
    green /= 255;
    blue /= 255;

    const channelMin = Math.min(red, green, blue);
    const channelMax = Math.max(red, green, blue);
    const delta = channelMax - channelMin;

    let hue = 0;
    let saturation = 0;
    let lightness = 0;

    if (delta === 0) hue = 0;
    else if (channelMax === red) hue = ((green - blue) / delta) % 6;
    else if (channelMax === green) hue = (blue - red) / delta + 2;
    else hue = (red - green) / delta + 4;

    hue = Math.round(hue * 60);

    if (hue < 0) hue += 360;

    lightness = (channelMax + channelMin) / 2;
    saturation = delta == 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
    saturation = +(saturation * 100).toFixed(1);
    lightness = +(lightness * 100).toFixed(1);

    return {
      hue: hue,
      saturation: saturation,
      lightness: lightness,
    };
  }

  public toRGB(): RGB {
    return {
      red: this.r,
      green: this.g,
      blue: this.b,
    };
  }

  public hueRotate(angle = 0) {
    angle = (angle / 180) * Math.PI;
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    this.multiply([
      0.213 + cos * 0.787 - sin * 0.213,
      0.715 - cos * 0.715 - sin * 0.715,
      0.072 - cos * 0.072 + sin * 0.928,
      0.213 - cos * 0.213 + sin * 0.143,
      0.715 + cos * 0.285 + sin * 0.14,
      0.072 - cos * 0.072 - sin * 0.283,
      0.213 - cos * 0.213 - sin * 0.787,
      0.715 - cos * 0.715 + sin * 0.715,
      0.072 + cos * 0.928 + sin * 0.072,
    ]);
  }

  public grayscale(value = 1) {
    this.multiply([
      0.2126 + 0.7874 * (1 - value),
      0.7152 - 0.7152 * (1 - value),
      0.0722 - 0.0722 * (1 - value),
      0.2126 - 0.2126 * (1 - value),
      0.7152 + 0.2848 * (1 - value),
      0.0722 - 0.0722 * (1 - value),
      0.2126 - 0.2126 * (1 - value),
      0.7152 - 0.7152 * (1 - value),
      0.0722 + 0.9278 * (1 - value),
    ]);
  }

  public sepia(value = 1) {
    this.multiply([
      0.393 + 0.607 * (1 - value),
      0.769 - 0.769 * (1 - value),
      0.189 - 0.189 * (1 - value),
      0.349 - 0.349 * (1 - value),
      0.686 + 0.314 * (1 - value),
      0.168 - 0.168 * (1 - value),
      0.272 - 0.272 * (1 - value),
      0.534 - 0.534 * (1 - value),
      0.131 + 0.869 * (1 - value),
    ]);
  }

  public saturate(value = 1) {
    this.multiply([
      0.213 + 0.787 * value,
      0.715 - 0.715 * value,
      0.072 - 0.072 * value,
      0.213 - 0.213 * value,
      0.715 + 0.285 * value,
      0.072 - 0.072 * value,
      0.213 - 0.213 * value,
      0.715 - 0.715 * value,
      0.072 + 0.928 * value,
    ]);
  }

  public brightness(value = 1) {
    this.linear(value);
  }

  public contrast(value = 1) {
    this.linear(value, -(0.5 * value) + 0.5);
  }

  public invert(value = 1) {
    this.r = this.clamp((value + (this.r / 255) * (1 - 2 * value)) * 255);
    this.g = this.clamp((value + (this.g / 255) * (1 - 2 * value)) * 255);
    this.b = this.clamp((value + (this.b / 255) * (1 - 2 * value)) * 255);
  }

  private multiply(matrix: number[]) {
    const newR = this.clamp(
      this.r * matrix[0] + this.g * matrix[1] + this.b * matrix[2]
    );
    const newG = this.clamp(
      this.r * matrix[3] + this.g * matrix[4] + this.b * matrix[5]
    );
    const newB = this.clamp(
      this.r * matrix[6] + this.g * matrix[7] + this.b * matrix[8]
    );
    this.r = newR;
    this.g = newG;
    this.b = newB;
  }

  private linear(slope = 1, intercept = 0) {
    this.r = this.clamp(this.r * slope + intercept * 255);
    this.g = this.clamp(this.g * slope + intercept * 255);
    this.b = this.clamp(this.b * slope + intercept * 255);
  }

  private clamp(value: number) {
    if (value > 255) {
      value = 255;
    } else if (value < 0) {
      value = 0;
    }
    return value;
  }
}
