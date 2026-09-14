from datetime import datetime, timedelta
import os
import re

from behave import given, when, then
from playwright.sync_api import expect


FORMAT_CONTROL_TITLES = [
    'Increase font size',
    'Decrease font size',
    'Clear All Formatting',
    'Bold (Ctrl+B)',
    'Italic (Ctrl+I)',
    'Underline (Ctrl+U)',
    'Strikethrough',
    'Character Spacing (A↔V)',
    'Change Case (Aa)',
    'Text Highlight Color',
    'Increase line spacing',
    'Decrease line spacing',
    'Rotation and Flip Options',
    'Text Fill Color & Gradient',
    'Text Outline / Stroke',
    'Text Effects (Shadow & Glow)',
    'Presentation Background (Color, Gradient, Image, Video)',
    'Entry Animation',
    'Exit Animation',
]


def _tab(context, name):
    return context.page.get_by_role('button', name=name, exact=True)


def _history(context, tab):
    return context.page.locator('app-history-section').filter(has_text=tab)


def _close_open_overlays(context):
    context.page.keyboard.press('Escape')
    for selector in ['div.fixed.inset-0.z-40', 'div.fixed.inset-0.z-50']:
        overlay = context.page.locator(selector)
        if overlay.count() > 0 and overlay.first.is_visible():
            overlay.first.evaluate('(element) => element.click()')
    for selector in ['app-highlight-modal', 'app-background-modal', 'app-font-modal']:
        modal = context.page.locator(selector)
        if modal.count() > 0:
            modal.get_by_role('button').first.click(force=True)
            context.page.wait_for_timeout(100)


@given('the user navigates to the presentation controller application')
def navigate_to_app(context):
    context.page.goto(os.getenv('PRESENT_BASE_URL', 'http://127.0.0.1:4200') + '/#/')


@given('the page finishes loading')
def page_finishes_loading(context):
    context.page.wait_for_load_state('networkidle')
    expect(context.page.get_by_role('region', name='Formatting Toolbar')).to_be_visible()


@given('the browser viewport is resized to "{width}" by "{height}"')
def resize_viewport(context, width, height):
    context.page.set_viewport_size({'width': int(width), 'height': int(height)})


@when('the page is reloaded')
def reload_page(context):
    context.page.reload()
    context.page.wait_for_load_state('networkidle')


@then('the formatting toolbar should fit within the viewport')
def formatting_toolbar_should_fit(context):
    fits = context.page.get_by_role('region', name='Formatting Toolbar').evaluate(
        '(element) => element.getBoundingClientRect().right <= window.innerWidth'
    )
    assert fits, 'Formatting toolbar extends beyond the viewport'


@then('the page should have no unexpected horizontal overflow')
def page_should_have_no_horizontal_overflow(context):
    overflow = context.page.evaluate(
        'document.documentElement.scrollWidth > document.documentElement.clientWidth'
    )
    assert not overflow, 'Unexpected horizontal page overflow detected'


@when('the user opens the "{tab_name}" tab')
def open_tab(context, tab_name):
    _tab(context, tab_name).click()
    expect(context.page.get_by_role('region', name='Input Panels')).to_be_visible()


@when('the user enters "{text}"')
def enter_text(context, text):
    textarea = context.page.get_by_placeholder('Write any text ...')
    textarea.fill(text)


@when('the user exercises all formatting controls')
def exercise_formatting_controls(context):
    toolbar = context.page.get_by_role('region', name='Formatting Toolbar')
    for title in FORMAT_CONTROL_TITLES:
        control = toolbar.locator(f'[title="{title}"]').first
        expect(control, f'Missing formatting control: {title}').to_be_visible()
        control.click(force=True)

    # The font and line spacing controls are native inputs and are covered separately.
    expect(toolbar.locator('select').first).to_be_visible()
    expect(toolbar.locator('input[type="number"]').first).to_be_visible()


@when('the user exercises all position controls')
def exercise_position_controls(context):
    toolbar = context.page.get_by_role('region', name='Formatting Toolbar')
    for title in [
        'Top Left', 'Top Center', 'Top Right',
        'Middle Left', 'Middle Center', 'Middle Right',
        'Bottom Left', 'Bottom Center', 'Bottom Right',
    ]:
        control = toolbar.get_by_title(title)
        expect(control, f'Missing position control: {title}').to_be_visible()
        control.click(force=True)

    expect(toolbar.get_by_title('Vertical Alignment Adjustment (px)')).to_be_visible()
    expect(toolbar.get_by_title('Horizontal Alignment Adjustment (px)')).to_be_visible()

    for title in ['Nudge down', 'Nudge up', 'Nudge right', 'Nudge left']:
        toolbar.get_by_title(title).click(force=True)


@when('the user presents the current content')
def present_current_content(context):
    if context.page.locator('app-lyrics-panel').count():
        # Selecting a lyric stanza presents it immediately.
        return
    if context.page.locator('app-text-panel').count():
        present_button = context.page.locator('app-present-duration-controls').get_by_role('button').first
    elif context.page.locator('app-verse-panel').count():
        present_button = context.page.get_by_role('button', name='Present Verse', exact=True)
    else:
        present_button = context.page.get_by_role('button', name='Present Timer', exact=True)
    expect(present_button).to_be_enabled()
    present_button.click()


@then('the presentation should be active')
def presentation_should_be_active(context):
    expect(context.page.get_by_title('Hide Content (Esc)')).to_be_visible()
    if context.page.locator('app-lyrics-panel, app-verse-panel, app-timer-panel').count():
        return
    present_button = context.page.locator('app-present-duration-controls').get_by_role('button').first
    expect(present_button).to_have_attribute('title', re.compile(r'(Pause|Resume|Re-Present)'))


@then('the "{tab_name}" history should contain the presented item')
def history_should_contain_item(context, tab_name):
    history = context.page.locator('app-history-section').filter(has_text=tab_name)
    expect(history).to_be_visible()
    expect(history.get_by_title('Present this item').first).to_be_visible()


@when('the user replays the first history item')
def replay_first_history_item(context):
    context.page.get_by_title('Present this item').first.click(force=True)


@when('the user clears the current tab history')
def clear_current_tab_history(context):
    context.page.locator('app-history-section').get_by_role('button', name='Clear All').click(force=True)


@then('the "{tab_name}" history should be empty')
def history_should_be_empty(context, tab_name):
    history = context.page.locator('app-history-section').filter(has_text=f'No {tab_name} items presented yet')
    expect(history).to_be_visible()


@when('the user selects book "{book_name}" and chapter "{chapter}"')
def select_book_and_chapter(context, book_name, chapter):
    context.page.get_by_title(f'{book_name} Chapter {chapter}').click()


@when('the user selects Bible verse "{verse}"')
def select_verse(context, verse):
    book_name = 'John'
    chapter = '3'
    context.page.get_by_title(f'{book_name} {chapter}:{verse}').click()


@when('the user selects verse mode "QUOTE"')
def select_quote_mode(context):
    context.page.get_by_role('button', name='QUOTE', exact=True).click()


@when('the user selects verse mode "REFER"')
def select_refer_mode(context):
    context.page.get_by_role('button', name='REFER', exact=True).click()


@when('the user selects timer mode "{mode}"')
def select_timer_mode(context, mode):
    timer_buttons = context.page.locator('app-timer-panel').get_by_role('button')
    target = {'Time Now': 'Time Now', 'Countdown': 'Countdown', 'Pomodoro': 'Pomodoro'}[mode]
    timer_buttons.filter(has_text=target).first.click()


@when('the user sets the countdown target to a future time')
def set_countdown_target(context):
    future = datetime.now() + timedelta(hours=1)
    inputs = context.page.locator('app-timer-panel input[type="number"]')
    inputs.nth(0).fill(str(future.hour))
    inputs.nth(1).fill(str(future.minute))


@when('the user sets the pomodoro duration to "{duration}"')
def set_pomodoro_duration(context, duration):
    minutes, seconds = duration.split(':')
    inputs = context.page.locator('app-timer-panel input[type="number"]')
    inputs.nth(0).fill(minutes)
    inputs.nth(1).fill(seconds)


@when('the user pastes a two-stanza song')
def paste_two_stanza_song(context):
    panel = context.page.locator('app-lyrics-panel')
    panel.get_by_role('button', name='Paste Song Text').click()
    panel.locator('input[placeholder*="Amazing Grace"]').fill('Workflow Song')
    panel.get_by_placeholder('Paste your song text here...').fill(
        'Verse 1\nFirst lyric stanza\n\nChorus\nSecond lyric stanza'
    )
    panel.get_by_role('button', name='Done (Parse Paragraphs)').click()


@when('the user browses a two-stanza text file')
def browse_two_stanza_file(context):
    panel = context.page.locator('app-lyrics-panel')
    panel.locator('input[type="file"]').set_input_files({
        'name': 'workflow-song.txt',
        'mimeType': 'text/plain',
        'buffer': b'Verse 1\nFirst lyric stanza\n\nChorus\nSecond lyric stanza',
    })
    expect(panel.get_by_text('workflow-song', exact=True).first).to_be_visible()


@when('the user selects the first lyric stanza')
def select_first_lyric_stanza(context):
    panel = context.page.locator('app-lyrics-panel')
    panel.get_by_text('Verse 1', exact=True).last.click()


@then('the presentation view should contain {text}')
def presentation_view_should_contain(context, text):
    expect(context.page.get_by_text(text, exact=False)).to_be_visible()
