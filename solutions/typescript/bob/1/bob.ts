export function hey(message: string) {
  if (/^\s*$/.test(message))
    return "Fine. Be that way!";
  
  const question = /\?\s*$/.test(message);
  const capitalised = /^[^a-z]*[A-Z][^a-z]*$/.test(message);
  
  if (question && capitalised)
    return "Calm down, I know what I'm doing!";
  if (question)
    return "Sure.";
  if (capitalised)
    return "Whoa, chill out!";
  
  return "Whatever."
}
