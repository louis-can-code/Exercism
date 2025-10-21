const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" as const
let robotNames = new Set<string>
const robots: Robot[] = []

const randInt = (range: number, lower_bound: number) => 
  Math.floor(Math.random() * range) + lower_bound

const randUpperLetter = () =>
  ALPHABET.charAt(randInt(ALPHABET.length, 0))

export class Robot {
  private robotName = ""

  public get name(): string {
    if (this.robotName !== "")
      return this.robotName;
    
    const maybeName = `${randUpperLetter()}${randUpperLetter()}${randInt(10, 0)}${randInt(10,0)}${randInt(10,0)}`;
    
    if (robotNames.has(maybeName)) {
      return this.name;
    }
    
    this.robotName = maybeName;
    robotNames.add(maybeName);
    return maybeName;
  }

  public resetName(release = false): void {
    if (release)
      robotNames.delete(this.robotName);
    this.robotName = "";
  }

  public static releaseNames(): void {
    robots.map((robot) => robot.resetName(true));
    robotNames = new Set<string>
  }
}
