"use strict";

import GameBuilder from "./game.js";

const game = new GameBuilder() //
  .duration(3)
  .carrotCount(3)
  .bugCount(3)
  .build();
