import pgzrun
import random
import math
from pygame import Rect

# Game constants
WIDTH = 800
HEIGHT = 600
CELL_SIZE = 50
GRID_WIDTH = WIDTH // CELL_SIZE
GRID_HEIGHT = HEIGHT // CELL_SIZE

# Game states
STATE_MENU = "menu"
STATE_PLAYING = "playing"
STATE_GAME_OVER = "game_over"


class AnimatedSprite:
    """Base class for animated sprites with movement"""
    
    def __init__(self, grid_x, grid_y, animation_frames, animation_speed=0.15):
        self.grid_x = grid_x
        self.grid_y = grid_y
        self.target_x = grid_x
        self.target_y = grid_y
        self.x = grid_x * CELL_SIZE + CELL_SIZE // 2
        self.y = grid_y * CELL_SIZE + CELL_SIZE // 2
        self.animation_frames = animation_frames
        self.animation_speed = animation_speed
        self.current_frame = 0
        self.animation_timer = 0
        self.moving = False
        
    def update(self, dt):
        # Update animation
        self.animation_timer += dt
        if self.animation_timer >= self.animation_speed:
            self.animation_timer = 0
            self.current_frame = (self.current_frame + 1) % len(self.animation_frames)
        
        # Smooth movement
        target_pixel_x = self.target_x * CELL_SIZE + CELL_SIZE // 2
        target_pixel_y = self.target_y * CELL_SIZE + CELL_SIZE // 2
        
        if abs(self.x - target_pixel_x) > 2:
            self.x += (target_pixel_x - self.x) * 0.2
            self.moving = True
        else:
            self.x = target_pixel_x
            self.grid_x = self.target_x
            
        if abs(self.y - target_pixel_y) > 2:
            self.y += (target_pixel_y - self.y) * 0.2
            self.moving = True
        else:
            self.y = target_pixel_y
            self.grid_y = self.target_y
            
        if abs(self.x - target_pixel_x) <= 2 and abs(self.y - target_pixel_y) <= 2:
            self.moving = False
    
    def move_to(self, new_x, new_y):
        self.target_x = new_x
        self.target_y = new_y
        
    def get_rect(self):
        return Rect(self.x - CELL_SIZE // 2, self.y - CELL_SIZE // 2, CELL_SIZE, CELL_SIZE)


class Player(AnimatedSprite):
    """Player character with health"""
    
    def __init__(self, grid_x, grid_y):
        super().__init__(grid_x, grid_y, ['idle1', 'idle2', 'idle3', 'idle2'])
        self.health = 3
        self.max_health = 3
        self.collected_gems = 0
        
    def take_damage(self):
        self.health -= 1
        if game.sound_enabled:
            try:
                sounds.hit.play()
            except:
                pass  # Sound file not found


class Enemy(AnimatedSprite):
    """Enemy that patrols territory"""
    
    def __init__(self, grid_x, grid_y, patrol_points):
        super().__init__(grid_x, grid_y, ['enemy1', 'enemy2', 'enemy3', 'enemy2'], 0.2)
        self.patrol_points = patrol_points
        self.current_patrol_index = 0
        self.wait_timer = 0
        self.wait_duration = 1.0
        
    def update_patrol(self, dt, dungeon):
        if self.moving:
            return
            
        self.wait_timer += dt
        if self.wait_timer < self.wait_duration:
            return
            
        self.wait_timer = 0
        self.current_patrol_index = (self.current_patrol_index + 1) % len(self.patrol_points)
        next_point = self.patrol_points[self.current_patrol_index]
        
        if dungeon.is_walkable(next_point[0], next_point[1]):
            self.move_to(next_point[0], next_point[1])


class Dungeon:
    """Dungeon map with walls and floor"""
    
    def __init__(self):
        self.tiles = [[1 for _ in range(GRID_WIDTH)] for _ in range(GRID_HEIGHT)]
        self.generate_dungeon()
        
    def generate_dungeon(self):
        # Create rooms
        rooms = [
            (2, 2, 5, 4),
            (8, 1, 4, 3),
            (13, 2, 3, 5),
            (3, 7, 6, 4),
            (11, 8, 4, 3)
        ]
        
        for x, y, w, h in rooms:
            for ry in range(y, min(y + h, GRID_HEIGHT)):
                for rx in range(x, min(x + w, GRID_WIDTH)):
                    self.tiles[ry][rx] = 0
        
        # Create corridors
        corridors = [
            (7, 3, 8, 3),
            (12, 3, 13, 4),
            (5, 6, 5, 7),
            (9, 7, 11, 9)
        ]
        
        for x1, y1, x2, y2 in corridors:
            if x1 == x2:
                for y in range(min(y1, y2), max(y1, y2) + 1):
                    if 0 <= y < GRID_HEIGHT:
                        self.tiles[y][x1] = 0
            else:
                for x in range(min(x1, x2), max(x1, x2) + 1):
                    if 0 <= x < GRID_WIDTH:
                        self.tiles[y1][x] = 0
    
    def is_walkable(self, grid_x, grid_y):
        if 0 <= grid_x < GRID_WIDTH and 0 <= grid_y < GRID_HEIGHT:
            return self.tiles[grid_y][grid_x] == 0
        return False
    
    def draw(self):
        for y in range(GRID_HEIGHT):
            for x in range(GRID_WIDTH):
                px = x * CELL_SIZE
                py = y * CELL_SIZE
                if self.tiles[y][x] == 1:
                    screen.draw.filled_rect(Rect(px, py, CELL_SIZE, CELL_SIZE), (60, 60, 80))
                    screen.draw.rect(Rect(px, py, CELL_SIZE, CELL_SIZE), (40, 40, 60))
                else:
                    screen.draw.filled_rect(Rect(px, py, CELL_SIZE, CELL_SIZE), (100, 100, 120))


class Game:
    """Main game controller"""
    
    def __init__(self):
        self.state = STATE_MENU
        self.dungeon = None
        self.player = None
        self.enemies = []
        self.gems = []
        self.sound_enabled = True
        self.music_enabled = True
        self.menu_buttons = []
        self.create_menu()
        
    def create_menu(self):
        self.menu_buttons = [
            {'rect': Rect(300, 200, 200, 50), 'text': 'Start Game', 'action': 'start'},
            {'rect': Rect(300, 270, 200, 50), 'text': 'Toggle Sound', 'action': 'sound'},
            {'rect': Rect(300, 340, 200, 50), 'text': 'Exit', 'action': 'exit'}
        ]
    
    def start_game(self):
        self.state = STATE_PLAYING
        self.dungeon = Dungeon()
        self.player = Player(3, 3)
        
        # Create enemies with patrol routes
        self.enemies = [
            Enemy(10, 2, [(10, 2), (11, 2), (11, 3), (10, 3)]),
            Enemy(5, 8, [(5, 8), (6, 8), (7, 8), (6, 8)]),
            Enemy(14, 4, [(14, 4), (14, 5), (15, 5), (15, 4)])
        ]
        
        # Place gems
        self.gems = [(9, 2), (14, 3), (6, 9)]
        
        if self.music_enabled:
            try:
                music.play('background')
            except:
                pass  # Music file not found, continue without music
    
    def update(self, dt):
        if self.state == STATE_PLAYING:
            self.player.update(dt)
            
            for enemy in self.enemies:
                enemy.update(dt)
                enemy.update_patrol(dt, self.dungeon)
                
                # Check collision with player
                if (enemy.grid_x == self.player.grid_x and 
                    enemy.grid_y == self.player.grid_y and 
                    not self.player.moving):
                    self.player.take_damage()
                    if self.player.health <= 0:
                        self.state = STATE_GAME_OVER
                    else:
                        # Move player back to start
                        self.player.move_to(3, 3)
            
            # Check gem collection
            for gem in self.gems[:]:
                if (gem[0] == self.player.grid_x and 
                    gem[1] == self.player.grid_y):
                    self.gems.remove(gem)
                    self.player.collected_gems += 1
                    if self.sound_enabled:
                        try:
                            sounds.collect.play()
                        except:
                            pass  # Sound file not found
    
    def draw(self):
        screen.clear()
        
        if self.state == STATE_MENU:
            screen.draw.text("DUNGEON QUEST", center=(WIDTH // 2, 100), 
                           fontsize=60, color="white")
            for button in self.menu_buttons:
                screen.draw.filled_rect(button['rect'], (80, 80, 120))
                screen.draw.text(button['text'], center=(button['rect'].centerx, button['rect'].centery),
                               fontsize=30, color="white")
        
        elif self.state == STATE_PLAYING:
            self.dungeon.draw()
            
            # Draw gems
            for gem_x, gem_y in self.gems:
                px = gem_x * CELL_SIZE + CELL_SIZE // 2
                py = gem_y * CELL_SIZE + CELL_SIZE // 2
                screen.draw.filled_circle((px, py), 8, (255, 215, 0))
            
            # Draw enemies
            for enemy in self.enemies:
                frame = enemy.animation_frames[enemy.current_frame]
                self.draw_character(enemy.x, enemy.y, (220, 50, 50), frame)
            
            # Draw player
            frame = self.player.animation_frames[self.player.current_frame]
            self.draw_character(self.player.x, self.player.y, (50, 150, 220), frame)
            
            # Draw UI
            screen.draw.text(f"Health: {self.player.health}/{self.player.max_health}", 
                           topleft=(10, 10), fontsize=30, color="white")
            screen.draw.text(f"Gems: {self.player.collected_gems}/3", 
                           topleft=(10, 45), fontsize=30, color="yellow")
        
        elif self.state == STATE_GAME_OVER:
            screen.draw.text("GAME OVER", center=(WIDTH // 2, HEIGHT // 2),
                           fontsize=60, color="red")
            screen.draw.text("Press SPACE to return to menu", 
                           center=(WIDTH // 2, HEIGHT // 2 + 60),
                           fontsize=30, color="white")
    
    def draw_character(self, x, y, color, frame):
        """Draw animated character"""
        size = CELL_SIZE - 10
        
        # Body
        screen.draw.filled_circle((x, y), size // 2, color)
        
        # Animation variations
        if frame == 'idle1' or frame == 'enemy1':
            offset = 3
        elif frame == 'idle2' or frame == 'enemy2':
            offset = 0
        elif frame == 'idle3' or frame == 'enemy3':
            offset = -3
        else:
            offset = 0
        
        # Eyes
        eye_y = y - 5 + offset // 3
        screen.draw.filled_circle((x - 7, eye_y), 3, (255, 255, 255))
        screen.draw.filled_circle((x + 7, eye_y), 3, (255, 255, 255))
        screen.draw.filled_circle((x - 7, eye_y), 2, (0, 0, 0))
        screen.draw.filled_circle((x + 7, eye_y), 2, (0, 0, 0))
        
        # Movement indicator
        if frame in ['idle1', 'enemy1']:
            screen.draw.line((x - 10, y + size // 2), (x - 15, y + size // 2 + 5), (color[0] - 30, color[1] - 30, color[2] - 30))
            screen.draw.line((x + 10, y + size // 2), (x + 15, y + size // 2 + 5), (color[0] - 30, color[1] - 30, color[2] - 30))
        elif frame in ['idle3', 'enemy3']:
            screen.draw.line((x - 10, y + size // 2), (x - 12, y + size // 2 + 8), (color[0] - 30, color[1] - 30, color[2] - 30))
            screen.draw.line((x + 10, y + size // 2), (x + 12, y + size // 2 + 8), (color[0] - 30, color[1] - 30, color[2] - 30))


game = Game()


def update(dt):
    game.update(dt)


def draw():
    game.draw()


def on_key_down(key):
    if game.state == STATE_PLAYING and not game.player.moving:
        new_x, new_y = game.player.grid_x, game.player.grid_y
        
        if key == keys.UP:
            new_y -= 1
        elif key == keys.DOWN:
            new_y += 1
        elif key == keys.LEFT:
            new_x -= 1
        elif key == keys.RIGHT:
            new_x += 1
        
        if game.dungeon.is_walkable(new_x, new_y):
            game.player.move_to(new_x, new_y)
    
    elif game.state == STATE_GAME_OVER and key == keys.SPACE:
        game.state = STATE_MENU


def on_mouse_down(pos):
    if game.state == STATE_MENU:
        for button in game.menu_buttons:
            if button['rect'].collidepoint(pos):
                if button['action'] == 'start':
                    game.start_game()
                elif button['action'] == 'sound':
                    game.sound_enabled = not game.sound_enabled
                    game.music_enabled = not game.music_enabled
                    if game.music_enabled:
                        try:
                            music.play('background')
                        except:
                            pass  # Music file not found
                    else:
                        try:
                            music.stop()
                        except:
                            pass
                elif button['action'] == 'exit':
                    exit()


pgzrun.go()
