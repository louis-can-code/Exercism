const COLOURS = ["black", "brown", "red", "orange", "yellow", "green", "blue", "violet", "grey", "white"] as const

const METRIC_PREFIXES = ["", "kilo", "mega", "giga"] as const

type Colour = typeof COLOURS[number]

const colourMap: Record<Colour, number> = COLOURS.reduce((map, colour, index) =>
  ({...map, [colour]: index}), {} as Record<Colour, number>)

export const decodedResistorValue = ([c1, c2, c3]: [Colour, Colour, Colour, ...Colour[]]) =>
  {
    const [mantissa, exponent] =
      c2 !== 'black' 
      ? [10 * colourMap[c1] + colourMap[c2], colourMap[c3]]
      : c1 !== 'black'
        ? [colourMap[c1], colourMap[c3] + 1]
        : [0,0]

    return `${mantissa}${"0".repeat(exponent % 3)} ${METRIC_PREFIXES[Math.floor(exponent / 3)]}ohms`;
  }
