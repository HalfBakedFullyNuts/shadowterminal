# Shadowterminal Design System

This document outlines the design system and color scheme for the Shadowterminal application.

## 1. Color Palette

The application uses a dark, cyberpunk-themed color palette defined in CSS variables.

### Core Colors
| Variable | Hex | Description |
|----------|-----|-------------|
| `--color-background` | `#151A1D` | Main application background (Deep Dark Blue/Grey) |
| `--color-panel-background` | `#1A2125` | Secondary background for cards and panels |
| `--color-border` | `#3A454C` | Standard border color |
| `--color-primary-text` | `#E0E5E0` | Main text color (Off-white) |
| `--color-secondary-text` | `#96A39D` | Muted text color (Greyish Green) |

### Accent Colors
| Variable | Hex | Description |
|----------|-----|-------------|
| `--color-accent-green` | `#00FF7F` | Primary action/success color (Spring Green) |
| `--color-accent-amber` | `#FFBF00` | Warning/Highlight color (Amber) |
| `--color-accent-red` | `#FF3333` | Danger/Error color (Red) |

### Glow Effects (RGBA)
Used for box-shadows and glowing text effects.
- `--color-glow-green`: `rgba(0, 255, 127, 0.4)`
- `--color-glow-amber`: `rgba(255, 191, 0, 0.4)`
- `--color-glow-red`: `rgba(255, 51, 51, 0.4)`
- `--color-nav-glow`: `rgba(0, 191, 255, 0.2)`

## 2. Typography

### Font Families
| Variable | Font Family | Usage |
|----------|-------------|-------|
| `--font-heading` | `'Chakra Petch', monospace` | Headings, Titles, UI Labels |
| `--font-body` | `'Exo 2', sans-serif` | Body text, Paragraphs |
| `Cyber` | `Cyber` (Custom Font) | Special decorative elements, Glitch buttons |

### Usage in Tailwind
- `font-heading`: Applies Chakra Petch
- `font-body`: Applies Exo 2

## 3. Utility Classes

Custom utility classes are available for common UI patterns.

### Hover Effects
- `.glow-amber-hover`: Adds amber glow and border on hover.
- `.glow-green-hover`: Adds green glow and border on hover.
- `.glow-red-hover`: Adds red glow and border on hover.
- `.nav-item-glow-hover`: Specific hover effect for navigation items.

### Text Effects
- `.text-glow-amber`: Adds amber text shadow.
- `.text-glow-green`: Adds green text shadow.
- `.text-glow`: Adds text shadow using the current text color.

### Input States
- `.input-glow-focus`: Amber glow on focus.
- `.input-error-glow`: Red glow for error states.
- `.input-success-glow`: Green glow for success states.

### Components
- `.cyber-border`: Adds a standard border with relative positioning.
- `.box-glow`: Adds a box shadow using the current text color.

## 4. Legacy Mappings
*Note: These are maintained for backward compatibility but new development should prefer the Core/Accent variables.*

- `--color-cyber-cyan` → `--color-accent-green`
- `--color-cyber-magenta` → `--color-accent-red`
- `--color-cyber-yellow` → `--color-accent-amber`
- `--color-cyber-dark` → `--color-background`
- `--color-cyber-gray` → `--color-panel-background`
