const DNA_TO_RNA_TRANSCRIPTIONS = {
  A: 'U',
  C: 'G',
  G: 'C',
  T: 'A'
} as const;

type DnaNucleotide = keyof typeof DNA_TO_RNA_TRANSCRIPTIONS;
//type Rna_Nucleotide = typeof DNA_TO_RNA_TRANSCRIPTIONS[Dna_Nucleotide];

const isDnaNucleotide = (nucleotide: string): nucleotide is DnaNucleotide =>
  nucleotide in DNA_TO_RNA_TRANSCRIPTIONS

export function toRna(dna: string) {
  return dna.split("").map((n) => {
    if (isDnaNucleotide(n)) {
      return DNA_TO_RNA_TRANSCRIPTIONS[n];
    }
    throw new Error("Invalid input DNA.");
  }).join("");
}
