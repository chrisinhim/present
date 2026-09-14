import os

from playwright.sync_api import sync_playwright


BASE_URL = os.getenv('PRESENT_BASE_URL', 'http://127.0.0.1:4200')

def before_all(context):
    context.playwright = sync_playwright().start()
    context.browser = context.playwright.chromium.launch(
        headless=os.getenv('PRESENT_HEADLESS', 'true').lower() == 'true'
    )

def before_scenario(context, scenario):
    context.browser_context = context.browser.new_context()
    context.page = context.browser_context.new_page()
    context.page.set_default_timeout(5000)
    context.page.set_default_navigation_timeout(15000)

def after_scenario(context, scenario):
    context.browser_context.close()

def after_all(context):
    context.browser.close()
    context.playwright.stop()
