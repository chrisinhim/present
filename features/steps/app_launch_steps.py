from behave import given, when, then
from playwright.sync_api import expect

# --- SETUP STEPS ---

@given('the user navigates to the presentation controller application')
def step_impl(context):
    # Replace with your actual local or staging server URL
    context.page.goto(r"C:\Workspaces\present\UI\index2.html") 

@given('the page finishes loading')
def step_impl(context):
    # Wait until the document load event fires completely
    context.page.wait_for_load_state("load")


# --- VIEWPORT RESIZING STEPS ---

@given('the browser viewport is resized to "{width}" by "{height}"')
def step_impl(context, width, height):
    # Convert parameters to integers and set size
    context.page.set_viewport_size({"width": int(width), "height": int(height)})

@when('the page is reloaded')
def step_impl(context):
    context.page.reload()


# --- INITIAL LAYOUT ASSERTIONS ---

@then('the live preview screen should be visible at the top')
def step_impl(context):
    # Adjust css selectors (#live-preview, .toolbar) to match your app DOM
    expect(context.page.locator("#live-preview")).to_be_visible()

@then('the text formatting toolbar should be visible')
def step_impl(context):
    expect(context.page.locator(".text-toolbar")).to_be_visible()

@then('the shared presentation action bar should be displayed')
def step_impl(context):
    expect(context.page.locator("#action-bar")).to_be_visible()

@then('the presentation input box should be visible')
def step_impl(context):
    expect(context.page.locator("#input-box")).to_be_visible()

@then('there should be no unexpected horizontal scrollbar on the viewport')
def step_impl(context):
    # Check that scroll width does not exceed viewable client width
    is_scrollable = context.page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth")
    assert not is_scrollable, "Horizontal scrollbar detected on viewport!"
