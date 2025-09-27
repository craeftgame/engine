export interface Tickable {
  tick?(delta: number): void;
}
