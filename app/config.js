let icons = require('./icons');

const config = {
BOARD_SIZE: 20,
CARDS_PER_ROW: 4,

GAME_STATE_NO_TURNED_CARD: 0,
GAME_STATE_1_TURNED_CARD: 1,
GAME_STATE_2_TURNED_CARD: 2, //delay going on
GAME_STATE_GAME_OVER: 3, //delay going on

CARD_STATE_IN_GAME: 0,
CARD_STATE_PAIR_FOUND: 1,

CARD_PAIR_FOUND: "oi oi-check text-success",
CARD_INVISIBLE: "oi oi-aperture text-primary",

TURN_INVISIBLE_DELAY: 1000,

ICONNAMES: icons,
};

module.exports = config;