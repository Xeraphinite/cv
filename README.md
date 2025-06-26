# Minimal CV

A modern, responsive, and multilingual CV/Resume website built with Next.js 14, TypeScript, and Tailwind CSS.

## ✨ Features

- **🌍 Multilingual Support**: English, Chinese (Simplified), and Japanese
- **📱 Responsive Design**: Optimized for all devices
- **🎨 Modern UI**: Clean, professional layout with smooth animations
- **📄 Print-Friendly**: Optimized for PDF generation and printing
- **⚡ Performance**: Built with Next.js 14 App Router for optimal performance
- **🔧 TypeScript**: Fully typed for better development experience
- **🎯 SEO Optimized**: Meta tags, OpenGraph, and structured data

## 🏗️ Project Structure

```
minimal-cv/
├── app/                    # Next.js App Router
│   └── [locale]/          # Internationalized routes
├── components/            # React components (organized by purpose)
│   ├── layout/           # Layout-related components
│   ├── sections/         # CV section components
│   └── ui/              # Reusable UI components
├── data/                 # CV data in YAML format
│   ├── cv.en.yaml       # English CV data
│   ├── cv.zh.yaml       # Chinese CV data
│   └── cv.ja.yaml       # Japanese CV data
├── lib/                  # Utility functions and types
│   ├── types/           # TypeScript type definitions
│   └── i18n-utils.ts    # Internationalization utilities
├── messages/            # Translation files
└── public/              # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd minimal-cv
```

2. Install dependencies:
```bash
pnpm install
```

3. Update the CV data in `data/` directory with your information

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view your CV

## 📝 Customization

### CV Data

Update the YAML files in the `data/` directory:

- `cv.en.yaml` - English version
- `cv.zh.yaml` - Chinese version  
- `cv.ja.yaml` - Japanese version

All files should follow the same structure defined in `lib/types/cv.ts`.

### Adding New Languages

1. Create a new CV data file: `data/cv.[locale].yaml`
2. Add translation messages: `messages/[locale].json`
3. Update the locale configuration in `i18n.ts`

### Styling

The project uses Tailwind CSS. Customize the styling by:

- Modifying component classes
- Updating the Tailwind config in `tailwind.config.ts`
- Adding custom CSS in `styles/globals.css`

## 🛠️ Build & Deploy

### Build for Production

```bash
pnpm build
```

### Export Static Site

```bash
pnpm build && pnpm export
```

### Deploy

The site can be deployed to:

- **Vercel** (recommended): Connect your GitHub repo
- **Netlify**: Drag and drop the `out/` folder
- **GitHub Pages**: Use the static export

## 📚 Documentation

- [Components Documentation](./docs/components.md) - Detailed component API
- [Data Structure](./docs/data-structure.md) - CV data format specification
- [Internationalization](./docs/i18n.md) - Adding and managing languages
- [Customization Guide](./docs/customization.md) - Styling and theming

## 🧰 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Internationalization**: next-intl
- **Icons**: Lucide React
- **Data Format**: YAML

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful components
- [next-intl](https://next-intl-docs.vercel.app/) for internationalization 