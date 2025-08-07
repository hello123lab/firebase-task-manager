# Firebase Task Manager

A simple task manager app with Google sign-in and Firestore database.

## Setup and Deployment

1. Go to https://firebase.google.com and create a free account (or use Google Cloud Console).
2. Create a new Firebase project.
3. Enable Firestore database and Authentication > Sign-in method > Google.
4. Replace YOUR_API_KEY, YOUR_PROJECT_ID, and other Firebase config values in app.js with your project's config from Firebase console.
5. Install Firebase CLI: npm install -g firebase-tools
6. Login to Firebase CLI: firebase login
7. In the folder with your files, run: firebase init (select Hosting; use existing project and say NO to overwrite files)
8. Deploy: firebase deploy
9. Your app will be available at the deployment URL!

