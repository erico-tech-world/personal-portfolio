<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your Portfolio web app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`

2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) if you integrate any AI chatbot or agent in the web app
Set up environment variables:
       * Create a .env.local file in the root of the project.
       * Add your Supabase and Cloudinary credentials to this file:
           * NEXT_PUBLIC_SUPABASE_URL
           * NEXT_PUBLIC_SUPABASE_ANON_KEY
           * NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
           * CLOUDINARY_API_KEY
           * CLOUDINARY_API_SECRET

3. Run the app:
   `npm run dev`

4. Set up the database:
       * Execute the supabase_setup.sql script in your Supabase project to create and set the
         necessary tables (site_content, gallery_items, contacts).

5. Run the development server (Run the app):
    `npm run dev`
    
  # This will start the development server, and you can view the application at http://localhost:3000.
  