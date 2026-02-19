# CV Data Structure

This document describes the structure and format of the CV data files used in the project.

## Overview

The CV data is stored in TOML format in the `data/` directory. Each language has its own file:

- `cv.toml` - default source
- `cv.en.toml` - English
- `cv.zh.toml` - Chinese (Simplified)
- `cv.ja.toml` - Japanese

All files must follow the same structure defined by the TypeScript types in `lib/types/cv.ts`.

## Data Structure

### Hero Section

The hero section contains personal information and social links.

```toml
hero:
  name: "Your Name"
  enName: "English Name" # Optional, for non-English versions
  avatar: "/path/to/avatar.png"
  location: "City, Country"
  age: "YYYY-MM" # Birth date in year-month format
  bio: "Brief professional bio"
  social:
    github: "https://github.com/username"
    email: "email@example.com"
    phone: "+1 234-567-8900" # Optional
    wechat: "wechat_id" # Optional
    linkedin: "https://linkedin.com/in/username" # Optional
    website: "https://yoursite.com" # Optional
    orcid: "https://orcid.org/0000-0000-0000-0000" # Optional
    googleScholar: "https://scholar.google.com/citations?user=xxx" # Optional
    researchGate: "https://researchgate.net/profile/xxx" # Optional
    twitter: "https://twitter.com/username" # Optional
```

### Education

List of educational background in reverse chronological order.

```toml
education:
  - institution: "University Name"
    area: "Field of Study"
    degree: "Degree Type" # e.g., "Master", "Bachelor", "PhD"
    supervisor: "Supervisor Name" # Optional, mainly for graduate degrees
    startDate: "Sep 2020" # Format: "Mon YYYY" or localized equivalent
    endDate: "Jun 2024" # Or "Present"/"现在"/"現在"
    summary: "Optional summary" # Brief description
    highlights:
      - "Achievement or highlight 1"
      - "Achievement or highlight 2"
```

### Publications

Academic publications, papers, and patents.

```toml
publications:
  - title: "Publication Title"
    authors: ["Author 1", "Author 2", "Author 3"]
    type: "Journal Article" # "Journal Article", "Conference Paper", "Patent", "Preprint"
    status: "Published" # "Published", "Under Review", "In Press", "Ongoing"
    indexing: ["SCI", "EI"] # Optional, journal indexing
    impactFactor: 5.2 # Optional, journal impact factor
    publishedIn: "Journal/Conference Name"
    abstract: "Brief abstract" # Optional
    doi: "10.1000/example" # Optional
    url: "https://example.com/paper" # Optional
    highlight: true # Optional, for featured publications
    involved: true # Optional, indicates direct involvement
```

### Experience

Work experience and research projects.

```toml
experience:
  - position: "Job Title or Project Name"
    company: "Company/Institution Name"
    location: "City, Country" # Optional
    startDate: "Jan 2024"
    endDate: "Present"
    summary: "Brief role description" # Optional
    highlights:
      - "Achievement or responsibility 1"
      - "Achievement or responsibility 2"
```

### Awards

Academic and professional awards.

```toml
awards:
  - name: "Award Name"
    institute: "Awarding Institution"
    date: "2024" # Can be year or "YYYY, YYYY" for multiple years
    description: "Award description" # Optional
```

### Skills

Technical and soft skills organized by categories.

```toml
skills:
  categories:
    - "Programming"
    - "Research" 
    - "Communication"
  
  skills:
    - name: "Skill Name"
      category: "Programming" # Must match one of the categories above
      description: "Skill description or proficiency level"
```

### Talks (Optional)

Conference talks, presentations, and lectures.

```toml
talks:
  - title: "Talk Title"
    event: "Conference/Event Name"
    location: "City, Country" # Optional
    date: "2024-03-15"
    type: "Keynote" # Optional: "Keynote", "Invited", "Contributed"
    description: "Talk description" # Optional
    url: "https://example.com/talk" # Optional
```

## Localization Guidelines

### Date Formats

- **English**: "Jan 2024", "Present"
- **Chinese**: "2024年1月", "至今"  
- **Japanese**: "2024年1月", "現在"

### Status Terms

Common status translations:

| English | Chinese | Japanese |
|---------|---------|----------|
| Published | 已发表 | 発表済み |
| Under Review | 审稿中 | 査読中 |
| In Press | 印刷中 | 印刷中 |
| Ongoing | 进行中 | 進行中 |
| Present | 至今 | 現在 |

### Field Names

Keep publication types and categories consistent:

| English | Chinese | Japanese |
|---------|---------|----------|
| Journal Article | 期刊论文 | 学術論文 |
| Conference Paper | 会议论文 | 会議論文 |
| Patent | 专利 | 特許 |
| Preprint | 预印本 | プレプリント |

## Validation

The data is validated against TypeScript types. Common validation errors:

1. **Missing required fields**: `name`, `avatar`, `location`, `age` in hero section
2. **Invalid date formats**: Ensure consistent date formatting
3. **Category mismatch**: Skills must reference existing categories
4. **Type mismatches**: Arrays vs. strings, required vs. optional fields

## Best Practices

1. **Consistency**: Maintain the same structure across all language versions
2. **Completeness**: Include all relevant information, even if optional
3. **Accuracy**: Double-check dates, names, and technical details
4. **Localization**: Translate content appropriately for each language
5. **Validation**: Test your changes by running the development server

## Examples

See the existing files for complete examples:
- [English CV Data](../data/cv.en.toml)
- [Chinese CV Data](../data/cv.zh.toml)
- [Japanese CV Data](../data/cv.ja.toml) 
