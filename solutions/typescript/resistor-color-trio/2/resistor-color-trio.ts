const COLOURS = ["black", "brown", "red", "orange", "yellow", "green", "blue", "violet", "grey", "white"] as const

const METRIC_PREFIXES = ["", "kilo", "mega", "giga"] as const

type Colour = typeof COLOURS[number]

const colourMap: Record<Colour, number> = COLOURS.reduce((map, colour, index) =>
  ({...map, [colour]: index}), {} as Record<Colour, number>)

const numberToMetric = (baseNum: string, exp: number): string =>
  {
    // remove trailing zeroes
    const mantissa = baseNum.replace(/0+$/, "");
    
    // number of trailing zeroes plus passed in exponent value
    const exponent = (baseNum.length - mantissa.length) + exp;

    // get no. zeroes and correct prefix based on exponent
    const zeroes = "0".repeat(exponent % 3);
    const prefix = METRIC_PREFIXES[Math.floor(exponent / 3)];

    // put the whole string together
    return mantissa.concat(zeroes).concat(" ").concat(prefix).concat("ohms");
  }

export const decodedResistorValue = ([c1, c2, c3]: [Colour, Colour, Colour, ...Colour[]]): string =>
  {
    const mantissa = colourMap[c1] * 10 + colourMap[c2];
    return numberToMetric(String(mantissa), colourMap[c3]);
  }
