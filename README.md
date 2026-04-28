# 🍕 Pizza Express Game

A browser-based pizza restaurant management game built with plain HTML, CSS, and JavaScript (no build tools required).

## How to Play

1. Open `index.html` in any modern web browser.
2. Click **Open Restaurant** to start the day – customers will begin placing orders.
3. Click an order card to select it, then build the matching pizza using the dropdowns and toppings checkboxes.
4. Click **Serve Pizza** to serve it.
   - A **perfect match** earns bonus points based on how quickly you served it.
   - A **wrong pizza** still earns a small amount of cash and score.
   - An **expired order** deducts 5 points – serve fast!
5. Once all orders for the day are resolved, click **Next Day** to continue.
6. Reach **200 points** within 7 days to win!

## Scoring

| Event | Points |
|-------|--------|
| Perfect pizza served | 10 + remaining seconds |
| Wrong pizza served | 2 |
| Order expired | −5 |

## Project Structure

```
PizzaExpressGame/
├── index.html   # Game UI / markup
├── style.css    # Styling
├── game.js      # Game logic
└── README.md    # This file
```

## Running Locally

No installation needed. Simply open `index.html` in your browser:

```bash
# On Linux / macOS
open index.html

# On Windows
start index.html
```

## License

MIT
