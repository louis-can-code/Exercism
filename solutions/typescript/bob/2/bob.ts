const RESPONSES = ["Whatever.", "Sure.", "Whoa, chill out!", "Calm down, I know what I'm doing!", "Fine. Be that way!"]

export function hey(message: string) {
  if (/^\s*$/.test(message))
    return RESPONSES[4];
  
  const question = /\?\s*$/.test(message) ? 1 : 0;
  const capitalised = /^[^a-z]*[A-Z][^a-z]*$/.test(message) ? 2 : 0;
  
  return RESPONSES[question + capitalised]
}
