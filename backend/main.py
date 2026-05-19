from pathlib import Path

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from database import engine, get_db, Base
from models import User, Job
from schemas import (
    UserRegister, UserLogin, TokenResponse, UserResponse,
    JobCreate, JobUpdate, JobResponse,
)
from auth import hash_password, verify_password, create_token, get_current_user

Base.metadata.create_all(bind=engine)

app = FastAPI(title="JobTracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/register", response_model=TokenResponse, status_code=201)
def register(data: UserRegister, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=409, detail="Email already registered")
    user = User(name=data.name, email=data.email, hashed_password=hash_password(data.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return TokenResponse(token=create_token(user.id), user=UserResponse.model_validate(user))


@app.post("/api/login", response_model=TokenResponse)
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return TokenResponse(token=create_token(user.id), user=UserResponse.model_validate(user))


@app.get("/api/me", response_model=UserResponse)
def get_me(user: User = Depends(get_current_user)):
    return user


@app.get("/api/jobs", response_model=list[JobResponse])
def get_jobs(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Job).filter(Job.user_id == user.id).all()


@app.post("/api/jobs", response_model=JobResponse, status_code=201)
def create_job(job: JobCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_job = Job(**job.model_dump(), user_id=user.id)
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job


@app.put("/api/jobs/{job_id}", response_model=JobResponse)
def update_job(job_id: str, job: JobUpdate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_job = db.query(Job).filter(Job.id == job_id, Job.user_id == user.id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")
    for key, value in job.model_dump(exclude_unset=True).items():
        setattr(db_job, key, value)
    db.commit()
    db.refresh(db_job)
    return db_job


@app.delete("/api/jobs/{job_id}", status_code=204)
def delete_job(job_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_job = db.query(Job).filter(Job.id == job_id, Job.user_id == user.id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")
    db.delete(db_job)
    db.commit()


STATIC_DIR = Path(__file__).resolve().parent.parent / "frontend" / "dist"

if STATIC_DIR.exists():
    app.mount("/assets", StaticFiles(directory=STATIC_DIR / "assets"), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = STATIC_DIR / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(STATIC_DIR / "index.html")
