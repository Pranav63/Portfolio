## Overview

This repository contains the source code for my personal portfolio website, showcasing my skills and experience in Data Science, AI, Machine Learning, and tinkering with web technologies. The website serves as a comprehensive online presence, highlighting my projects, work experience, and technical abilities.

## Features

- **Homepage**: A concise introduction, visual project previews, background summary, field notes, and contact.
- **About** (`/about`): Career history, education, portrait, and capabilities linked to project evidence.
- **Case studies** (`/work/[slug]`): Dedicated project pages with architecture, screenshots, results, limitations, and next-project navigation.
- **Recorded comparison** (`/work/qlora`): Four saved base-versus-fine-tuned outputs with prompt selection and metric highlighting. No inference service or API key is needed.
- **Writing** (`/writing`): Technical notes linked to the underlying project evidence.
- **Contact**: A form for visitors to get in touch with me directly.

## Technology Stack

- **Frontend**: React.js with Next.js for server-side rendering and routing
- **Styling**: CSS design tokens, responsive layouts, and accessible native navigation
- **3D Graphics**: Three.js for interactive 3D elements
- **Animation**: Framer Motion for smooth, physics-based animations
- **Deployment**: Vercel

## Getting Started

To run this project locally, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/[YourUsername]/portfolio-website.git
   ```

2. Navigate to the project directory:
   ```
   cd portfolio-website
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the website.

## Project Structure

- `/public`: Static assets including images and fonts
- `/src`: Source code
  - `/components`: Reusable React components
  - `/app`: Next.js App Router pages, metadata, and the contact API
  - `/styles`: Global styles and theme configuration
  - `/lib`: Utility functions and configurations

## Content maintenance

- `src/data/portfolio.js`: career and project facts.
- `src/data/caseStudies.js`: case-study context, status, and metric qualifications.
- `src/data/writing.js`: three editorial notes expanded from the original Field Notes. Review the wording before publishing.
- `src/data/qlora-comparisons.json`: verbatim copy of `qlora-multilingual-finetuning/eval/comparison_results.json`. Update from that source when the experiment changes; the viewer calculates ratios using its benchmark rule.
- `public/pranav-portrait.png`: existing portrait reused from `archive/images/pranav_pho.png`.

Case studies and articles have individual canonical URLs and share metadata. The sitemap includes all published routes.

## Motion and interaction

- Between Selected Work and About, a four-chapter scroll journey moves from Singapore through a star trail to Abu Dhabi, then opens onto a stylized Abu Dhabi/Dubai panorama. Original procedural geometry includes the Marina Bay Sands SkyPark and infinity pool, planted Supertrees and skyway, ribbed conservatories, sculpted Etihad Towers, a Grand Mosque interpretation, Burj Khalifa, Burj Al Arab, and Dubai Frame. This is an artistic landmark composition, not a geographically accurate map or a claim of work experience in Dubai. Waterfront reflections use a capped render target (768px desktop, 256px mobile); the mobile camera pans toward Dubai for readable silhouettes. Native scrolling, skip navigation, static illustrated reduced-motion/WebGL fallbacks, lazy loading, and offscreen rendering suspension are retained. No external models, photos, or dependencies are added.
- A shared background runs across the homepage, About, writing, articles, and project case studies. The hero's brain-shaped neural constellation has two folded hemispheres, a central cleft, and a tapered stem, with no circular backdrop. Scrolling disperses it into stars, streaks, and fragments; reversing the scroll reassembles it. Beyond the hero and on other routes, a quieter star field drifts behind the content with scroll parallax. There is no scroll hijacking or pinned section.
- Background motion runs automatically without a pause/resume button, and rendering stops in hidden tabs. Phones use fewer particles and lower pixel density; reduced motion, low-powered devices, and unavailable/lost WebGL use a still brain on the hero and a still star field elsewhere. No new dependencies or video assets are required.
- Project preview links and the case-study back link intentionally use native navigation for cross-document View Transitions. Matching screenshot names animate the selected image into the case-study cover in supporting browsers; other browsers navigate normally. Reduced-motion settings disable that transition.
- Case-study workflow stages are selectable, screenshot viewers use shared-element motion, and recorded QLoRA outputs briefly highlight when the prompt changes.

## Contact Form

The contact form uses an email API to send messages directly to my Gmail account. Ensure you have set up the necessary environment variables for the email service to function correctly.

## Deployment

This project is set up for easy deployment on platforms like Vercel or Netlify. Follow the platform-specific instructions for deploying a Next.js application.

## Contributing

While this is a personal portfolio website, I'm open to suggestions and improvements. Feel free to open an issue or submit a pull request if you have any ideas or find any bugs.

## License

MIT License

---

Created with ❤️ by Pranav Arora
