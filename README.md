# Lumiora

**Capture moments. Create memories.**

Lumiora is a modern, Korean-inspired web-based photo booth application designed to make capturing and personalizing memories fun, simple, and accessible.

With Lumiora, users can take photos directly from their browser, customize photo strips using filters, frames, and stickers, and download or share their creations—all without installing additional software.

## Overview

Lumiora aims to bring the charm of Korean-style photo booths into a digital experience. Featuring a clean interface, soft pastel aesthetics, and creative customization tools, the application allows users to create personalized photo strips anytime and anywhere.

The application is designed to be responsive, user-friendly, and accessible across desktop and mobile devices.

## Features

### Photo Booth
- Live camera preview
- Automatic photo capture with countdown
- Multiple photo strip layouts
- Photo retake functionality
- Front and rear camera support on compatible devices

### Photo Customization
- Aesthetic photo filters
- Customizable photo strip frames and backgrounds
- Stickers and decorative elements
- Personalized text and captions
- Real-time editing preview

### Gallery and Sharing
- Download photo strips as images
- Personal gallery for saved creations
- Share photos through generated links
- QR code sharing
- Optional user accounts for cloud storage

### User Experience
- Korean-inspired minimalist interface
- Soft pastel color palette
- Responsive design for desktop and mobile
- Simple and intuitive navigation
- Browser-based experience with no installation required

> **Development Note:** Lumiora is currently in the planning and design phase. The features listed above represent the intended functionality and may evolve during development.

## Technology Stack

The following technologies are currently planned for development.

| Technology | Purpose |
|---|---|
| React | Frontend development |
| TypeScript | Type-safe application development |
| Vite | Development and build tooling |
| Tailwind CSS | UI styling |
| HTML Canvas API | Photo processing and exporting |
| MediaDevices API | Camera access |
| Zustand | State management |
| Supabase | Authentication, database, and storage |
| Vercel | Deployment and hosting |
| Figma | UI/UX design and prototyping |

The technology stack may change as development progresses.

## How It Works

Lumiora follows a simple photo booth workflow:

1. **Start** — Open Lumiora and begin a photo booth session.
2. **Choose Layout** — Select a preferred photo strip arrangement.
3. **Capture** — Take photos using the device camera with a countdown timer.
4. **Customize** — Apply filters, select frames, and add stickers or text.
5. **Preview** — Review the completed photo strip.
6. **Save or Share** — Download the final image, save it to a personal gallery, or share it with others.

## Project Structure

The proposed project structure is:

```text
lumiora/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images, icons, and fonts
│   ├── components/         # Reusable UI components
│   ├── features/           # Feature-specific modules
│   ├── hooks/              # Custom React hooks
│   ├── layouts/            # Shared page layouts
│   ├── pages/              # Application pages
│   ├── services/           # External services and APIs
│   ├── store/              # Application state
│   ├── styles/             # Global styles
│   ├── types/              # TypeScript definitions
│   ├── App.tsx             # Root application component
│   └── main.tsx            # Application entry point
├── supabase/               # Backend configuration
├── package.json
├── README.md
└── vite.config.ts
```

*This structure is provisional and will be updated during development.*

## Getting Started

Local development instructions will be added once the project setup is finalized.

Planned requirements include:

- Node.js
- npm or another supported package manager
- A modern web browser
- A camera-enabled device for photo booth functionality

Camera access requires user permission and a secure browser context, such as HTTPS or localhost.

## Development Roadmap

### Phase 1 — Planning and Design
- [ ] Finalize application requirements
- [ ] Establish design system and branding
- [ ] Create UI/UX wireframes
- [ ] Design responsive application screens
- [ ] Build interactive prototypes

### Phase 2 — Core Development
- [ ] Initialize frontend project
- [ ] Implement application navigation
- [ ] Integrate camera functionality
- [ ] Build countdown and photo capture system
- [ ] Implement photo strip layouts

### Phase 3 — Customization
- [ ] Add photo filters
- [ ] Implement customizable frames
- [ ] Add stickers and decorative elements
- [ ] Build photo preview and editing functionality
- [ ] Implement image exporting and downloading

### Phase 4 — Gallery and Sharing
- [ ] Implement optional authentication
- [ ] Create personal photo gallery
- [ ] Integrate secure image storage
- [ ] Implement photo sharing links
- [ ] Add QR code sharing

### Phase 5 — Testing and Deployment
- [ ] Test mobile and desktop compatibility
- [ ] Improve performance and accessibility
- [ ] Review privacy and security
- [ ] Fix bugs and usability issues
- [ ] Deploy the application

## Privacy and Security

Lumiora aims to provide a privacy-conscious photo booth experience.

Photos will be processed locally whenever possible. Cloud storage and sharing will require explicit user action.

Planned privacy measures include secure photo storage, controlled gallery access, and options to remove saved content.

## Project Status

**Status:** Planning & Design

Lumiora is currently under development. Features, implementation details, and documentation are subject to change.

## Contributing

Lumiora is currently a personal development project.

Contribution guidelines may be introduced in the future.

## License

A license has not yet been selected.

Until a license is added, no permission to use, modify, or distribute the source code is granted by default.

---

**Lumiora** — A little space for your favorite moments.