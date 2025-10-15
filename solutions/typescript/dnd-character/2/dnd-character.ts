const ABILITIES = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'] as const
type Ability = typeof ABILITIES[number]

interface DnDCharacterInterface {
  Ability: number
  hitpoints: number
}

export class DnDCharacter {
  strength!: number;
  dexterity!: number;
  constitution!: number;
  intelligence!: number;
  wisdom!: number;
  charisma!: number;
  hitpoints: number;
  
  constructor() {
    const scores = ABILITIES.reduce((map, ability) => 
        ({...map, [ability]: DnDCharacter.generateAbilityScore() }), {} as Record<Ability, number>);
    
    Object.assign(this, scores);
    
    this.hitpoints = 10 + DnDCharacter.getModifierFor(this.constitution)
  }
  
  public static generateAbilityScore(): number {
    const rolls = 
      Array.from( {length: 4},
          () => Math.floor(Math.random() * 6) + 1)
    return rolls.reduce((sum, roll) => sum + roll, 0) - Math.min(...rolls)
  }

  public static getModifierFor(abilityValue: number): number {
    return Math.floor((abilityValue - 10) / 2)
  }
}
