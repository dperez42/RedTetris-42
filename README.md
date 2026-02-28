# Redtetris (a 42 school Project)
It’s a Multiplayer fully functional Tetris using with client/server model using Vue Socket.io ExpressJS Node.js. Extras added:
- Scoring System.
- Persist player scores. (no database)
- Game mode: easy, medium, hard and ghost mode (invisible pieces)

Each player has their own playing field and receives the same sequence of pieces. When a
player clears lines, opponents receive n - 1 indestructible penalty lines at the bottom of
their fields.

Each field is 10 columns wide and 20 rows tall. Players can see their opponents’ names
and a "spectrum" view of their fields. The spectrum shows the height of each column’s
highest block. This view updates in real-time.

The game will use the original Tetrimino shapes and rotation rules:

The last remaining player is the winner. The game supports both solo and multiplayer modes.

(authors juan-gon & dperez-z).

![alt text](https://github.com/dperez42/RedTetris-42/blob/main/pictures/Captura_inicio.png?raw=true)

![alt text](https://github.com/dperez42/RedTetris-42/blob/main/pictures/Captura_game_player1.png?raw=true)


![alt text](https://github.com/dperez42/RedTetris-42/blob/main/pictures/Captura_game_player2.png?raw=true)

<h2>Infraestructure</h2>

- Server-side: Node JS and Express JS
- Client-side: Vue + Vuetify, serving from server by a index.html, which includes a reference to bundle.js containing the full application.

<h2>How to start</h2>
With command:

**sh start.sh**

This will:
- Get your IP (it will show in the console).
- Rewrite the Client .env file.
- Build the Client solution.
- Copy dist directory in Client to Server.
- Docker-compose build
- Docker-compose up

Then in the browser type:

**http://server_ip:3000/room/player_name**

room: Name of the game to join.

player_name: Player’s name.

**You can play in any ip in the same network.**

The first player to join becomes the host and controls when to start or restart the game.

If the current host leave the game, one of the remaining players will take this role. 

Once started, no new players can join until the next round.

Games end when one player remains.

A game can be played with one player.

Multiple concurrent games are supported.

<h2>Controls</h2>
<h4>Left/Right arrows:  Move piece horizontally.</h4>
<h4>Up arrow:           Rotate piece.</h4>
<h4>Down arrow:         Soft drop.</h4>
<h4>Spacebar:           Hard drop to fill a gap.</h4>

<h2>Features</h2>
<h5>Testing</h5>

JavaScript is now enterprise-ready. Like .NET or Java in the past, it’s the foundation of "Enterprise JavaScript". Testing pipelines are a core part of that, ensuring faulty versions are caught automatically. We use NYC and Mocha to run test.

To run test, enter in server container and type:

**npm run test**

You will get 4 metrics:
- Statements: statement coverage rate
- Functions: functions coverage rate
- Lines: coverage rate of lines of code
- Branches: coverage rate of code execution paths

![alt text](https://github.com/dperez42/RedTetris-42/blob/main/pictures/Captura_testing.png?raw=true)

<h5>Custom</h5>
If you want to change the front. Enter in the client container, run "npm run build", go client directory and copy "dist" directory and replace "dist" in the server directory.
