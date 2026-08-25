# Nobody — fixed full-stack build

This version fixes the three major issues in the original prototype:

- Email + password signup now requires a 6-digit email OTP before the account is created.
- Images can be uploaded with posts (JPG/PNG/WEBP/GIF, max 5 MB).
- Public posts are stored server-side in a persistent JSON database and are visible to every signed-in user.
- Public replies are stored on the server and visible to other users.
- Private/Both response preferences are preserved.
- Passwords are stored using Node's `scrypt` password hashing.
- Session tokens are kept server-side.

## Run locally

1. Open a terminal inside `backend`.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Leave `EMAIL_MODE=console` for local testing. The OTP will appear in the backend terminal.
5. Run `npm start`.
6. Open the frontend `index.html` with a local web server (recommended), not by double-clicking the file.

The frontend is configured to call `http://localhost:4000`.

## Real email OTP

For real email delivery, set:

EMAIL_MODE=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-Gmail-App-Password
EMAIL_FROM=your-email@gmail.com

Do not put SMTP credentials in the frontend.

## Data

`data/database.json` is the persistent local database.
Uploaded images are stored in `uploads/`.

For public deployment, replace the JSON/file storage with a managed database and object storage because some hosting platforms use ephemeral filesystems.

## Important

The public feed intentionally exposes anonymous username, age range, join month, post text, image and responses — never the user's email.
