# q2r Dashboard

A modern, responsive homelab dashboard built with React and Vite. Displays and organizes services, hosted websites, and system monitoring in an elegant dark-themed interface.

## Features

- 🎨 Modern dark theme with Tailwind CSS
- 📱 Fully responsive design
- 🔍 Real-time search across services and websites
- 📊 System status monitoring
- 🎯 Category-based organization
- ⚡ Fast hot module replacement with Vite
- 🐳 Docker-ready with CI/CD pipeline

## Tech Stack

- **Frontend**: React 19
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Configuration**: YAML-based

## Prerequisites

- Node.js 18+ (recommended: 20+)
- npm or yarn
- Docker (optional, for containerization)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The dashboard will be available at http://localhost:5173/

## Development Commands

### Install New Dependencies

**Production dependency:**
```bash
npm install <package-name>
```

**Development dependency:**
```bash
npm install -D <package-name>
```

**Example:**
```bash
npm install axios           # Add axios
npm install -D prettier     # Add prettier as dev dependency
```

### Build for Production

```bash
npm run build
```

Build output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally for testing.

### Linting

```bash
npm run lint
```

## Configuration

### Services & Websites

Edit `src/config/dashboard.yaml` to add, remove, or modify services and hosted websites:

```yaml
services:
  - id: 1
    name: Service Name
    url: "https://service.example.com"
    icon: IconName
    category: Media
    desc: Service Description
    color: text-blue-500

hostedWebsites:
  - id: 101
    name: Website Name
    url: https://example.com
    icon: Globe
    desc: Website Description
    color: text-cyan-400
```

### Available Categories

- **Media** - Streaming, photos, audiobooks, etc.
- **Apps & Productivity** - Cloud storage, AI tools, password managers, etc.
- **System** - Monitoring, downloads, infrastructure

### Adding New Icons

1. Import the icon in `src/config/iconMap.js`:
```javascript
import { NewIcon } from 'lucide-react';
```

2. Add to the iconMap:
```javascript
export const iconMap = {
  // ... existing icons
  NewIcon
};
```

3. Use in YAML config:
```yaml
icon: NewIcon
```

Browse available icons at [Lucide Icons](https://lucide.dev/icons/)

## Project Structure

```
q2r-dashboard/
├── src/
│   ├── components/
│   │   └── ui/          # UI components (Card, etc.)
│   ├── config/
│   │   ├── dashboard.yaml    # Services & websites config
│   │   ├── config.js         # Config loader
│   │   └── iconMap.js        # Icon mappings
│   ├── App.jsx          # Main application
│   ├── main.jsx         # App entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── .github/
│   └── workflows/
│       └── docker-build.yml  # GitHub Actions workflow
├── Dockerfile           # Docker image definition
├── nginx.conf           # Nginx configuration
├── tailwind.config.js   # Tailwind configuration
├── vite.config.js       # Vite configuration
└── package.json         # Project dependencies

```

## Docker

### Build Image

```bash
docker build -t q2r-dashboard:latest .
```

### Run Container

```bash
docker run -d -p 8080:80 --name q2r-dashboard q2r-dashboard:latest
```

Access at http://localhost:8080

### Stop Container

```bash
docker stop q2r-dashboard
docker rm q2r-dashboard
```

See [DOCKER.md](./DOCKER.md) for detailed Docker and CI/CD documentation.

## GitHub Actions CI/CD

The project includes automatic CI/CD pipeline via GitHub Actions:

- **Push to main** → Builds and pushes `latest` tag to GitHub Container Registry
- **Create tag** → Builds and pushes versioned image (e.g., `v1.0.0`)
- **Pull requests** → Build only (testing, no push)
- **Other branches** → Builds and pushes with branch name as tag

Images available at:
```
ghcr.io/<username>/q2r-dashboard:latest
ghcr.io/<username>/q2r-dashboard:v1.0.0
ghcr.io/<username>/q2r-dashboard:<branch-name>
```

## Customization

### Change Colors

Edit Tailwind classes in `src/App.jsx` or category colors in `src/config/iconMap.js`:

```javascript
export const categoryColors = {
  Media: 'text-yellow-500',
  'Apps & Productivity': 'text-blue-500',
  System: 'text-indigo-500'
};
```

### Modify Layout

- **Grid columns**: Edit `grid-cols-*` classes in `src/App.jsx`
- **Spacing**: Adjust `gap-*` and `space-y-*` values
- **Card styles**: Modify Card component props

### Add Custom Fonts

1. Add font files to `public/fonts/`
2. Import in `src/index.css`:
```css
@import "tailwindcss";

@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom-font.woff2');
}
```
3. Use in Tailwind config or inline styles

## Troubleshooting

### Port 5173 already in use

Change the port in `vite.config.js`:
```javascript
export default defineConfig({
  server: {
    port: 3000
  }
})
```

### Build fails with memory error

Increase Node memory limit:
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Styles not updating

1. Hard refresh: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
2. Clear Vite cache: `rm -rf node_modules/.vite`
3. Restart dev server

### TypeScript errors (if adding TS)

Create `tsconfig.json`:
```bash
npx tsc --init
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test locally: `npm run dev`
5. Build: `npm run build`
6. Commit: `git commit -m "Add feature"`
7. Push: `git push origin feature-name`
8. Create a Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check [DOCKER.md](./DOCKER.md) for Docker-related questions

---

**Maintained by Quadeare** | Built with ❤️ using React + Vite
