Feature: Media Department
  As a church media operator
  I want to manage images and videos
  So that I can enhance the service atmosphere

  Background:
    Given the Church Display Console is open
    And I am on the "Media" tab

  Scenario: Loading multiple assets
    When I browse and select "worship_bg.mp4" and "announcement.png"
    Then I should see both files listed in the "Asset Library"
    And the asset list count should be "2"

  Scenario: Controlling video playback
    Given "worship_bg.mp4" is currently being presented
    When I click "Pause"
    Then the video in the presentation window should stop moving
    And the button label should change to "Play"

  Scenario: Using media as an overlay
    When I select "church_logo.png"
    And I enable "Overlay Mode"
    And I click "Show"
    Then the logo should appear on top of any existing text content
    And I should be able to resize it via the controller
