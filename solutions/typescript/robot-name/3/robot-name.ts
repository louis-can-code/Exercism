const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" as const
const DIGITS = "0123456789" as const

const randInt = (range: number, lower_bound = 0) => 
  Math.floor(Math.random() * range) + lower_bound

const randUpperLetter = () =>
  ALPHABET.charAt(randInt(ALPHABET.length, 0))

export class Robot {
  private static robotNames = new Set<string>;
  private static robots: Robot[] = [];
  private robotName = "";

  constructor() {
    Robot.robots.push(this)
  }

  public get name(): string {
    if (this.robotName !== "")
      return this.robotName;
    
    const maybeName = this.randomName();
    
    if (Robot.robotNames.has(maybeName)) {
      return this.nextAvailableName(maybeName);
    }
    
    this.robotName = maybeName;
    Robot.robotNames.add(maybeName);
    return maybeName;
  }

  private randomName = () =>
    `${randUpperLetter()}${randUpperLetter()}${randInt(10)}${randInt(10)}${randInt(10)}`

  private nextAvailableName(name: string): string {
    if (Robot.robotNames.size == 676_000)
      throw new Error("All names taken");

    for (const a of ALPHABET)
      for (const b of ALPHABET)
        for (const c of DIGITS)
          for (const d of DIGITS)
            for (const e of DIGITS) {
              const maybeName = [a,b,c,d,e].reduce((acc, char) => acc.concat(char));
              if (!Robot.robotNames.has(maybeName)) {
                this.robotName = maybeName;
                Robot.robotNames.add(maybeName);
                return maybeName;
              }
            }
    throw new Error("All names taken");
  }

  public resetName(release = false): void {
    if (release)
      Robot.robotNames.delete(this.robotName);
    this.robotName = "";
  }

  public static releaseNames(): void {
    Robot.robots.map((robot) => robot.resetName(true));
    Robot.robotNames = new Set<string>;
  }
}
