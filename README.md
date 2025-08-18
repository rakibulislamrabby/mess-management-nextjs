# Mess Management Next.js

A Next.js application with Tailwind CSS for mess management.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/           # Next.js App Router
│   ├── layout.js  # Root layout
│   ├── page.js    # Home page
│   └── globals.css # Global styles
public/            # Static assets
```

## Tech Stack

- **Next.js 15** - React framework
- **Tailwind CSS** - Utility-first CSS framework
- **JavaScript** - No TypeScript (as requested)
- **ESLint** - Code linting

## Development

The project uses the Next.js App Router and is configured with:
- Tailwind CSS for styling
- ESLint for code quality
- Import aliases (`@/*` for src directory)
- Source directory structure
