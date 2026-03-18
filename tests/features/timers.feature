Feature: Timers Department
  As a church media operator
  I want to display countdowns and clocks
  So that the service segments stay on schedule

  Background:
    Given the Church Display Console is open
    And I am on the "Timer" tab

  Scenario: Countdown to a specific target time
    When I set the target time to "10:30 AM"
    And I click "Start"
    Then the presentation window should show a countdown to 10:30 AM
    And the timer should update every second

  Scenario: Using the spacebar to control timers
    Given a "5:00" duration timer is running
    When I press the "SPACEBAR" keyboard shortcut
    Then the timer should pause
    When I press "SPACEBAR" again
    Then the timer should resume counting down

  Scenario: Timer completion action: Play Media
    Given a timer is set to expire in "10" seconds
    And the zero-action is set to "Play Media: alert.mp3"
    When the timer reaches "0:00"
    Then the "alert.mp3" file should start playing
    And the timer should be removed from the presentation display
