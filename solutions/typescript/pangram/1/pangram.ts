const ALPHABET = [...'abcdefghijklmnopqrstuvwxyz'] as const

export const isPangram = (sentence: string) => {
  const lowerSentence = sentence.toLowerCase()
  
  for (const letter of ALPHABET) {
    if (!lowerSentence.includes(letter))
      return false;
  }
  return true;
}
