#!/usr/bin/env bash
# Requires: sharp-cli or imagemagick + cwebp + avif encoder (cavif or avifenc)
set -euo pipefail

mkdir -p public/images
for src in src_images/*.{jpg,jpeg,png}; do
  [ -e "$src" ] || continue
  name=$(basename "$src")
  base="${name%.*}"
  # generate 400, 800, 1200 JPEG
  npx sharp "$src" -resize 400 -quality 80 "public/images/${base}-400.jpg"
  npx sharp "$src" -resize 800 -quality 80 "public/images/${base}-800.jpg"
  npx sharp "$src" -resize 1200 -quality 80 "public/images/${base}-1200.jpg"
  # webp
  npx sharp "$src" -resize 400 -webp -o "public/images/${base}-400.webp"
  npx sharp "$src" -resize 800 -webp -o "public/images/${base}-800.webp"
  npx sharp "$src" -resize 1200 -webp -o "public/images/${base}-1200.webp"
  # avif
  npx sharp "$src" -resize 400 -avif -o "public/images/${base}-400.avif"
  npx sharp "$src" -resize 800 -avif -o "public/images/${base}-800.avif"
  npx sharp "$src" -resize 1200 -avif -o "public/images/${base}-1200.avif"
done

echo "Image variants generated in public/images/"
