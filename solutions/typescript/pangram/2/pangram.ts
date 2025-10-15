const ALPHABET = [...'abcdefghijklmnopqrstuvwxyz'] as const

export const isPangram = (sentence: string) => {
  const lowerSentence = sentence.toLowerCase()

  return ALPHABET.every((letter) => lowerSentence.includes(letter));
}
