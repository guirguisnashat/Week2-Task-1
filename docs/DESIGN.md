# Design Decisions — Lumen Tech Solutions Website

This document explains the main design and technical choices behind the site.

## 1. Planning and wireframes

Each page was planned as a vertical stack of sections before any code was written:

```
HOME                     ABOUT                    SERVICES                 CONTACT
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ Header / nav     │     │ Header / nav     │     │ Header / nav     │     │ Header / nav     │
├──────────────────┤     ├──────────────────┤     ├──────────────────┤     ├──────────────────┤
│ Hero: text | img │     │ Page banner      │     │ Page banner      │     │ Page banner      │
│ Client logos     │     │ Story: img | text│     │ 6 service cards  │     │ 3 contact cards  │
│ 6 feature cards  │     │ 4 value cards    │     │ 4-step process   │     │ Form   | map+FAQ │
│ Stats band       │     │ Timeline         │     │ 3 pricing cards  │     │                  │
│ Testimonial      │     │ 4 team cards     │     │                  │     │                  │
│ CTA banner       │     │ CTA banner       │     │                  │     │                  │
├──────────────────┤     ├──────────────────┤     ├──────────────────┤     ├──────────────────┤
│ Footer           │     │ Footer           │     │ Footer           │     │ Footer           │
└──────────────────┘     └──────────────────┘     └──────────────────┘     └──────────────────┘
```

On mobile, every "a | b" row stacks into a single column, and card grids collapse from 4 or 3 columns to 2, then to 1.

## 2. Visual identity

| Decision | Reason |
|----------|--------|
| **Deep navy (`#0c1a3d`) + blue (`#1d4ed8`)** as the primary colours | Blue signals trust and reliability, which matter most when buying IT services. |
| **Amber (`#fbbf24`) accent** | A warm complementary colour that draws attention to calls to action and key numbers without clashing with the blue. |
| **Plus Jakarta Sans** for headings, **Inter** for body text | A geometric, modern heading face gives personality. Inter is designed for screen readability at small sizes. |
| **Fluid type with `clamp()`** | Headings scale smoothly between phone and desktop with no extra breakpoints. |
| **One spacing and radius scale** (`--radius-sm/--radius/--radius-lg`, `--section`) | Keeps cards, buttons and sections visually consistent across all four pages. |

Every colour, font and size is defined once as a CSS custom property in `:root`, so a rebrand only touches one block of code.

## 3. Layout and responsiveness

- **Mobile-first CSS.** Base styles target small screens, and `min-width` media queries add columns as space grows. This keeps the mobile CSS simple and quick to load.
- **Breakpoints at 600px, 900px and 1200px.** These are based on where the content starts to look cramped, not on specific devices:
  - **600px**: 2-column card grids, 2-column form rows and a 4-column stats band
  - **900px**: the desktop navigation replaces the hamburger, split layouts appear (hero, story, contact), and 3-column grids
  - **1200px**: 4-column grids for the values and team cards
- **CSS Grid** handles the two-dimensional page layouts (card grids, footer columns, splits). **Flexbox** handles one-dimensional alignment (navigation, button rows, social icons).
- `width: min(100% - 2rem, 1180px)` on `.container` gives a 1rem gutter on phones and a capped line length on large screens.

## 4. Navigation

- The hamburger is a real `<button>` with `aria-controls` and `aria-expanded`, so screen readers announce its state.
- The menu slides in as a full-screen panel. This gives large touch targets (minimum 48px tall) and avoids cramped drop-downs.
- **Bug found and fixed during testing:** the header first used `backdrop-filter: blur()` for a frosted-glass effect. That property creates a new containing block, so the `position: fixed` mobile menu was sized to the 72px header instead of the viewport, and the menu was invisible. The header now uses a solid background, and the reason is explained in a CSS comment.
- `aria-current="page"` highlights the active page, and the same attribute styles it, so the visual and accessible states always match.

## 5. Contact form validation

- The form uses `novalidate` so JavaScript can show **inline, friendly messages** instead of inconsistent browser pop-ups. The HTML attributes (`required`, `type="email"`, `minlength`, `maxlength`) are kept as documentation and as a fallback.
- Validation runs **when a field loses focus** (the user has finished typing) and **while typing only after an error is shown**, so errors clear immediately once they are fixed without nagging the user mid-word.
- The rules live in a single `validators` object. Each function returns an error message or `""`, which makes rules easy to read, test and extend.
- Errors use `aria-invalid` and `aria-live="polite"` regions, so assistive technology announces them.
- On a successful submit, the confirmation message receives focus so keyboard and screen-reader users know the message was sent.

## 6. Performance

- All illustrations are **hand-written SVGs**, each under 4 KB. They stay sharp at any size and need no image optimisation pipeline.
- There is no CSS framework: one stylesheet of about 20 KB unminified and one script of about 5 KB.
- Fonts use `display=swap` and `preconnect`, so text is visible immediately.
- Below-the-fold images use `loading="lazy"`.

## 7. Why no Bootstrap or Tailwind?

The handbook lists them as optional. Writing the layout by hand shows a direct understanding of Grid, Flexbox and responsive design. It also keeps the page weight small and makes every style decision easy to explain in the review session.
