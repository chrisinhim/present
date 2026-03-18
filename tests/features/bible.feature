Feature: Bible Department
  As a church media operator
  I want to quickly find and present scripture
  So that the congregation can follow along with the sermon

  Background:
    Given the Church Display Console is open
    And I am on the "Bible" tab

  Scenario: Fast scripture lookup via book abbreviations
    When I look at the Old Testament selection grid
    Then I should see book buttons with 3-letter abbreviations like "GEN", "EXO", "LEV"
    And "GEN", "EXO", "LEV" should be grouped by the same color representing the "Law" genre

  Scenario: Selecting a specific verse grid
    When I click on the book button "GEN"
    And I select chapter "3"
    Then I should see a grid of verses for Genesis chapter 3
    And verse "3" should be available for selection

  Scenario: Presenting a single verse (Reference vs Verse Text)
    Given I have selected "GEN" chapter "3" and verse "3"
    When I click "Present Reference Only"
    Then the presentation window should display "GEN 3:3"
    When I click "Present Verse Text"
    Then the presentation window should display the actual text of "GEN 3:3"

  Scenario: Range selection and presentation (Reference vs Verse Text)
    Given I have selected "GEN" chapter "3"
    When I click and drag from verse "3" to verse "8"
    And I click "Present Verse Text"
    Then the presentation window should display the text of verses 3 through 8
    And the preview area should show "GEN 3:3-8"
    When I click "Present Reference Only"
    Then the presentation window should display "GEN 3:3-8"

  Scenario: Show scripture using manual input box
    When I type "Joshua 5:118" into the scripture input box
    And I press "Enter"
    Then the presentation window should display the content for "JOS 5:118"

  Scenario: Clearing the presentation
    When I click "Clear Presentation"
    Then the presentation window should be empty
