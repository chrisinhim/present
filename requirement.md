### **Presentation Controller: Software Requirements Specification**

**Version 1.2**

---

### **1. Introduction**

#### **1.1 Purpose**

This document outlines the functional and non-functional requirements for the "Presentation Controller" web application. The application serves as a control panel to manage and display content on a separate, secondary "Presentation Window."

#### **1.2 Scope**

The Presentation Controller allows a user to input text, customize its appearance and position, control the background of the presentation, and manage a history of presented content. All settings are persistent across sessions, and can be saved to and loaded from files.

#### **1.3 Target Audience**

The primary users are presenters, such as clergy, speakers, or educators, who need a simple yet powerful tool to display text, like Bible verses or talking points, on a secondary screen during a live event.

---

### **2. Functional Requirements**

#### **2.1 Core Presentation Controls**

*   **FR-01 (Text Input):** The system shall provide a text area for the user to input the content to be displayed.
*   **FR-02 (Present Button):** A "PRESENT" button shall send the text from the input area to the Presentation Window.
    *   **FR-02.1:** If the Presentation Window is not open, clicking "PRESENT" shall open it and display the text.
    *   **FR-02.2:** If the text input is empty, the system shall display an alert ("Please enter some text to show on the screen") and prevent the presentation action.
    *   **FR-02.3 (Shortcut):** Pressing the `Enter` key while the text input area is focused shall trigger the "PRESENT" action.
*   **FR-03 (Hide Button):** A "HIDE" button shall conceal the text content on the Presentation Window without closing the window.
*   **FR-04 (Visible Duration):** The user shall be able to specify a duration in seconds for the text to be displayed. After the duration elapses, the text shall automatically hide. This timer resets on every "PRESENT" action.
*   **FR-05 (Hold Button):** The system shall provide a "Hold" button that pauses the auto-hide countdown timer. Pressing it again resumes the countdown.
*   **FR-06 (Seek Bar):** The system shall display a seek bar (e.g., a red line) below the text box that visually represents the auto-hide duration.
    *   **FR-06.1:** The seek bar shall include a play/pause button.
    *   **FR-06.2:** When content is presented, the seek bar shall begin to fill, completing its track in the number of seconds specified in the duration.

#### **2.2 Presentation Window Management**

*   **FR-07:** The system shall provide a toggle button to manually open and close the Presentation Window.
*   **FR-08:** The system shall display the current status of the Presentation Window (e.g., "Open" or "Closed").
*   **FR-09:** If the browser blocks the pop-up window, the system shall alert the user.

#### **2.3 Content Styling & Formatting**

*   **FR-10 (Font Customization):** The user shall be able to customize the presented text's font.
    *   **FR-10.1 (Family):** Select from a predefined list of font families.
    *   **FR-10.2 (Size):** Set the font size, preferably using viewport units (vw).
    *   **FR-10.3 (Color):** Set a solid font color using a color picker.
    *   **FR-10.4 (Gradient):** Apply a color gradient to the text.
*   **FR-11 (Font Style):** The user shall be able to apply text styles: **Bold**, *Italic*, Underline, ALL CAPS, and all small. These styles can be combined.

#### **2.4 Animation Effects**

*   **FR-12 (Entry Animation):** The user shall be able to select an entry animation for the text from a list including:
    *   None
    *   Fade In
    *   Slide (from left, from right, from top, from bottom)
    *   Expand (horizontally, vertically, right, left, up, down)
*   **FR-13 (Exit Animation):** The user shall be able to select an exit animation for when the text is hidden, from a list including:
    *   None
    *   Fade Out
    *   Slide (to left, to right, to top, to bottom)
    *   Contract (horizontally, vertically, right, left, up, down)

#### **2.5 Background Customization**

*   **FR-14 (Presentation Background):** The user shall be able to set the background of the main Presentation Window to a solid color, an image file, or a looping video file.
*   **FR-15 (Text Background):** A toggle button shall enable/disable a separate background for the text content block itself.
    *   **FR-15.1 (Type):** The background can be a solid color, a "box" shape, a "text line," or a picture (including transparent PNGs/GIFs).
    *   **FR-15.2 (Color):** The user can set the background color for the "box" or "text line" type.
    *   **FR-15.3 (Sizing):** The user shall control the size of the text background.
        *   **FR-15.3.1:** For a "picture" background, the user can control its size.
        *   **FR-15.3.2:** For a "text line" background, the user can control its width as a percentage.
        *   **FR-15.3.3:** For a "box" background, the user can control its width and height as a percentage.
    *   **FR-15.4 (Decoration):** For a "box" background, the user shall be able to control the corner radius.
    *   **FR-15.5 (Picture Selection):** When the "picture" text background type is selected, the user shall be provided with an option to browse and select an image file.

#### **2.6 Positioning and Alignment**

*   **FR-16 (Alignment):** The user shall be able to align the text block horizontally (Left, Center, Right) and vertically (Top, Middle, Bottom).
*   **FR-17 (Fine Position Adjustment):** The user shall be able to apply fine position adjustments (e.g., from -50px to +50px) horizontally and vertically using sliders.
    *   **FR-17.1:** The adjustment sliders shall be constrained relative to the main alignment selection to prevent over-correction (e.g., the 'center' slider can only move the text to the mid-point between 'center' and 'left'/'right').

*   **FR-17.2 (Horizontal Adjustment):** The horizontal slider's range shall be relative to the selected horizontal alignment (Left, Center, Right).
    *   **FR-17.2.1:** When 'Left' is selected, the slider adjusts the text only up to the midpoint between the 'Left' and 'Center' positions.
    *   **FR-17.2.2:** When 'Center' is selected, the slider adjusts the text between the midpoint of 'Left'/'Center' and the midpoint of 'Center'/'Right'.
    *   **FR-17.2.3:** When 'Right' is selected, the slider adjusts the text only up to the midpoint between the 'Right' and 'Center' positions.
*   **FR-17.3 (Vertical Adjustment):** The vertical slider's range shall be relative to the selected vertical alignment (Top, Middle, Bottom).
    *   **FR-17.3.1:** When 'Top' is selected, the slider adjusts the text only up to the midpoint between the 'Top' and 'Middle' positions.
    *   **FR-17.3.2:** When 'Middle' is selected, the slider adjusts the text between the midpoint of 'Top'/'Middle' and the midpoint of 'Middle'/'Bottom'.
    *   **FR-17.3.3:** When 'Bottom' is selected, the slider adjusts the text only up to the midpoint between the 'Bottom' and 'Middle' positions.

#### **2.7 Input Assistance & History**

*   **FR-18 (Autocomplete):** As the user types, the system shall suggest a list of matching Bible book names.
    *   **FR-18.1:** The user can select a suggestion with the mouse or keyboard (Arrow keys + Enter/Tab/Space).
    *   **FR-18.2:** If no suggestion is highlighted, pressing Tab or Space shall select the first suggestion.
*   **FR-19 (History):** The system shall maintain a list of previously presented text items.
    *   **FR-19.1:** Each history item shall be displayed as a line item containing the text.
    *   **FR-19.2:** Each item shall have a button at the beginning of the line to delete that specific history item.
    *   **FR-19.3:** Each item shall have a "Present" button at the end of the line to re-present its associated text.
    *   **FR-19.4:** A "Clear All" button shall allow the user to delete the entire history. This button shall be inactive if there is no history.

#### **2.8 Preview**

*   **FR-20 (Live Preview):** The system shall display a preview of the formatted text at the top of the controller page.

#### **2.9 Design Management**

*   **FR-21 (Save Design):** The system shall provide a "Save Design" button that packages all current settings into a file and downloads it for the user.
*   **FR-22 (Load Design):** The system shall provide a "Load Design" button that allows a user to select and upload a previously saved design file, which will restore all settings to the state within that file.

---

### **3. Non-Functional Requirements**

#### **3.1 Usability**

*   **NFR-01:** The user interface shall be organized into logical tabs (e.g., Content, Backgrounds, Positioning) for ease of use.
*   **NFR-02:** All interactive controls shall provide clear visual feedback (e.g., an "active" state).
*   **NFR-03 (Keyboard Shortcuts):**
    *   Pressing `Enter` in the text area shall trigger the "PRESENT" action.
    *   Pressing `Escape` shall trigger the "HIDE" action.

#### **3.2 Persistence**

*   **NFR-04 (Auto-Save):** All user-configured settings, including text, styles, positions, backgrounds, and history, shall be automatically saved to the browser's `localStorage` to persist across sessions.
*   **NFR-05 (Auto-Load):** When the application is re-opened, all saved settings shall be automatically loaded and applied.

#### **3.3 Performance**

*   **NFR-06:** UI updates and saving operations shall be debounced to prevent performance degradation from rapid user input.
*   **NFR-07:** Animations in the Presentation Window shall be smooth and performant.

#### **3.4 Compatibility**

*   **NFR-08:** The application shall be compatible with modern web browsers (e.g., Chrome, Firefox, Safari, Edge) that support HTML5, CSS3, and modern JavaScript (ES6+).
