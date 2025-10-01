#!/bin/bash

# Script to download missing tech logos from official sources
# These logos are not available in simple-icons

echo "Downloading missing tech logos..."

# Create temp directory
mkdir -p temp_logos

# AWS - Amazon Web Services
echo "Downloading AWS logo..."
curl -L "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" -o "temp_logos/aws.svg"

# Azure - Microsoft Azure
echo "Downloading Azure logo..."
curl -L "https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg" -o "temp_logos/azure.svg"

# Amplitude
echo "Downloading Amplitude logo..."
curl -L "https://companieslogo.com/img/orig/amplitude-c3d9f5b8.svg" -o "temp_logos/amplitude.svg"

# Segment (Twilio Segment)
echo "Downloading Segment logo..."
curl -L "https://cdn.brandfetch.io/idZgwZSSc3/w/400/h/400/theme/dark/icon.svg?t=1734041277040" -o "temp_logos/segment.svg"

# Adobe XD
echo "Downloading Adobe XD logo..."
curl -L "https://upload.wikimedia.org/wikipedia/commons/c/c2/Adobe_XD_CC_icon.svg" -o "temp_logos/adobe-xd.svg"

# VS Code
echo "Downloading VS Code logo..."
curl -L "https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg" -o "temp_logos/vscode.svg"

# Visual Studio
echo "Downloading Visual Studio logo..."
curl -L "https://upload.wikimedia.org/wikipedia/commons/2/2c/Visual_Studio_Icon_2022.svg" -o "temp_logos/visualstudio.svg"

# Playwright
echo "Downloading Playwright logo..."
curl -L "https://playwright.dev/img/playwright-logo.svg" -o "temp_logos/playwright.svg"

# TestFlight
echo "Downloading TestFlight logo..."
curl -L "https://upload.wikimedia.org/wikipedia/commons/6/6b/TestFlight_Logo.svg" -o "temp_logos/testflight.svg"

echo ""
echo "Download complete! Now copying to public/images/tech/..."

# Copy to destination
cp temp_logos/*.svg public/images/tech/

# Clean up
rm -rf temp_logos

echo ""
echo "✓ All missing logos downloaded and copied successfully!"
echo ""
echo "Summary of downloaded logos:"
ls -lh public/images/tech/{aws,azure,amplitude,segment,adobe-xd,vscode,visualstudio,playwright,testflight}.svg 2>/dev/null | awk '{print "  - " $9 " (" $5 ")"}'
