# Among Us · Orbital Crew Online

This is the complete repository package for a fan-made browser game with original artwork, a real authoritative multiplayer server, and an offline AI Practice game. Players worldwide can use the same deployed website on PC or mobile. The package has been prepared locally; it is not deployed to your GitHub or Render account yet.

## Put the files in GitHub

Upload every file in this folder into the **root** of one GitHub repository, preserving these exact names:

```
index.html
practice.html
server.mjs
multiplayer.mjs
game-core.mjs
package.json
package-lock.json
render.yaml
multiplayer.test.mjs
README.md
```

Do not upload the ZIP file itself as the website, or put the files inside an extra folder. No node_modules folder, database, API key, frontend build, or additional artwork is needed. The two HTML files contain their own styles, browser code, maps, and artwork. The server files must remain beside them.

## Deploy with Render

You need a **Web Service**, because the multiplayer server accepts WebSockets. A Static Site or GitHub Pages cannot run this server. Render serves the website and WebSocket connection through the same public address. See [Render WebSockets](https://render.com/docs/websocket).

Choose either setup:

1. **Blueprint:** In Render, choose **New → Blueprint**, connect the repository, and use the supplied `render.yaml`. Review the service and deploy it.
2. **Manual:** Choose **New → Web Service**, connect the repository, choose **Node**, leave **Root Directory blank**, set **Build Command** to `npm ci --omit=dev`, **Start Command** to `npm start`, and **Health Check Path** to `/health`. Set `NODE_VERSION` to `24.22.1`, or use a Node version in the package's supported range. Choose your instance plan and deploy. Render's [Node setup](https://render.com/docs/deploy-node-express-app) and [version settings](https://render.com/docs/node-version) explain these fields.

Once Render reports **Live**, open the service's **https://YOUR-SERVICE.onrender.com** link. Share that same link with friends. Opening a downloaded index.html from your computer does not connect to Render. No server URL needs editing in the code.

Keep this service on **one instance**. Rooms and reconnection sessions live in that instance's memory. Horizontal scaling requires shared room storage or a room-routing layer, which is outside this package.

The Blueprint starts with Render's Free plan so it does not request a paid service. A Free service can sleep, restart, and take about a minute to wake after inactivity. A server restart or new deployment clears the rooms. For regular public play, select a suitable always-on instance in your Render account. These limits come from [Render's Free service documentation](https://render.com/docs/free). Neither plan nor account changes have been made for you.

## Play online

- Choose a callsign, suit color, hat, accessory, pet, and PC or Mobile controls.
- Create a **public** room to list it in the room browser, or uncheck the public option for a **private** code-only room.
- Copy the invite link by clicking the six-character room code. Friends can use the link or enter the code on the same website.
- Online play needs **4–15 real players**. Everyone presses Ready, then the host presses Start. Two impostors need at least 7 players, and three need 9.
- The host sets the map, player limit, impostor count, movement speed, crew vision, kill cooldown, task count, Engineer and Scientist counts, discussion and voting time, emergency meetings, and public/private status. The combined specialist count cannot exceed the available crewmate slots. Changes clear readiness. Roles are assigned randomly by the server.
- Players can chat in the lobby and in meetings. Living players cannot send chat during ordinary play. Eliminated players have a separate ghost channel that living players never receive.
- The host can remove lobby players. If the host disconnects, control transfers to a connected crewmate. A lost connection can resume the same player for 30 seconds; after that, the abandoned character leaves the round. Rejoining is not supported after a server restart.
- The round starts with 3 seconds of darkness followed by your private role reveal. At the end, the host returns everyone to the lobby for another round.

## Controls and game features

WASD or arrow keys move. Click inside your view circle to walk. On mobile, use the thumb joystick. Tap an assigned task or a map objective for automatic navigation.

**E / Space:** use tasks, repair panels, the emergency button, or Security. **Q:** kill as an impostor. **R:** report a nearby visible body. **V:** enter/exit vents. **B:** Scientist vitals. **F:** sabotage choices. **M:** ship map. Use Escape to close ordinary panels.

Both The Skeld and Aurora Station are available. Each has its own rooms, task locations, vents, repair systems, and exactly three fixed Security cameras. The server limits received player positions and camera feeds by visibility and walls. Roles and impostor teammates are private. Vitals report actual deaths; normal living-player rosters do not reveal unreported remote eliminations.

The twelve task minigames include garbage chute, oil change, wireless transfer, wiring, card swipe, asteroids, shields, medical scan, charting a course, O₂ filter cleaning, distributor calibration, and reactor memory. The server verifies task assignment, proximity, a per-player work ticket, and elapsed work before recording progress. Task puzzle interactions run in the browser; this is a casual game, not a tournament anti-cheat system.

Lights, Reactor, Oxygen, and Communications sabotages require the correct physical repair panels. Lights stay dark until repaired. Security and vitals disconnect during Communications sabotage. Engineers can stay in vents for 8 seconds, then recharge for 25 seconds; impostors also use vents. Hidden actors and their pets disappear from other players and all camera feeds.

Mini crewmate, stickman, UFO, and blue one-eyed dog pets follow their owners and are eliminated with them. Outfits include the fitted tie, antenna, Jason-style mask, and taped DUM note. Player-involved kills have a brief red animation. **The online world continues during tasks, cameras, vitals, maps, and kill scenes**; other players are never paused by your screen. Meetings freeze walking and sabotage countdowns.

Crew win by completing every assigned crew task or eliminating every impostor. Ghost crewmates can still do their tasks. Impostors win at parity with the living crew or when a critical sabotage expires. Disconnected players remain vulnerable during their 30-second reconnection window; departed players are removed from task requirements.

Use **Practice with AI** for the original single-player game with its existing AI, difficulty options, wardrobe, and mobile controls. The practice game also works offline.

## Run and test locally

Install Node 22–24, then run these commands in the folder:

```
npm ci
npm test
npm start
```

Open `http://localhost:3000`. For a local multiplayer check, use several browser tabs or separate devices on the same network. Each tab has its own session. To use another device on your home network, open `http://YOUR-COMPUTER-LAN-IP:3000` there and permit the local server through your own firewall if required. Production players should use the Render HTTPS address.

`GET /health` returns JSON with `ok: true`. The server binds to `0.0.0.0` and Render's `PORT` automatically. Only the two public HTML files and the health endpoint are served; source files and session tokens are not exposed as website routes. Messages have size and frequency limits, names and chat render as text, and every action uses the identity of its own socket.

Validation passed 17 multiplayer rule and network checks, including a real fifteen-player WebSocket room alongside a separate private room and synchronized movement. A bundled-client test also passed room creation, role reveal, task completion, cameras, vitals, vent travel, light repairs, mobile controls, meetings, chat, voting, kill scenes, reconnection, and returning to the lobby. The original 72 single-player checks are retained in the development source. The in-app browser preview could not connect in the authoring environment, so a visual browser pass and a deployment on your Render account are still required. No claim of live worldwide deployment or unlimited server capacity is made.

## Operations

- Avoid deploying code in the middle of a match: deployment restarts this single-instance server and clears the rooms.
- Repeated connection failures: confirm Render is **Live**, service type is **Web Service**, Start Command is `npm start`, `/health` responds, and every required file is in the repository root.
- If the room list is empty, create a public room. The browser only lists rooms on this specific service, not other copies of the game on other websites.
- This is a guest-based casual game without accounts, voice chat, saved rankings, cross-server matchmaking, regional server fleets, or persistent matches. Keep your invitation code private if you only want friends in a room.
