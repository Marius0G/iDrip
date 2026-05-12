import os
from fastapi import FastAPI

app = FastAPI(title="iDrip AI Service")


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "ai-service"}


@app.get("/")
def root() -> dict:
    return {"message": "iDrip AI Service is running"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
