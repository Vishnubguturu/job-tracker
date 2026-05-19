from pydantic import BaseModel


class UserRegister(BaseModel):
    name: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: str

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    token: str
    user: UserResponse


class JobCreate(BaseModel):
    company: str
    role: str
    location: str = ""
    pay: str = ""
    status: str = "Waiting"
    next_stage: str = "N/A"
    email: str = ""
    referred: bool = False
    date_applied: str
    notes: str = ""


class JobUpdate(BaseModel):
    company: str | None = None
    role: str | None = None
    location: str | None = None
    pay: str | None = None
    status: str | None = None
    next_stage: str | None = None
    email: str | None = None
    referred: bool | None = None
    date_applied: str | None = None
    notes: str | None = None


class JobResponse(BaseModel):
    id: str
    company: str
    role: str
    location: str
    pay: str
    status: str
    next_stage: str
    email: str
    referred: bool
    date_applied: str
    notes: str

    model_config = {"from_attributes": True}
