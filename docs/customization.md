# Customization Guide

This guide explains how to customize the styling, theming, and appearance of your minimal-cv project.

## Overview

The project uses a modern design system built with:

- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Pre-built component library
- **CSS Variables** - Dynamic theming support
- **Custom Animations** - Smooth transitions and effects

## Styling Architecture

### Tailwind Configuration

The main styling configuration is in `tailwind.config.ts`:

```typescript
module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette
      },
      fontFamily: {
        // Custom fonts
      },
      animation: {
        // Custom animations
      }
    },
  },
  plugins: [],
}
```

### CSS Variables

Global styles are defined in `app/globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  /* ... more variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark mode overrides */
}
```

## Color Customization

### Primary Color Scheme

Update the main brand colors:

```css
:root {
  --primary: 221.2 83.2% 53.3%;        /* Blue */
  --primary-foreground: 210 40% 98%;    /* White text */
  --secondary: 210 40% 96%;             /* Light gray */
  --secondary-foreground: 222.2 84% 4.9%; /* Dark text */
}
```

### Adding Custom Colors

1. Define in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      brand: {
        50: '#eff6ff',
        500: '#3b82f6',
        900: '#1e3a8a',
      }
    }
  }
}
```

2. Use in components:

```tsx
<div className="bg-brand-50 text-brand-900">
  Custom branded content
</div>
```

### Color Palette Examples

**Academic Blue**:
```css
--primary: 221 83% 53%;
--accent: 210 40% 96%;
```

**Professional Gray**:
```css
--primary: 222 84% 5%;
--accent: 210 40% 98%;
```

**Modern Purple**:
```css
--primary: 262 83% 58%;
--accent: 270 40% 96%;
```

## Typography

### Font Configuration

Add custom fonts in `app/[locale]/layout.tsx`:

```typescript
import { Inter, Noto_Sans_SC } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })
const notoSansSC = Noto_Sans_SC({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"]
})
```

### Typography Scale

Customize text sizes in `tailwind.config.ts`:

```typescript
fontSize: {
  'xs': '0.75rem',     // 12px
  'sm': '0.875rem',    // 14px  
  'base': '1rem',      // 16px
  'lg': '1.125rem',    // 18px
  'xl': '1.25rem',     // 20px
  '2xl': '1.5rem',     // 24px
  '3xl': '1.875rem',   // 30px
  '4xl': '2.25rem',    // 36px
}
```

### Responsive Typography

Use responsive text utilities:

```tsx
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  Responsive Heading
</h1>
```

## Layout Customization

### Container Widths

Adjust maximum content width:

```css
.paper-container {
  @apply max-w-4xl mx-auto px-6;
}

/* For wider layouts */
.paper-container-wide {
  @apply max-w-6xl mx-auto px-8;
}
```

### Spacing System

Customize spacing in `tailwind.config.ts`:

```typescript
spacing: {
  '18': '4.5rem',   // 72px
  '72': '18rem',    // 288px
  '84': '21rem',    // 336px
  '96': '24rem',    // 384px
}
```

### Grid Layouts

Create custom grid systems:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Grid items */}
</div>
```

## Component Styling

### Card Components

Customize card appearance:

```tsx
// Default card
<Card className="bg-white shadow-sm border border-gray-200">
  
// Elevated card
<Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
  
// Gradient card
<Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
```

### Button Variants

Create custom button styles:

```tsx
// Primary button
<Button className="bg-blue-600 hover:bg-blue-700 text-white">

// Outline button  
<Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">

// Ghost button
<Button variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
```

### Badge Styling

Customize badges for different content:

```tsx
// Status badges
<Badge className="bg-green-100 text-green-800">Published</Badge>
<Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>
<Badge className="bg-blue-100 text-blue-800">In Progress</Badge>

// Category badges
<Badge variant="secondary" className="font-medium">Programming</Badge>
```

## Animations

### Custom Animations

Add in `tailwind.config.ts`:

```typescript
animation: {
  'fade-in': 'fadeIn 0.5s ease-in-out',
  'slide-up': 'slideUp 0.6s ease-out',
  'scale-in': 'scaleIn 0.4s ease-out',
}

keyframes: {
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  slideUp: {
    '0%': { transform: 'translateY(20px)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
  scaleIn: {
    '0%': { transform: 'scale(0.95)', opacity: '0' },
    '100%': { transform: 'scale(1)', opacity: '1' },
  },
}
```

### Staggered Animations

Create sequential entrance effects:

```tsx
<div className="space-y-4">
  {items.map((item, index) => (
    <div 
      key={item.id}
      className="animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {item.content}
    </div>
  ))}
</div>
```

### Hover Effects

Add interactive feedback:

```tsx
<Card className="transition-all duration-200 hover:scale-105 hover:shadow-lg">
  <div className="transform transition-transform group-hover:translate-x-2">
    Content with hover effect
  </div>
</Card>
```

## Dark Mode

### Enable Dark Mode

Update `components/theme-provider.tsx`:

```typescript
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
```

### Dark Mode Styles

Add dark mode variants:

```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  <Card className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
    Content that adapts to theme
  </Card>
</div>
```

### Custom Dark Theme

Define dark mode colors:

```css
.dark {
  --background: 222 84% 5%;
  --foreground: 210 40% 98%;
  --card: 222 84% 5%;
  --card-foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222 84% 5%;
}
```

## Print Styles

### Print-Specific Styling

Optimize for PDF generation:

```css
@media print {
  .print\:hidden {
    display: none !important;
  }
  
  .print\:block {
    display: block !important;
  }
  
  .print\:break-before-page {
    break-before: page;
  }
  
  .print\:text-sm {
    font-size: 0.875rem !important;
  }
}
```

### Print Layout

Adjust spacing and typography for print:

```tsx
<section className="print:break-before-page print:mt-0">
  <h2 className="text-xl print:text-lg print:mb-2">
    Section Title
  </h2>
  <div className="space-y-4 print:space-y-2">
    {/* Content optimized for print */}
  </div>
</section>
```

## Responsive Design

### Breakpoint System

Tailwind's default breakpoints:

```css
sm: 640px    /* Small devices */
md: 768px    /* Medium devices */
lg: 1024px   /* Large devices */
xl: 1280px   /* Extra large */
2xl: 1536px  /* 2X large */
```

### Custom Breakpoints

Add custom breakpoints:

```typescript
screens: {
  'xs': '475px',
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1400px',
  '3xl': '1600px',
}
```

### Mobile-First Design

Design for mobile, enhance for larger screens:

```tsx
<div className="
  flex flex-col space-y-4
  md:flex-row md:space-y-0 md:space-x-6
  lg:space-x-8
">
  {/* Mobile: stacked, Desktop: side-by-side */}
</div>
```

## Localization Styling

### Language-Specific Fonts

Handle different writing systems:

```tsx
<div className={`
  font-inter
  ${locale === 'zh' ? 'font-noto-sans-sc' : ''}
  ${locale === 'ja' ? 'font-noto-sans-jp' : ''}
`}>
  Localized content
</div>
```

### RTL Support

For right-to-left languages:

```tsx
<div className="text-left rtl:text-right">
  <p className="ml-4 rtl:ml-0 rtl:mr-4">
    Text with RTL-aware margins
  </p>
</div>
```

## Performance Optimization

### Purge Unused Styles

Tailwind automatically purges unused CSS in production.

### Critical CSS

Inline critical styles:

```tsx
<style jsx>{`
  .hero-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
`}</style>
```

### Font Loading

Optimize font loading:

```tsx
<link
  rel="preload"
  href="/fonts/custom-font.woff2"
  as="font"
  type="font/woff2"
  crossOrigin="anonymous"
/>
```

## Common Customizations

### Academic Theme

Professional styling for academic CVs:

```css
:root {
  --primary: 15 23% 42%;        /* Deep blue */
  --secondary: 210 17% 95%;     /* Light gray */
  --accent: 210 100% 50%;       /* Bright blue */
}

.academic-section {
  @apply border-l-4 border-blue-600 pl-6 py-4;
}
```

### Creative Theme

Modern styling for creative professionals:

```css
:root {
  --primary: 340 82% 52%;       /* Bright pink */
  --secondary: 322 100% 97%;    /* Light pink */
  --accent: 271 91% 65%;        /* Purple */
}

.creative-card {
  @apply bg-gradient-to-br from-pink-50 to-purple-50 border-0 shadow-lg;
}
```

### Corporate Theme

Clean styling for business contexts:

```css
:root {
  --primary: 215 28% 17%;       /* Navy blue */
  --secondary: 216 33% 97%;     /* Very light blue */
  --accent: 215 100% 50%;       /* Blue */
}

.corporate-layout {
  @apply max-w-5xl mx-auto bg-white shadow-xl;
}
```

## Best Practices

### Consistent Spacing

Use a consistent spacing scale:

```tsx
// Good: Consistent spacing
<div className="space-y-6">
  <section className="mb-8">
  <div className="p-6">

// Avoid: Arbitrary values
<div className="mt-17 mb-23 p-7">
```

### Semantic Classes

Create meaningful utility classes:

```css
@layer components {
  .cv-section {
    @apply mb-12 last:mb-0;
  }
  
  .cv-heading {
    @apply text-2xl font-bold text-gray-900 mb-6;
  }
  
  .cv-card {
    @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
  }
}
```

### Maintainable Code

- Use CSS variables for colors
- Group related styles in components
- Document color meanings
- Test across different screen sizes
- Validate print appearance

## Troubleshooting

### Common Issues

**Styles not applying**: Check Tailwind content paths
**Dark mode not working**: Verify theme provider setup
**Print styles broken**: Test print media queries
**Fonts not loading**: Check font import paths

### Development Tips

```bash
# Watch for style changes
pnpm dev

# Build and check production styles
pnpm build

# Test print styles in browser
# Use browser dev tools > Print preview
``` 