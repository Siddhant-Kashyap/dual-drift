# Dual Drift – 3D Dual Control Racing Game
Version: 1.0
Engine: Three.js
Framework: Next.js (App Router)
Language: TypeScript

---

# 1. GAME OVERVIEW

Dual Drift is a 3D endless runner where the player controls two cars simultaneously.

Left Car:
- Controlled using A (left) and D (right)

Right Car:
- Controlled using J (left) and L (right)

There are 4 lanes total:
Lane Index:
0, 1 → Left Car lanes
2, 3 → Right Car lanes

Obstacles:
- Blue → Score
- Red → Instant Death

Game runs infinitely until collision with red obstacle.

---

# 2. PROJECT STRUCTURE

src/
  game/
    core/
      Game.ts
      SceneManager.ts
      Renderer.ts
      Camera.ts
      Loop.ts
    world/
      Road.ts
      Environment.ts
    entities/
      Car.ts
      Obstacle.ts
    systems/
      InputSystem.ts
      SpawnSystem.ts
      CollisionSystem.ts
      DifficultySystem.ts
      LaneSystem.ts
    utils/
      Constants.ts
      MathUtils.ts

---

# 3. CONSTANTS

File: utils/Constants.ts

export const LANES = [-3, -1, 1, 3];

export const GAME_CONFIG = {
  baseSpeed: 0.25,
  maxSpeed: 1.2,
  speedIncrement: 0.0005,
  baseSpawnRate: 1.8,
  minSpawnRate: 0.5,
  spawnAcceleration: 0.001,
};

---

# 4. GAME FLOW

Game.ts

Responsibilities:
- Initialize all systems
- Start game loop
- Handle restart
- Track score

Game Lifecycle:

init()
start()
update(deltaTime)
endGame()
restart()

---

# 5. SCENE MANAGER

SceneManager.ts

Responsibilities:
- Create scene
- Add lights
- Add fog
- Add world elements

Scene settings:
- Background: black
- Fog: start 20, end 60
- Directional + ambient light

---

# 6. ROAD SYSTEM

Road.ts

Use 5 repeating segments.

Each segment:
- PlaneGeometry
- Width: 10
- Length: 40

Movement:
Each frame:
  segment.position.z += speed

If segment.position.z > segmentLength:
  reposition to front

---

# 7. ENVIRONMENT SYSTEM

Environment.ts

Contains:
- Buildings (boxes)
- Trees (cylinder + sphere)

Use chunk recycling similar to road.

NO physics.
NO collision with environment.

---

# 8. CAR ENTITY

Car.ts

Properties:
- mesh
- laneIndex
- targetLaneX
- speed

Methods:
- setLane(index)
- update()

Movement:
mesh.position.x = lerp(currentX, targetLaneX, 0.2)

Cars auto-move forward by world movement illusion.

---

# 9. LANE SYSTEM

LaneSystem.ts

Responsibilities:
- Restrict lane boundaries
- Clamp lane index
- Map laneIndex → LANES constant

Left car allowed lanes: 0,1
Right car allowed lanes: 2,3

---

# 10. INPUT SYSTEM

InputSystem.ts

Listen for:
A / D → Left car lane change
J / L → Right car lane change

Prevent lane overflow.

No key repeat spam:
Implement cooldown (100ms).

---

# 11. OBSTACLE ENTITY

Obstacle.ts

Properties:
- mesh
- laneIndex
- type (blue | red)

Spawn position:
z = -60 (far ahead)

Movement:
mesh.position.z += speed

Despawn:
If position.z > 10 → remove & recycle

Color:
Blue → 0x00ffff
Red → 0xff0000

---

# 12. SPAWN SYSTEM

SpawnSystem.ts

Tracks:
- currentSpawnTimer
- spawnInterval

Logic:

spawnInterval = max(
  minSpawnRate,
  baseSpawnRate - (elapsedTime * spawnAcceleration)
)

Every spawn:
- Random lane (0-3)
- Random type (blue 70%, red 30%)

---

# 13. COLLISION SYSTEM

CollisionSystem.ts

Simple AABB collision:

if (abs(car.x - obstacle.x) < thresholdX
  && abs(car.z - obstacle.z) < thresholdZ)

If obstacle.type === red:
  endGame()

If obstacle.type === blue:
  increaseScore()
  remove obstacle

---

# 14. DIFFICULTY SYSTEM

DifficultySystem.ts

Speed increases over time:

speed = min(
  maxSpeed,
  baseSpeed + (elapsedTime * speedIncrement)
)

---

# 15. SCORE SYSTEM

Score increases when:
- Blue obstacle hit

Combo:
If both cars hit blue within 500ms:
  apply multiplier x2

Score formula:
score += 10 * multiplier

---

# 16. GAME LOOP

Loop.ts

Use requestAnimationFrame.

On each frame:
- deltaTime calculation
- Update difficulty
- Move road
- Move obstacles
- Update cars
- Check collision
- Render scene

---

# 17. GAME STATES

enum GameState:
- MENU
- PLAYING
- GAME_OVER

Game state controls:
- Input active only in PLAYING
- Spawn only in PLAYING

---

# 18. MODEL REPLACEMENT RULE

IMPORTANT:

Car.ts must expose:

setMesh(mesh: THREE.Object3D)

Obstacle.ts must allow:

setMesh(mesh: THREE.Object3D)

This ensures:
You can replace BoxGeometry with GLTF models without changing logic.

---

# 19. PERFORMANCE RULES

- Use object pooling for obstacles
- No new geometry inside loop
- No console logs in production
- Cap FPS logic using deltaTime
- Lazy load Three.js page only

---

# 20. FUTURE EXTENSIONS (Optional)

- Leaderboard API
- Ghost replay
- Color invert mode
- Hardcore mode
- Mobile touch control

---

# END OF SPEC