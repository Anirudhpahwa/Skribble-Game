from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from rooms.room_manager import room_manager

router = APIRouter()

class CreateRoomRequest(BaseModel):
    username: str

class CreateRoomResponse(BaseModel):
    roomCode: str
    playerId: str

class JoinRoomRequest(BaseModel):
    roomCode: str
    username: str

class JoinRoomResponse(BaseModel):
    playerId: str
    players: List[dict]

class RoomInfoResponse(BaseModel):
    roomCode: str
    players: List[dict]
    hostId: str
    status: str

class StartGameRequest(BaseModel):
    playerId: str

class StartGameResponse(BaseModel):
    success: bool

@router.post("/create", response_model=CreateRoomResponse)
async def create_room(request: CreateRoomRequest):
    """Create a new room"""
    if not request.username or len(request.username.strip()) == 0:
        raise HTTPException(status_code=400, detail="Username is required")
    
    room = room_manager.create_room(request.username.strip())
    return CreateRoomResponse(
        roomCode=room.room_code,
        playerId=room.host_id
    )

@router.post("/join", response_model=JoinRoomResponse)
async def join_room(request: JoinRoomRequest):
    """Join an existing room"""
    if not request.roomCode or len(request.roomCode.strip()) == 0:
        raise HTTPException(status_code=400, detail="Room code is required")
    
    if not request.username or len(request.username.strip()) == 0:
        raise HTTPException(status_code=400, detail="Username is required")
    
    room = room_manager.join_room(request.roomCode.strip().upper(), request.username.strip())
    if not room:
        raise HTTPException(status_code=404, detail="Room not found or cannot join")
    
    # Find the player ID for the username we just added
    player_id = None
    for player in room.players:
        if player["username"] == request.username.strip():
            player_id = player["id"]
            break
    
    return JoinRoomResponse(
        playerId=player_id,
        players=room.players
    )

@router.get("/{room_code}", response_model=RoomInfoResponse)
async def get_room(room_code: str):
    """Get room information"""
    room = room_manager.get_room(room_code.strip().upper())
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    return RoomInfoResponse(
        roomCode=room.room_code,
        players=room.players,
        hostId=room.host_id,
        status=room.status
    )

class StartGameRequest(BaseModel):
    playerId: str

@router.post("/{room_code}/start", response_model=StartGameResponse)
async def start_game(room_code: str, request: StartGameRequest):
    """Start the game (host only)"""
    success = room_manager.start_game(room_code.strip().upper(), request.playerId)
    if not success:
        raise HTTPException(status_code=400, detail="Cannot start game")
    
    return StartGameResponse(success=True)
