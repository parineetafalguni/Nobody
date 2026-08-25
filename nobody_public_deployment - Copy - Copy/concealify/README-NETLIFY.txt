# Nobody deployment note

The frontend is in index.html and the API is in backend/.

For local testing:
1. cd backend
2. npm install
3. copy .env.example to .env
4. npm start
5. serve the project folder with a local web server.

The frontend defaults to http://localhost:4000.
For a deployed API, change `API_BASE` in the integration script or define
`window.NOBODY_API_URL` before it loads.

For real email OTP, configure SMTP in backend/.env.
