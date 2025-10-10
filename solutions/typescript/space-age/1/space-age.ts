const ORBITAL_PERIOD = {
  mercury: 0.2408467,
  venus: 0.61519726,
  earth: 1,
  mars: 1.8808158,
  jupiter: 11.862615,
  saturn: 29.447498,
  uranus: 84.016846,
  neptune: 164.79132
} as const;

type Planet = keyof typeof ORBITAL_PERIOD;

const EARTH_YEAR = 31_557_600;

export const age = (planet: Planet, seconds: number): number =>
  Math.round(seconds * 100 / EARTH_YEAR / ORBITAL_PERIOD[planet]) / 100