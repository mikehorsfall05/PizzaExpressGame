# Pizza Game - Standalone p5.js Project

Your p5.js pizza game is now set up to run outside of the p5.js web editor!

## Project Structure
```
projectTest/
├── index.html          # Main HTML file
├── 22-4-26.js          # Current game code
├── PNG Pizza Express Photos/  # Game art and sound/image assets used by the current build
├── Sauce Tomato Font/         # Font files used by the current build
├── run.bat             # Batch file to start local server
└── README.md           # This file
```

## How to Run

### Option 1: Using the Batch File (Windows)
1. Double-click `run.bat` in the project folder
2. Open your browser to `http://localhost:8000`
3. Click on `index.html` to play the game

### Option 2: Manual Python Server
1. Open Command Prompt in the project folder
2. Run: `python -m http.server 8000`
3. Open your browser to `http://localhost:8000`

### Option 3: Direct File Opening
- Simply double-click `index.html` to open it in the browser
- **Note:** Some browsers may block image loading if opened directly as a file. Using a local server (Options 1 or 2) is recommended.

## Features
- Click to time the dough at the right size
- Add toppings from the tray
- Watch the cheese melt
- Bake your pizza
- Slice it into the required number of pieces
- Get a star rating!

## Requirements
- A modern web browser (Chrome, Firefox, Edge, Safari)
- Python 3.x (if using server options)

## Troubleshooting

**Images not loading?**
- Make sure you're using a local server (options 1 or 2) rather than opening the HTML file directly

**Port 8000 already in use?**
- Change `8000` to another port number like `8001` or `8080` in the batch file or terminal command

**Can't find the game?**
- Check that all files are in the correct locations:
  - `22-4-26.js` in the root project folder
  - `PNG Pizza Express Photos/` folder with the current game images
  - `Sauce Tomato Font/` folder with the font files
  - `index.html` in the root project folder

Enjoy your game!
