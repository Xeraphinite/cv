# CV Data Structure

The runtime `CVData` model is defined in `lib/types/cv.ts`. Source content is loaded from TOML by `lib/load-cv-data.ts`.

## Source Model

### Default source

- `data/cv.toml`

This is the canonical source file for the default English content.

### Locale overrides

- `data/cv.zh.toml`
- `data/cv.ja.toml`

Localized files are partial overrides merged onto the base data by index. Keep the same item ordering and record parity as the default source.

## Runtime Shape

```ts
interface CVData {
  hero: Hero
  education: EducationItem[]
  sectionConfig?: SectionConfig
  publications: PublicationItem[]
  experience: ExperienceItem[]
  projects?: ProjectItem[]
  news?: NewsItem[]
  awards: AwardItem[]
  skills: Skills
  talks?: TalkItem[]
}
```

## TOML Input Shape

The default TOML file is not a direct 1:1 dump of `CVData`. `lib/load-cv-data.ts` maps this source shape into the runtime model.

Top-level TOML tables used today:

- `sectionConfig`
- `profile`
- `education`
- `experience`
- `publications`
- `news`
- `projects`
- `skills`
- `awards`

## Sections

### `profile`

Used to build `hero`.

Supported fields:

```toml
[profile]
original_name = "..."
en_name = "..."
aliases = ["..."]
furigana_name = "..."
furigana = "..."
location_label = "..."
position = "..."
summary = "..."

[[profile.contacts]]
icon = "email"
label = "name@example.com"
url = "mailto:name@example.com"
```

Mapped runtime fields:

- `hero.name`
- `hero.enName`
- `hero.aliases`
- `hero.furiganaName`
- `hero.furigana`
- `hero.location`
- `hero.position`
- `hero.bio`
- `hero.social`

Notes:

- avatar is currently injected as `/images/avatar/avatar-256.png`
- `email`, `website`, `github`, and `wechat` are the TOML contact types currently mapped into `hero.social`

### `education`

Source entries are keyed tables:

```toml
[education.master]
institution = "..."
degree = "Field, Degree"
date = "2022-09 - 2025-06"
details = ["...", "..."]
```

Mapping rules:

- `degree` is split on the first comma into `area` and `degree`
- `date` is split into `startDate` and `endDate`
- `details` populate both `summary` and `highlights`

### `experience`

```toml
[experience.role_key]
project = "..."
role = "..."
org = "..."
location = "..."
start = "..."
end = "..."
summary = "..."
details = ["...", "..."]
```

Mapping rules:

- `position` prefers `project`, then `role`
- `company` maps from `org`
- `details` map to `highlights`

### `publications`

```toml
[publications.paper_key]
type = "journal"
title = "..."
venue = "..."
published = "2025"
metadata = "JCR Q1; IF: 12.3"
DOI = "10.xxxx/..."
pdf = "https://..."
authors = ["...", "..."]
tldr = "..."
```

Mapping rules:

- `type` is normalized to runtime values such as `Journal Article`
- `published` maps to `year`
- `DOI` maps to `doi`
- `pdf` maps to `url`
- `tldr` maps to `abstract`
- `metadata` may derive:
  - `impactFactor`
  - `indexing` values like `JCR-Q1`

Status derivation:

- if DOI exists, status becomes `Published`
- if `published` is a future year, status becomes `Under Review`
- otherwise status defaults to `Published`

### `news`

```toml
[news.some_item]
title = "..."
outlet = "..."
date = "2025-10"
summary = "Markdown-capable summary"
url = "https://..."
```

### `projects`

```toml
[projects.some_project]
name = "..."
description = "..."
year = "2025"
status = "Active"
preview_images = [
  "/images/example.png",
  { src = "/images/example-2.png", alt = "Preview" }
]
urls = [
  "https://example.com",
  { label = "GitHub", url = "https://github.com/...", icon = "mingcute:github-line" }
]
tech = [
  "TypeScript",
  { text = "Next.js", icon = "mingcute:planet-line", description = "..." }
]
```

Rules:

- string `urls` become `{ label = "Link", icon = "mingcute:arrow-right-up-fill" }`
- string `tech` entries default to code-style badges
- empty `name` values are ignored

### `skills`

```toml
[skills.languages]
label = "Languages"
items = [
  "English",
  { text = "Japanese", description = "Business reading" }
]
```

Runtime output:

- `skills.categories` comes from each entry’s `label`
- `skills.skills` is flattened from each `items` array with category backreferences

Supported item fields:

- `text`
- `name`
- `icon`
- `url`
- `code`
- `description`

### `awards`

```toml
[awards.some_award]
name = "..."
date = "2024"
from = "..."
description = "..."
```

Maps directly to:

- `name`
- `date`
- `institute`
- `description`

### `sectionConfig`

Current supported field:

```toml
[sectionConfig.education]
splitExpectedLine = true
```

## Merge Behavior

Localized TOML files are parsed as partial `CVData` payloads and merged with these rules:

- objects are merged shallowly and recursively
- arrays are merged by index
- omitted localized values keep the base value
- reordered localized arrays will break parity and should be avoided

## Fallback Behavior

- Base load failure falls back to sample data
- Missing locale override falls back to the configured fallback locale in `app-config`
- If no override is found, the base `data/cv.toml` result is returned
