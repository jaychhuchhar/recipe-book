# Development Container Setup

This directory contains the con### Container Configuration

### Files
- `devcontainer.json` - Main configuration file
- `setup.sh` - Post-creation setup scription for a VS Code development container for the Recipe Book project.

## What's Included

### Container Features
- **Base Image**: Microsoft's TypeScript Node.js devcontainer
- **Node.js**: Version 20 with npm
- **Git**: Version control with GitHub CLI
- **Docker**: Docker-in-Docker support
- **Shell**: Zsh with Oh My Zsh

### VS Code Extensions
- TypeScript and JavaScript support
- Tailwind CSS IntelliSense
- Prettier code formatter
- ESLint
- Material Icon Theme
- Auto Rename Tag
- Path IntelliSense
- React snippets
- MDX support
- Markdown preview and tools

### Pre-configured Settings
- Format on save with Prettier
- ESLint auto-fix on save
- TypeScript import preferences
- MDX file associations
- Tailwind CSS support for MDX

## Getting Started

### Prerequisites
- [VS Code](https://code.visualstudio.com/)
- [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Using the DevContainer

1. **Open the project in VS Code**
   ```bash
   code .
   ```

2. **Reopen in Container**
   - VS Code should automatically detect the devcontainer configuration
   - Click "Reopen in Container" when prompted
   - Or use Command Palette: `Dev Containers: Reopen in Container`

3. **Wait for Setup**
   - The container will be created automatically
   - Image processing tools will be installed
   - Dependencies will be installed
   - Recipe images will be set up and optimized
   - This may take a few minutes on first run

4. **Start Development**
   ```bash
   npm run dev
   ```
   - The development server will start on port 3000
   - VS Code will automatically forward the port

## Container Configuration

### Files
- `devcontainer.json` - Main configuration file
- `Dockerfile` - Custom container image with image processing tools
- `docker-compose.yml` - Multi-service container setup
- `setup.sh` - Post-creation setup script

### Ports
- **3000**: Next.js development server
- **3001**: Additional port for services

### Volumes
- Node modules are persisted in a Docker volume for better performance
- Source code is mounted from the host

### Environment Variables
- `NODE_ENV=development`
- `NEXT_TELEMETRY_DISABLED=1`

## Customization

### Adding Extensions
Edit the `extensions` array in `devcontainer.json`:
```json
"extensions": [
  "your-extension-id"
]
```

### Modifying Settings
Update the `settings` object in `devcontainer.json`:
```json
"settings": {
  "your.setting": "value"
}
```

### Installing Additional Tools
Modify the `Dockerfile` to add system packages or the `postCreateCommand` for npm packages.

## Troubleshooting

### Container Won't Start
1. Ensure Docker Desktop is running
2. Check Docker has sufficient resources allocated
3. Try rebuilding: `Dev Containers: Rebuild Container`

### Port Already in Use
- Stop any local Next.js servers running on port 3000
- Or change the port in `docker-compose.yml`

### Slow Performance
- Increase Docker Desktop memory allocation
- Consider using performance optimizations for your OS

### Node Modules Issues
- The container uses a Docker volume for node_modules
- If issues persist, rebuild the container: `Dev Containers: Rebuild Container`

## Benefits

✅ **Consistent Environment**: Everyone gets the same development setup
✅ **Quick Setup**: New contributors can start coding immediately
✅ **Isolated**: No conflicts with local Node.js versions or global packages
✅ **Pre-configured**: All necessary extensions and settings included
✅ **Image Processing**: Built-in tools for recipe image optimization
✅ **Version Control**: Git and GitHub CLI ready to use

## Commands Available

All npm scripts from `package.json` are available:
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run setup-images` - Set up recipe images
- `npm run optimize-images` - Optimize all images
- `npm run convert-images` - Convert images to modern formats
- `npm run convert` - Convert recipe text files to MDX
