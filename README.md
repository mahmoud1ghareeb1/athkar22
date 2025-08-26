# Athkari - Islamic App

A comprehensive Islamic application featuring the Holy Quran, Athkar (supplications), an electronic Masbaha (Tasbeeh counter), and other tools to assist in daily worship.

## Features

*   **Holy Quran:** Read the Quran page by page, search for ayahs, bookmark your favorite verses, and track your reading progress.
*   **Athkar:** Access a wide range of supplications for various occasions, including morning, evening, and post-prayer athkar.
*   **Tasbeeh Counter:** An electronic masbaha to help you keep track of your tasbeeh.
*   **Qibla Compass:** Find the direction of the Qibla from your current location.
*   **Prayer Times:** Get accurate prayer times based on your location.
*   **And more:** Asma-ul-Husna, daily content, habit tracker, etc.

## PWA (Progressive Web App)

This application is a PWA, which means:
*   **Installable:** You can add it to your home screen on your mobile device for a native-app-like experience.
*   **Offline Access:** Most features (excluding Quran audio and text fetching) are available offline.

## Running Locally

1.  Place the project files in a directory on your local machine.
2.  Serve the root directory using a simple local web server. For example, using Python:
    ```bash
    python -m http.server
    ```
    Or using Node.js `serve` package:
    ```bash
    npx serve .
    ```
3.  Open your browser to the local server address.

## API Key

This application uses the Gemini API for certain features. You will need to provide your own API key. Set the `API_KEY` environment variable in your deployment environment. The application is configured to read this key directly.

---
Built with React, TypeScript, and Tailwind CSS.