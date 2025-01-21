# DevVoted

A web development-themed poll app with a fun, competitive twist! Answer daily polls about web development, earn points, and compete with others in seasonal leaderboards.

## Tech Stack

-   Next.js 15
-   TypeScript
-   Firebase (Auth & Firestore)
-   Tailwind CSS
-   Vitest & React Testing Library
-   Playwright for E2E tests
-   Yarn PnP

## Prerequisites

-   Node.js 20.x or higher
-   Yarn (PnP)
-   Firebase CLI (`npm install -g firebase-tools`)

## Getting Started

1. Clone the repository:

    ```bash
    git clone https://github.com/marcianosr/devvoted.git
    cd devvoted
    ```

2. Install dependencies:

    ```bash
    yarn install
    ```

3. Set up Firebase:

    - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
    - Enable Authentication (Google provider) and Firestore
    - Create a `.env.local` file with your Firebase config:
        ```env
        NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
        NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
        NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
        ```

4. Start Firebase Emulators:

    ```bash
    firebase emulators:start
    ```

5. Seed the database (see firebase emulators for setup):

    ```bash
    yarn seed
    ```

    This will populate your local Firestore emulator with sample polls and users.

6. Run the development server:

    ```bash
    yarn dev
    ```

7. Open [http://localhost:3000](http://localhost:3000) to view the app.

## Development

### Firebase Emulators

The app uses Firebase emulators in development. Make sure to:

-   Obtain the firebase.local file
-   Run `firebase emulators:start` before starting development
-   Access the Firestore Emulator UI at [http://localhost:4000](http://localhost:4000)

### Testing

-   Run unit tests: `yarn test`

### Project Structure

...

## Contributing

...

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
