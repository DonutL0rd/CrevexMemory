# GEMINI.md

## Project Overview

This project is a "Memory Trainer" web application. It's a single-page, client-side application built with vanilla JavaScript, HTML5, and CSS3. The purpose of the app is to help users memorize text by providing an interactive practice and feedback loop.

The application allows users to:
1.  Paste any text they want to memorize.
2.  Split the text into sentences.
3.  Select specific sentences to study.
4.  Practice typing the selected text from memory.
5.  Receive detailed, color-coded feedback on their accuracy, including correct, incorrect, and missing words.

The architecture is simple and self-contained:
-   `index.html`: The main HTML file containing the structure of the application.
-   `style.css`: The stylesheet for the application, providing a modern dark theme.
-   `script.js`: The JavaScript file containing all the application logic.

There are no external dependencies or frameworks.

## Building and Running

This is a static web application with no build process.

### Running the Application

1.  Open the `index.html` file in any modern web browser.
2.  No server or internet connection is required for the application to run.

### Testing

There are no automated tests in this project. To test the application:
1.  Open `index.html` in a browser.
2.  Use the application's features to ensure they work as expected.

## Development Conventions

-   **Technology:** The project uses pure vanilla JavaScript, HTML, and CSS. No frameworks or libraries are used.
-   **File Structure:** Code is separated by concern into `index.html`, `style.css`, and `script.js`.
-   **Styling:** The project uses modern CSS features like Flexbox, Grid, and custom properties for theming. It has a responsive design.
-   **JavaScript:** The JavaScript is procedural and event-driven, with functions attached to DOM element events. It manipulates the DOM directly.
