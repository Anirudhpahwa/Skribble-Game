from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.health import router as health_router
from api.test import router as test_router

app = FastAPI(title="Scribble Arena API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health_router, prefix="/health", tags=["health"])
app.include_router(test_router, prefix="/test", tags=["test"])

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to Scribble Arena API"}
