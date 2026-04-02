# Design System Document: Editorial Luminescence

## 1. Overview & Creative North Star

**Creative North Star: "The Ethereal Explorer"**

This design system is engineered to feel less like a utility and more like a high-end digital concierge. We are moving away from the "boxed-in" constraints of traditional SaaS templates. Instead, we embrace **Soft Minimalism**—a philosophy that prioritizes breathing room, cinematic depth, and a high-contrast editorial hierarchy.

To break the "template" look, designers must employ intentional asymmetry. Large-scale typography should overlap semi-transparent containers, and imagery should bleed off the grid. This system doesn't just present information; it curates an immersive environment through tonal layering and glassmorphism.

---

## 2. Colors

Our palette is a study in high-contrast luxury, balancing the clinical freshness of Ice White with the technological vibration of Electric Cyan and Acid Lime.

### The Palette (Material Foundation)
*   **Primary (Electric Cyan - #006875 / #0ED2E9):** Our digital pulse. Used for high-level brand moments and interactive highlights.
*   **Secondary (Acid Lime - #536600 / #C1EA00):** Reserved strictly for high-visibility CTAs. It is a "look at me" color that demands action.
*   **Surface (Ice White - #F0FCFE):** The canvas. A cool-toned, premium white that prevents ocular fatigue.
*   **Deep Contrast (Deep Slate #285056 & Dark Navy #221E2A):** Used for grounding elements, sophisticated backgrounds, and primary text.

### The "No-Line" Rule
**Explicit Instruction:** Prohibit the use of 1px solid borders for sectioning or grouping content. In this design system, boundaries are invisible. Use background color shifts (e.g., a `surface-container-low` section sitting on a `surface` background) or vertical whitespace to define areas.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of frosted glass.
*   **Base:** `surface` (#F0FCFE)
*   **Nesting:** Place `surface-container-lowest` (#FFFFFF) elements on top of `surface-container` (#E4F0F2) sections to create a soft, natural lift.

### The "Glass & Gradient" Rule
Floating elements (modals, navigation bars, hover cards) must use **Glassmorphism**. Apply a semi-transparent `surface` color with a `backdrop-blur` of 12px–20px. For main CTAs or Hero backgrounds, use a subtle linear gradient from `primary` (#006875) to `primary-container` (#0ED2E9) to provide "soul" and depth.

---

## 3. Typography

The typography scale is designed to feel like a high-fashion magazine: authoritative, yet approachable.

*   **Headers (Arista 2.0 / Alternate):** These are our "signature" moments. The rounded terminals feel friendly, but when set with generous tracking (letter-spacing) and large scales (`display-lg`), they feel premium. Use these for all headlines.
*   **Body & Labels (Arista 2.0 Alternate Light):** A thin, sophisticated weight that maintains legibility while feeling "airy." Use for all long-form text and UI labels.

**Editorial Hierarchy:**
*   **Display Large (3.5rem):** Reserved for Hero statements.
*   **Headline Medium (1.75rem):** For section headers.
*   **Title Medium (1.125rem):** For card titles and prominent labels.
*   **Body Medium (0.875rem):** The workhorse for all general content.

---

## 4. Elevation & Depth

We eschew drop shadows in favor of **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by "stacking" surface-container tiers. A `surface-container-highest` element feels closer to the user than a `surface-container-low` element.
*   **Ambient Shadows:** If a "floating" effect is required, shadows must be extra-diffused.
    *   *Blur:* 40px–60px.
    *   *Opacity:* 4%–8%.
    *   *Color:* Use a tinted version of `on-surface` (#121D1F) rather than pure black.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline-variant` token at **10% opacity**. 100% opaque borders are forbidden.
*   **Glassmorphism Depth:** When using glass containers, the background colors and shapes should bleed through slightly. This integrates the component into the environment rather than making it look "pasted on."

---

## 5. Components

### Buttons
*   **Primary (Action):** `secondary_container` (Acid Lime). Rounded-full. Use for "Book Now" or "Submit."
*   **Secondary (Brand):** `primary_container` (Electric Cyan). Glass effect or solid.
*   **Tertiary (Ghost):** No background. Arista 2.0 Alternate Light. Subtle `outline-variant` (10% opacity) on hover.

### Input Fields
*   **Style:** Minimalist. No bottom line or box. Use a `surface-container-high` background with `rounded-md` (0.75rem).
*   **States:** On focus, the background shifts to `surface-container-highest` with a subtle Electric Cyan "Ghost Border."

### Cards & Lists
*   **Strict Rule:** No divider lines. Separate list items using `spacing-4` (1.4rem) of vertical white space.
*   **Card Style:** Use `surface-container-lowest` for the card body. Use Glassmorphism for card overlays.

### Navigation Bar
*   **Execution:** A floating "Island" layout. Use a 20px `backdrop-blur` with a 15% opaque Ice White background. Thin Ghost Border (10%) for definition.

---

## 6. Do's and Don'ts

### Do
*   **DO** use extreme whitespace. If you think there is enough space, add 20% more.
*   **DO** overlap typography over images or glass containers to create an editorial feel.
*   **DO** use the `secondary` Acid Lime sparingly—only for the most important conversion point on the screen.
*   **DO** ensure all glassmorphic containers have sufficient backdrop blur to maintain text readability.

### Don't
*   **DON'T** use 1px solid black or grey borders. They kill the premium feel instantly.
*   **DON'T** use standard "Drop Shadows." If the element doesn't feel like it's glowing or softly floating, the shadow is too heavy.
*   **DON'T** crowd the edges. Keep content centered or intentionally offset to one side.
*   **DON'T** mix rounded corner values. Stick strictly to the `lg` (1rem) for containers and `full` for interactive pills.

---
*Director's Note: This design system is about the "breath" between the elements. Trust the white space; let the Electric Cyan be the light that guides the user through the Ice White landscape.*