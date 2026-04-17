from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline
from PIL import Image, ImageStat
import io

app = FastAPI(title="AnimeVision AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

classifier = pipeline(
    task="zero-shot-image-classification",
    model="openai/clip-vit-base-patch32"
)

CANDIDATE_LABELS = [
    "action anime",
    "adventure anime",
    "fantasy anime",
    "dark fantasy anime",
    "supernatural anime",
    "psychological anime",
    "post-apocalyptic anime",
    "military anime",
    "survival anime",
    "mystery anime",
    "horror anime",
    "drama anime",
    "romance anime",
    "school anime",
    "slice of life anime",
    "sports anime",
    "martial arts anime",
    "mecha anime",
    "super power anime",
    "shounen anime",
    "seinen anime",
    "space western anime",
    "sci-fi noir anime",
    "bounty hunter anime",
    "cyberpunk anime",
    "jazz anime",
    "stylized action anime",
    "bizarre anime",
    "crime anime",
    "detective anime",
    "historical anime",
    "samurai anime"
]

def infer_visual_style(image: Image.Image) -> str:
    rgb = image.convert("RGB")
    stat = ImageStat.Stat(rgb)

    r, g, b = stat.mean
    brightness = (r + g + b) / 3

    max_rgb = max(r, g, b)
    min_rgb = min(r, g, b)
    saturation_like = max_rgb - min_rgb

    if brightness < 85:
        return "dark"
    if saturation_like > 70 and brightness > 110:
        return "colorful"
    if brightness < 120 and saturation_like < 25:
        return "noir"
    if b > r and b > g and brightness > 100:
        return "futuristic"

    return "neutral"

@app.get("/")
def root():
    return {"message": "AnimeVision AI running"}

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    content = await file.read()
    image = Image.open(io.BytesIO(content)).convert("RGB")

    result = classifier(image, candidate_labels=CANDIDATE_LABELS)

    filtered = []
    for item in result[:6]:
        score = round(float(item["score"]), 4)
        if score >= 0.12:
            filtered.append({
                "label": item["label"],
                "score": score
            })

    if not filtered:
        filtered = [
            {
                "label": item["label"],
                "score": round(float(item["score"]), 4)
            }
            for item in result[:3]
        ]

    visual_style = infer_visual_style(image)

    return {
        "labels": filtered,
        "visualStyle": visual_style
    }