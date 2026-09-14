Feature: Presentation controller workflows
  The controller should present content consistently across all input modes.

  Background:
    Given the user navigates to the presentation controller application
    And the page finishes loading

  Scenario: TEXT supports formatting, position controls, presentation and history
    When the user opens the "TEXT" tab
    And the user enters "Text workflow coverage"
    And the user exercises all formatting controls
    And the user exercises all position controls
    And the user presents the current content
    Then the presentation should be active
    And the "TEXT" history should contain the presented item
    When the user replays the first history item
    Then the presentation should be active
    When the user clears the current tab history
    Then the "TEXT" history should be empty

  Scenario: VERSE QUOTE supports formatting, position controls, presentation and history
    When the user opens the "VERSE" tab
    And the user selects book "John" and chapter "3"
    And the user selects Bible verse "16"
    And the user selects verse mode "QUOTE"
    And the user exercises all formatting controls
    And the user exercises all position controls
    And the user presents the current content
    Then the presentation should be active
    And the "VERSE" history should contain the presented item
    When the user replays the first history item
    Then the presentation should be active
    When the user clears the current tab history
    Then the "VERSE" history should be empty

  Scenario: VERSE REFER supports formatting, position controls, presentation and history
    When the user opens the "VERSE" tab
    And the user selects book "John" and chapter "3"
    And the user selects Bible verse "16"
    And the user selects verse mode "REFER"
    And the user exercises all formatting controls
    And the user exercises all position controls
    And the user presents the current content
    Then the presentation should be active
    And the "VERSE" history should contain the presented item
    When the user replays the first history item
    Then the presentation should be active
    When the user clears the current tab history
    Then the "VERSE" history should be empty

  Scenario: TIMER Time Now supports formatting, position controls, presentation and history
    When the user opens the "TIMER" tab
    And the user selects timer mode "Time Now"
    And the user exercises all formatting controls
    And the user exercises all position controls
    And the user presents the current content
    Then the presentation should be active
    And the "TIMER" history should contain the presented item
    When the user replays the first history item
    Then the presentation should be active
    When the user clears the current tab history
    Then the "TIMER" history should be empty

  Scenario: TIMER Countdown supports formatting, position controls, presentation and history
    When the user opens the "TIMER" tab
    And the user selects timer mode "Countdown"
    And the user sets the countdown target to a future time
    And the user exercises all formatting controls
    And the user exercises all position controls
    And the user presents the current content
    Then the presentation should be active
    And the "TIMER" history should contain the presented item
    When the user replays the first history item
    Then the presentation should be active
    When the user clears the current tab history
    Then the "TIMER" history should be empty

  Scenario: TIMER Pomodoro supports formatting, position controls, presentation and history
    When the user opens the "TIMER" tab
    And the user selects timer mode "Pomodoro"
    And the user sets the pomodoro duration to "00:02"
    And the user exercises all formatting controls
    And the user exercises all position controls
    And the user presents the current content
    Then the presentation should be active
    And the "TIMER" history should contain the presented item
    When the user replays the first history item
    Then the presentation should be active
    When the user clears the current tab history
    Then the "TIMER" history should be empty

  Scenario: LYRICS paste supports formatting, position controls, and presentation
    When the user opens the "LYRICS" tab
    And the user pastes a two-stanza song
    And the user selects the first lyric stanza
    And the user exercises all formatting controls
    And the user exercises all position controls
    And the user presents the current content
    Then the presentation should be active

  Scenario: LYRICS text-file browsing supports formatting, position controls, and presentation
    When the user opens the "LYRICS" tab
    And the user browses a two-stanza text file
    And the user selects the first lyric stanza
    And the user exercises all formatting controls
    And the user exercises all position controls
    And the user presents the current content
    Then the presentation should be active

  Scenario Outline: The controller remains usable at common viewport sizes
    Given the browser viewport is resized to "<width>" by "<height>"
    When the page is reloaded
    Then the formatting toolbar should fit within the viewport
    And the page should have no unexpected horizontal overflow

    Examples:
      | width | height |
      | 1920  | 1080   |
      | 1366  | 768    |
      | 1024  | 768    |
      | 768   | 1024   |
