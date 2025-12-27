#!/bin/bash

# Dev Club Website Setup Script
# This script will move the template to /Users/geetanshgoyal/Desktop/devforge and set it up

echo "🚀 Setting up Dev Club website..."
echo ""

# Define paths
TEMPLATE_DIR="/Users/geetanshgoyal/Desktop/website/devforge-template"
TARGET_DIR="/Users/geetanshgoyal/Desktop/devforge"

# Check if template exists
if [ ! -d "$TEMPLATE_DIR" ]; then
    echo "❌ Error: Template directory not found at $TEMPLATE_DIR"
    exit 1
fi

# Check if target directory already exists
if [ -d "$TARGET_DIR" ]; then
    echo "⚠️  Warning: $TARGET_DIR already exists."
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled."
        exit 1
    fi
    echo "🗑️  Removing existing directory..."
    rm -rf "$TARGET_DIR"
fi

# Copy template to target directory
echo "📁 Copying files to $TARGET_DIR..."
cp -r "$TEMPLATE_DIR" "$TARGET_DIR"

# Navigate to target directory
cd "$TARGET_DIR" || exit 1

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Success message
echo ""
echo "✅ Setup complete!"
echo ""
echo "🎉 Your Dev Club website is ready!"
echo ""
echo "To start the development server:"
echo "  cd $TARGET_DIR"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo ""
