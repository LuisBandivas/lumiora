# Lumiora

**Capture moments. Make them yours.**

Lumiora is a modern, web-based photo booth application that allows users to capture, customize, and share their favorite moments directly from their browser.

Designed with a clean, minimal, and intuitive interface, Lumiora provides a flexible creative experience where users can personalize their photos according to their unique style.

Whether it's a simple monochrome photo strip, a cute pastel-themed design, or a nostalgic vintage look, Lumiora gives users the freedom to express themselves through customizable layouts, filters, frames, stickers, and other creative tools.

## Design Philosophy

Lumiora follows three core design principles:

**Minimal by Design**

A modern, light-themed interface with clean typography, structured layouts, subtle details, and distraction-free navigation.

**Creative by Choice**

Users are free to personalize their photos using different styles, colors, effects, and decorations without being limited to a single aesthetic.

**Simple by Experience**

An accessible and intuitive photo booth experience that makes capturing, editing, downloading, and sharing photos effortless across devices.

## Features

### Photo Booth
- Category browsing and template previews
- Live camera preview
- Automatic photo capture with countdown
- Multiple photo strip layouts
- Single-photo and framed compositions
- Photo retake functionality
- Front and rear camera support on compatible devices

### Photo Customization
- Photo filters in varied styles
- Customizable photo strip frames and backgrounds
- Stickers and decorative elements
- Personalized text and captions
- Real-time editing preview

Local upload of existing photos is proposed; its first-release scope is still open.

### Gallery and Sharing
- Download photo strips as images
- Personal gallery for saved creations
- Share photos through generated links
- QR code sharing
- Optional user accounts for cloud storage

### User Experience
- Minimal, light-themed interface
- Flexible creative styles for photo output
- Responsive design for desktop and mobile
- Simple and intuitive navigation
- Browser-based experience with no installation required

> **Development Note:** A browser-only prototype implements selection, capture/upload, customization and PNG download. Release scope and visual design remain provisional. Gallery, sharing and accounts are future possibilities.

## Technology Stack

The starter in `core/frontend` currently uses React, TypeScript, Vite, and Tailwind CSS. The other technologies below are possible later choices, not integrated parts of the app.

| Technology | Current status or possible use |
|---|---|
| React, TypeScript, Vite, Tailwind CSS | Installed frontend starter |
| HTML Canvas API, MediaDevices API | Implemented local capture and PNG export |
| Zustand | Possible state management if needed |
| Supabase | Possible later authentication, database, and storage |
| Vercel | Possible deployment and hosting |
| Figma | Possible UI/UX design and prototyping |

The technology stack may change as development progresses.

## How It Works

The proposed photo booth workflow is:

1. **Choose look** — Browse categories and select a starting template on one screen.
2. **Capture or upload** — Fill the template's photo slots. Local upload is still a scope decision for the first release.
3. **Customize** — Change supported colors, filters, frames, stickers, or text.
4. **Review** — Check the completed result.
5. **Export** — Download the final image locally. Gallery and sharing are later possibilities.

## Project Structure

The current top-level structure is:

```text
lumiora/
├── core/
│   ├── frontend/           # Vite/React starter and package.json
│   └── backend/            # Reserved for a possible backend
├── docs/                   # Working planning documents
├── supabase/               # Reserved for possible service configuration
├── test/                   # Reserved for testing assets
├── AGENTS.md               # Guidance for AI coding agents
└── README.md
```

The frontend's suggested internal structure is described in [Frontend](docs/FRONTEND.md).

## Getting Started

The frontend starter can already be run locally:

```sh
cd core/frontend
npm ci
npm run dev
```

See [the frontend README](core/frontend/README.md) for checks and [planning documents](docs/README.md) for the working product and implementation direction.

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
- [x] Initialize frontend project starter
- [x] Implement application navigation
- [x] Integrate camera functionality
- [x] Build countdown and photo capture system
- [x] Implement template selection and image-slot layouts

### Phase 3 — Customization
- [x] Add photo filters
- [x] Implement customizable frames
- [x] Add stickers and decorative elements
- [x] Build photo preview and editing functionality
- [x] Implement image exporting and downloading

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

**Local prototype implemented; release scope and design under review**

The complete local photo journey is implemented. Browser support, release scope and visual design still need review; cloud features are not implemented.

## Contributing

Lumiora is currently a personal development project.

Contribution guidelines may be introduced in the future.

## License

A license has not yet been selected.

Until a license is added, no permission to use, modify, or distribute the source code is granted by default.

---

**Lumiora** — A little space for your favorite moments.
