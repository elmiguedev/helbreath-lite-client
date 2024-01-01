import { Player } from "./Player";
import { WorldMap } from "./WorldMap";
import { Monster } from "./monsters/Monster";

export interface WorldStatus {
  world: WorldMap;
  players: Player[];
  monsters: Monster[];
}