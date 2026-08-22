from playwright.sync_api import sync_playwright

def before_all(context):
    # Start the Playwright driver instance
    context.playwright = sync_playwright().start()
    # Launch the browser (change headless=False to view the UI execution)
    context.browser = context.playwright.chromium.launch(headless=False)

def before_scenario(context, scenario):
    # Open a clean, isolated browser tab/context for every single scenario
    context.page = context.browser.new_page()

def after_scenario(context, scenario):
    # Safely close the tab/page after test completion
    context.page.close()

def after_all(context):
    # Teardown the browser and the core driver process
    context.browser.close()
    context.playwright.stop()
