# Gadi Naga Babu — Digital Universe Portfolio

An immersive, responsive React portfolio built around a real-time 3D galaxy and interactive skill planets.

## Technology

- React 18 + Vite
- Three.js + React Three Fiber
- Drei (stars, sparkles, floating motion and 3D text)
- Framer Motion (scroll progress, reveal transitions and UI motion)
- Lucide React icons
- Custom GLSL planet surface shader
- CSS glassmorphism, responsive layout and 3D hover cards

## Run in VS Code

Requirements: Node.js 18.18+ (Node 20 LTS recommended) and npm.

1. Extract this ZIP.
2. Open the extracted `gadi-naga-babu-universe-portfolio` folder in VS Code.
3. Open **Terminal → New Terminal**.
4. Install packages:

   ```bash
   npm install
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL printed by Vite (usually `http://localhost:5173`).

Build and preview the production version:

```bash
npm run build
npm run preview
```

## GitHub Pages deployment

A GitHub Actions workflow is included at `.github/workflows/deploy.yml`.

1. Create a GitHub repository, for example `gadi-naga-babu-universe`.
2. Push all project files to its `main` branch.
3. In GitHub, open **Settings → Pages**.
4. Set **Build and deployment → Source** to **GitHub Actions**.
5. Push to `main` (or run the workflow manually from the Actions tab).
6. GitHub Pages publishes the built `dist` folder. The URL is usually `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.

Vite is configured with `base: './'` so project-subpath assets resolve correctly.

Alternative deployment using the included `gh-pages` script:

```bash
npm install
npm run deploy
```

Then choose **Deploy from a branch → gh-pages → / (root)** under Settings → Pages.

## Personalize before publishing

Edit `PROFILE`, `projects`, `education`, and `certificates` in `src/App.jsx`.

- The email, location, education and credentials are populated from the existing portfolio information. Verify every detail before publishing.
- GitHub and LinkedIn URLs are not known, so they are shown as clearly marked placeholders rather than invented links.
- Project cards are explicitly marked as current build / learning placeholders. Replace their descriptions, screenshots and repository URLs with real project details when available.
- The contact form uses `mailto:` to open the visitor's default email app with a prefilled message. It does not silently store or send data. For server-side form submission, connect a form backend such as Formspree or your own API.
- Replace `public/resume.pdf` with your latest resume if needed.

## Performance and accessibility

- The galaxy uses a bounded star count, capped device pixel ratio and lightweight procedural shader.
- Touch devices do not use the custom cursor or pointer tilt.
- Reduced-motion preferences disable most motion effects.
- Test `npm run build` and the production preview on a mid-range mobile device before publishing.
