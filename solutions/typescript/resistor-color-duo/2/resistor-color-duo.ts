const COLOURS = ["black", "brown", "red", "orange", "yellow", "green", "blue", "violet", "grey", "white"] as const

export type Colour = typeof COLOURS[number]

const colourMap: Record<Colour, number> = COLOURS.reduce((map, colour, index) =>
  ({ ...map, [colour]: index }), {} as Record<Colour, number>)

export const decodedValue = ([c1, c2]: [Colour, Colour, ...Colour[]]): number =>
  colourMap[c1] * 10 + colourMap[c2]