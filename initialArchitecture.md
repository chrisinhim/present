# Presentation Controller Architecture

Let us completely restructure this app.
options like typography, color Mode, text effects, emphasis, animations, background and position will be used for displaying all the text related content like timers, bible verses, bible references, and some custom text. So we need to place these option in a place which is always accessible.

## This app will have 4 departments

- These departments will be in a tab layout at the top of the app below the formatting options panel.
- These departments will have their own history of the previously displayed content.
- These departments will have their own options to select the content to be displayed in the presentation. Each history item will have a delete button and a present button.
- When the user clicks on the delete button, the history item will be deleted from the history.
- When the user clicks on the present button, the history item will be added to the presentation with the text formatting and other options selected at the top.

### Bible

Here we will have quick options to select bible books, chapters, verses and references.

- 66 buttons for bible books.
  - These buttons will be divided into two groups of colors: Old Testament and New Testament.
  - These two groups will further be divided into their own gropups as follows:
    - Old Testament:
      - Law
      - History
      - Poetry
      - Major Prophets
      - Minor Prophets
    - New Testament:
      - Gospels
      - History
      - Pauline Epistles
      - General Epistles
      - Revelation
  - These buttons will be in a very compact layout.
- buttons for chapters. The number of buttons will be based on the number of chapters in the selected book.
- buttons for verses. The number of buttons will be based on the number of verses in the selected chapter.
  - verses will be displayed in a grid layout.
  - user will be able to click on any verse to select it.
  - user will be able to click and drag over few verses to select a range of verses
- After the user selects the reference, there will be two buttons
  - one to show the reference in the presentation
  - one to show the verses text in the presentation
- There will also be a text box to add custom text with a present button to add it to the presentation.
- When the user clicks on the Present Reference button, the reference will be added to the presentation with the text formatting and other options selected at the top.
- When the user clicks on the Present Verses button, the verses will be added to the presentation with the text formatting and other options selected at the top.
- When the user clicks on the Present Text button, the text will be added to the presentation with the text formatting and other options selected at the top.
- Along with the Present buttons, there will be a remove button and a duration input field.
  - remove button will remove the last added item from the presentation.
  - duration input field will set the duration for which the last added item will be displayed in the presentation.
  - a seek bar to seek through the duration of the last added item.

### Media

- Media section will have options to select media files (pictures and videos) to be displayed in the presentation.
- There will be a browse button to browse for media files.
- When the user clicks on the browse button, a file explorer will open to select media files.
- The selected media files will be displayed in the preview area.
- There will be a present button to add the selected media files to the presentation in full screen.
- When the user clicks on the present button, the media files will be added to the presentation.
- There will be a remove button to remove the content from the presentation window.

### Timers

- When the user clicks on the Present Reference button, the reference will be added to the presentation with the text formatting and other options selected at the top.
- When the user clicks on the Present Verses button, the verses will be added to the presentation with the text formatting and other options selected at the top.
- When the user clicks on the Present Text button, the text will be added to the presentation with the text formatting and other options selected at the top.

- Under Timers department, there will be 3 types of timers:

#### 1. Count Down Timer to a specific time

- This will be a Time Picker to select the time with a present button and a remove button.
- When the user clicks on the present button, the timer will be added to the presentation.
- When the user clicks on the remove button, the timer will be removed from the presentation.
- There will be an option to select what happens when the timer reaches zero. Options will be:
  - Stop and remove the timer from the presentation
  - Play media file (audio or video or picture)
  - Continue the timer with a minus sign (-)
  
#### 2. Count Down Timer for a specific duration

- This will be a Duration Picker (with hours, minutes and seconds) to select the duration with a present button and a remove button.
- When the user clicks on the present button, the timer will be added to the presentation.
- When the user clicks on the remove button, the timer will be removed from the presentation.
- There will be an option to select what happens when the timer reaches zero. Options will be:
  - Stop and remove the timer from the presentation
  - Play media file (audio or video or picture)

#### 3. Realtime Timer

- This will be a Realtime Timer with a present button and a remove button.
- When the user clicks on the present button, the timer will be added to the presentation.
- When the user clicks on the remove button, the timer will be removed from the presentation.

### Songs

- Songs department will have options to select songs to be displayed in the presentation.
- There will be a browse button to browse for songs file(s).
- When the user clicks on the browse button, a file explorer will open to select songs files.
- Code will read the song files and identify the verses and choruses based on the song format. If the song format is not recognized, the paragraphs will be identified based on the blank lines.
- The selected songs files will be displayed in the preview area in the form of clickable paragraphs.
- When the user clicks on any paragraph, the song will be added to the presentation.
- There will be an edit button on each paragraph to edit then and there and save the song file.
- There will be a remove button to remove the song from the presentation.

- When the user clicks on the Present button, the song will be added to the presentation with the text formatting and other options selected at the top.
- When the user clicks on the Present Verses button, the verses will be added to the presentation with the text formatting and other options selected at the top.
- When the user clicks on the Present Text button, the text will be added to the presentation with the text formatting and other options selected at the top.

#### Song format

- Song format will be as follows:
  - Song Title
  - Verse 1
  - Chorus 1
  - Chorus 2
  - Verse 2
  - Verse 3
  - Bridge 1
  - Outro 1
  - sequence of verses and choruses in the form of v1 c1 v2 c2 v3 b1 o1
  