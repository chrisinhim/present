# Browser Workflow Tests

The workflow suite uses Behave with Playwright and covers the controller's TEXT, VERSE, TIMER, and LYRICS modes.

## Prerequisites

Install the Python dependencies:

```powershell
python -m pip install -r requirements.txt
python -m playwright install chromium
```

Start the Angular application in one terminal:

```powershell
npm start -- --host 127.0.0.1
```

Run the complete workflow suite in another terminal:

```powershell
$env:PRESENT_HEADLESS = 'true'
$env:PRESENT_BASE_URL = 'http://127.0.0.1:4200'
python -m behave features/appLaunch.feature --format progress
```

Set `PRESENT_HEADLESS=false` to watch the browser while debugging a scenario. The suite creates a fresh browser context per scenario so local storage and presentation history do not leak between workflows.

The scenarios cover:

- TEXT formatting, position controls, presentation, replay, and history clearing.
- VERSE QUOTE and REFER formatting, position controls, presentation, replay, and history clearing.
- TIMER Time Now, Countdown, and Pomodoro formatting, position controls, presentation, replay, and history clearing.
- LYRICS paste and text-file browsing, stanza presentation, formatting, position controls, replay, and history clearing.
