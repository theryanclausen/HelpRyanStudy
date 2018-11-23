import Phaser from "phaser";
import { TitleScreen } from "./scenes/title-screen";
import {GameScene} from "./scenes/game"

const gameConfig = {
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: [TitleScreen,GameScene ]
};

new Phaser.Game(gameConfig);
