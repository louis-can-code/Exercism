const COLOURS = ["black", "brown", "red", "orange", "yellow", "green", "blue", "violet", "grey", "white"] as const

const METRIC_PREFIXES = ["", "kilo", "mega", "giga"] as const

type Colour = typeof COLOURS[number]

const colourMap: Record<Colour, number> = COLOURS.reduce((map, colour, index) =>
  ({...map, [colour]: index}), {} as Record<Colour, number>)

export const decodedResistorValue = ([c1, c2, c3]: [Colour, Colour, Colour, ...Colour[]]) =>
  {
    // Cases:
    //  - standard, split into 2 significant figures + exponent of 10
    //  - c2 (not c1) is black, 1 significant figure + exponent of 10
    //  - c1 and c2 are black, the value is 0
    const [mantissa, exponent] =
      c2 !== 'black' 
      ? [10 * colourMap[c1] + colourMap[c2], colourMap[c3]]
      : c1 !== 'black'
        ? [colourMap[c1], colourMap[c3] + 1]
        : [0,0]

    return `${mantissa}${"0".repeat(exponent % 3)} ${METRIC_PREFIXES[Math.floor(exponent / 3)]}ohms`;
  }
