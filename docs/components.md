# Components Documentation

This document describes the component structure and APIs used in the minimal-cv project.

## Component Organization

Components are organized into three main categories:

```
components/
├── layout/           # Layout and navigation components
├── sections/         # CV content section components  
└── ui/              # Reusable UI components (shadcn/ui)
```

## Layout Components

### CVHeader (`components/layout/cv-header.tsx`)

Main header component containing the locale switcher and site navigation.

**Props**: None

**Features**:
- Responsive design
- Print-friendly (hidden in print mode)
- Locale switcher integration

### LocaleSwitcher (`components/layout/locale-switcher.tsx`)

Language switching component for internationalization.

**Props**: None

**Features**:
- Supports English, Chinese, and Japanese
- Smooth transitions with loading states
- Accessibility support
- Development debug mode
- Progressive enhancement (works without JavaScript)

**State Management**:
- Uses `useTransition` for smooth navigation
- Automatic locale detection from URL
- Fallback to default locale

### LocaleDetector (`components/layout/locale-detector.tsx`)

Client-side locale detection and automatic redirection.

**Props**: None

**Features**:
- Browser language detection
- Automatic redirection to preferred language
- Fallback handling

## Section Components

### CV (`components/sections/cv.tsx`)

Main CV container component that orchestrates all sections.

**Props**:
```typescript
interface CVProps {
  data: CVData; // CV data object
  locale?: string; // Current locale
}
```

**Features**:
- Responsive layout
- Print optimization
- Staggered animations
- Section conditional rendering

### HeroSection (`components/sections/hero-section.tsx`)

Personal information and contact details header.

**Props**:
```typescript
interface HeroSectionProps {
  data: Hero;
  locale?: string;
}
```

**Features**:
- Avatar display
- Social media links
- Responsive contact information
- Animated entrance

### EducationSection (`components/sections/education-section.tsx`)

Educational background display.

**Props**:
```typescript
interface EducationSectionProps {
  data: EducationItem[];
}
```

**Features**:
- Timeline layout
- Supervisor information (for graduate degrees)
- Highlight achievements
- Responsive cards

### ExperienceSection (`components/sections/experience-section.tsx`)

Work experience and projects.

**Props**:
```typescript
interface ExperienceSectionProps {
  data: ExperienceItem[];
}
```

**Features**:
- Chronological ordering
- Achievement highlights
- Company/institution links
- Responsive layout

### PublicationsSection (`components/sections/publications-section.tsx`)

Academic publications and papers.

**Props**:
```typescript
interface PublicationsSectionProps {
  data: PublicationItem[];
}
```

**Features**:
- Publication type badges
- Impact factor display
- DOI and URL links
- Citation formatting
- Status indicators

### SkillsSection (`components/sections/skills-section.tsx`)

Technical and soft skills organized by categories.

**Props**:
```typescript
interface SkillsSectionProps {
  data: Skills;
}
```

**Features**:
- Category-based organization
- Skill proficiency indicators
- Responsive grid layout
- Interactive hover effects

### AwardsSection (`components/sections/awards-section.tsx`)

Academic and professional awards.

**Props**:
```typescript
interface AwardsSectionProps {
  data: AwardItem[];
}
```

**Features**:
- Chronological display
- Institution information
- Award descriptions
- Responsive cards

### TalksSection (`components/sections/talks-section.tsx`)

Conference talks and presentations.

**Props**:
```typescript
interface TalksSectionProps {
  data: TalkItem[];
}
```

**Features**:
- Event information
- Talk type indicators
- External links
- Date formatting

### ProfileSection (`components/sections/profile-section.tsx`)

Profile highlights and research interests.

**Props**:
```typescript
interface ProfileSectionProps {
  data: {
    education?: any[];
    publications?: any[];
    awards?: any[];
    projects?: any[];
  };
}
```

**Features**:
- Key achievements summary
- Research interests display
- Quick overview stats

## UI Components

The project uses [shadcn/ui](https://ui.shadcn.com/) components located in `components/ui/`. These are pre-built, accessible components that can be customized with Tailwind CSS.

Key UI components used:
- `Card` - Content containers
- `Badge` - Status and category indicators
- `Button` - Interactive elements
- `Separator` - Visual dividers
- `Avatar` - Profile images

## Styling Guidelines

### Responsive Design

All components follow mobile-first responsive design:

```css
/* Mobile first */
.component-class

/* Tablet */
@media (min-width: 768px) {
  .md:component-class
}

/* Desktop */
@media (min-width: 1024px) {
  .lg:component-class
}
```

### Print Styles

Components include print-specific styles:

```css
.print:hidden     /* Hidden in print mode */
.print:block      /* Visible only in print */
.print:break-before-page  /* Page breaks */
```

### Animations

Consistent animation patterns:

- `animate-fade-in` - Fade in entrance
- `animate-slide-up` - Slide up entrance
- Staggered delays for section animations

## Component Development

### Creating New Components

1. Choose appropriate directory (`layout/`, `sections/`, `ui/`)
2. Follow TypeScript interface patterns
3. Include proper prop types
4. Add responsive design
5. Consider print styles
6. Update index exports

### Component Conventions

- Use functional components with TypeScript
- Props interfaces should be exported
- Include proper accessibility attributes
- Follow Tailwind CSS utility patterns
- Add loading states where appropriate

### Testing Components

```bash
# Run development server
pnpm dev

# Type checking
pnpm type-check

# Build verification
pnpm build
```

## Accessibility

All components follow accessibility best practices:

- Semantic HTML structure
- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance

## Performance

Components are optimized for performance:

- Lazy loading where appropriate
- Minimal bundle size
- Efficient re-renders
- Image optimization
- Code splitting

## Customization

### Adding New Sections

1. Create component in `components/sections/`
2. Define TypeScript interface
3. Add to CV data structure
4. Update CV component
5. Add to section index exports

### Modifying Existing Components

1. Maintain existing prop interfaces
2. Update TypeScript types if needed
3. Test across all breakpoints
4. Verify print compatibility
5. Update documentation 