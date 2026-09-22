# Existing Design System

The landing page uses the existing visual language; this document records it without introducing new design decisions.

## Typography

The page loads DM Sans for interface and body text, DM Mono for labels and navigation details, and Playfair Display for editorial headings and artwork titles.

## Colors

The palette is defined in `css/base/variables.css`: ink and paper form the primary contrast, with peach, red, lime, and a translucent ink line used as accents.

## Spacing

Layout spacing is expressed with viewport-relative values, fixed compact controls, and responsive media-query adjustments already present in the page styles.

## Visual Principles

The existing design combines an editorial serif/sans pairing, restrained mono labels, framed artwork, thin rules, collage movement, and subtle paper grain. Reusable controls and navigation styles belong in component styles; landing-page composition belongs in `css/pages/home.css`.