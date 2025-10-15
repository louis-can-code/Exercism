export class DnDCharacter {
  strength = DnDCharacter.generateAbilityScore();
  dexterity = DnDCharacter.generateAbilityScore();
  constitution = DnDCharacter.generateAbilityScore();
  intelligence = DnDCharacter.generateAbilityScore();
  wisdom = DnDCharacter.generateAbilityScore();
  charisma = DnDCharacter.generateAbilityScore();
  hitpoints = 10 + DnDCharacter.getModifierFor(this.constitution);
  
  public static generateAbilityScore() {
    const rolls = 
      Array.from( {length: 4},
          () => Math.floor(Math.random() * 6) + 1);
    return rolls.reduce((sum, roll) => sum + roll, 0) - Math.min(...rolls);
  }

  public static getModifierFor(abilityValue: number) {
    return Math.floor((abilityValue - 10) / 2);
  }
}
