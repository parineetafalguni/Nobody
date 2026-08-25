PUBLIC DEPLOYMENT
1. Create a PostgreSQL database.
2. Create a Cloudinary account.
3. Deploy backend/ to a Node hosting service such as Render.
4. Add DATABASE_URL, SMTP_*, EMAIL_FROM and CLOUDINARY_* environment variables.
5. Set the frontend API_BASE to the backend public URL.
6. Deploy the project root to Netlify.
7. Test signup/OTP, two-user feed, image upload and replies.
Never commit .env or credentials.
