from fastapi import APIRouter, HTTPException, status, Header, Depends
from typing import Optional
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.schemas import ApiResponse, LoginRequest, SignupRequest, TokenResponse, UserResponse
from backend.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=ApiResponse[TokenResponse], summary="User Login")
async def login(request: LoginRequest, db: Optional[Session] = Depends(get_db)):
    """
    Authenticate user against Supabase PostgreSQL and return session token.
    """
    user_dict, token = AuthService.authenticate(
        email=request.email,
        password=request.password,
        db=db
    )
    
    token_data = TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(
            id=user_dict["id"],
            name=user_dict["name"],
            email=user_dict["email"],
            role=user_dict["role"],
            company=user_dict["company"]
        )
    )
    return ApiResponse(
        success=True,
        data=token_data,
        message="Login successful"
    )

@router.post("/signup", response_model=ApiResponse[TokenResponse], summary="User Registration")
async def signup(request: SignupRequest, db: Optional[Session] = Depends(get_db)):
    """
    Register a new user account in Supabase PostgreSQL.
    """
    user_dict, token = AuthService.register(
        name=request.name,
        email=request.email,
        password=request.password,
        company=request.company,
        db=db
    )

    
    token_data = TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(
            id=user_dict["id"],
            name=user_dict["name"],
            email=user_dict["email"],
            role=user_dict["role"],
            company=user_dict["company"]
        )
    )
    return ApiResponse(
        success=True,
        data=token_data,
        message="Account created successfully"
    )

@router.get("/me", response_model=ApiResponse[UserResponse], summary="Current User Profile")
async def get_current_user(
    authorization: Optional[str] = Header(None),
    db: Optional[Session] = Depends(get_db)
):
    """
    Retrieve profile of the authenticated user from Supabase PostgreSQL.
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided"
        )

    user_dict = AuthService.get_current_user(token=authorization, db=db)
    return ApiResponse(
        success=True,
        data=UserResponse(
            id=user_dict["id"],
            name=user_dict["name"],
            email=user_dict["email"],
            role=user_dict["role"],
            company=user_dict["company"]
        ),
        message="Profile retrieved successfully"
    )

@router.post("/logout", response_model=ApiResponse[bool], summary="User Logout")
async def logout(
    authorization: Optional[str] = Header(None),
    db: Optional[Session] = Depends(get_db)
):
    """
    Invalidate current user session.
    """
    if authorization:
        AuthService.logout(token=authorization, db=db)
    return ApiResponse(
        success=True,
        data=True,
        message="Logged out successfully"
    )
