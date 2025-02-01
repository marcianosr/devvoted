# DevVoted

A web development-themed poll app with a fun, competitive twist! Answer daily polls about web development, earn points, and compete with others in seasonal leaderboards.

## Tech Stack

-   Next.js 15
-   TypeScript
-   Supabase + Postgres
-   Tailwind CSS
-   Vitest & React Testing Library
-   Playwright for E2E tests
-   Yarn PnP

## Prerequisites

-   Node.js 20.x or higher
-   Yarn (PnP)
-   Supabase CLI
-   Docker (for running the Supabase Emulators)

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

3. Set up Supabase locally:

    - Go to [Supabase: Installing CLI](https://supabase.com/docs/guides/local-development/cli/getting-started?queryGroups=platform&platform=macos) and follow the steps
    - If successfull, the given urls should be printed in the terminal, and you can navigate to the studio at http://127.0.0.1:54323

    ```
         API URL: http://127.0.0.1:54321
     GraphQL URL: http://127.0.0.1:54321/graphql/v1
    S3 Storage URL: http://127.0.0.1:54321/storage/v1/s3
          DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
      Studio URL: http://127.0.0.1:54323
    Inbucket URL: http://127.0.0.1:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: xxxx
        service_role key: xxxx
        S3 Access Key: xxx
        S3 Secret Key: xxx
        S3 Region: local
    ```

    Stop Supabase with `supabase stop`

4. Seeding

5. Run the development server:

    ```bash
    yarn dev
    ```

6. Open [http://localhost:3000](http://localhost:3000) to view the app.

## Development

### Testing

-   Run unit tests: `yarn test`

### Project Structure

...

## Contributing

...

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
