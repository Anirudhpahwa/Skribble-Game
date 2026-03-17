from typing import Dict, List, Optional
from uuid import uuid4
import time

class Room:
    def __init__(self, room_code: str, host_id: str, host_username: str):
        self.room_code = room_code
        self.host_id = host_id
        self.players = [{
            "id": host_id,
            "username": host_username,
            "score": 0,
            "is_host": True
        }]
        self.status = "lobby"  # lobby, playing, finished
        self.created_at = time.time()
    
    def add_player(self, player_id: str, username: str) -> bool:
        # Check if player already exists
        for player in self.players:
            if player["id"] == player_id:
                return False
        
        # Add new player
        self.players.append({
            "id": player_id,
            "username": username,
            "score": 0,
            "is_host": False
        })
        return True
    
    def remove_player(self, player_id: str) -> bool:
        for i, player in enumerate(self.players):
            if player["id"] == player_id:
                # Don't allow removing host
                if player["is_host"]:
                    return False
                self.players.pop(i)
                return True
        return False
    
    def get_player(self, player_id: str) -> Optional[dict]:
        for player in self.players:
            if player["id"] == player_id:
                return player
        return None
    
    def start_game(self) -> bool:
        if self.status != "lobby":
            return False
        self.status = "playing"
        return True
    
    def to_dict(self) -> dict:
        return {
            "room_code": self.room_code,
            "players": self.players,
            "host_id": self.host_id,
            "status": self.status,
            "created_at": self.created_at
        }

class RoomManager:
    def __init__(self):
        self.rooms: Dict[str, Room] = {}
    
    def create_room(self, username: str) -> Room:
        # Generate a unique room code
        room_code = str(uuid4())[:8].upper()
        host_id = str(uuid4())
        
        room = Room(room_code, host_id, username)
        self.rooms[room_code] = room
        return room
    
    def join_room(self, room_code: str, username: str) -> Optional[Room]:
        room = self.rooms.get(room_code)
        if not room:
            return None
        
        # Check if room is full or already playing
        if room.status != "lobby":
            return None
        
        player_id = str(uuid4())
        if room.add_player(player_id, username):
            return room
        return None
    
    def get_room(self, room_code: str) -> Optional[Room]:
        return self.rooms.get(room_code)
    
    def start_game(self, room_code: str, player_id: str) -> bool:
        room = self.rooms.get(room_code)
        if not room:
            return False
        
        # Check if player is host
        host_player = room.get_player(player_id)
        if not host_player or not host_player["is_host"]:
            return False
        
        return room.start_game()
    
    def delete_empty_rooms(self):
        # Clean up empty rooms (optional)
        to_delete = []
        for room_code, room in self.rooms.items():
            if len(room.players) == 0:
                to_delete.append(room_code)
        
        for room_code in to_delete:
            del self.rooms[room_code]

# Global room manager instance
room_manager = RoomManager()
