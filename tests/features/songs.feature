Feature: Songs Department
  As a worship leader's assistant
  I want to manage and project song lyrics instantly
  So that the congregation can participate in worship

  Background:
    Given the Church Display Console is open
    And I am on the "Songs" tab

  Scenario: Instant file loading
    When I drag a song file "WayMaker.txt" into the drop zone
    Then I should instantly see the song list updated with "Way Maker"
    And the verses and choruses should be parsed and visible in the preview area

  Scenario: Navigating slides with arrow keys
    Given "Way Maker" is being presented
    And the current slide is "Verse 1"
    When I press the "RIGHT ARROW" or "DOWN ARROW" key
    Then the presentation should advance to "Chorus 1"
    When I press the "LEFT ARROW" or "UP ARROW" key
    Then the presentation should return to "Verse 1"

  Scenario: Sequencing song parts
    When I load a song with multiple verses and one chorus
    And I define the sequence "v1 c1 v2 c1 b1 c1"
    Then the slide navigation should follow the defined sequence order
    And the "Next" action should respect the sequence map
