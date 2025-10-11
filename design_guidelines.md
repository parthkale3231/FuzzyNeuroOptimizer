# FNEEO Design Guidelines

## Design Approach
**Hybrid Strategy**: Combining Linear's clean minimalism with modern environmental tech aesthetics. Drawing inspiration from advanced monitoring dashboards (Grafana, Datadog) for data visualization sections, while maintaining landing page elegance found in cutting-edge tech products.

**Core Principles**: 
- Scientific credibility through clean, precise design
- Environmental consciousness via natural color metaphors
- Real-time system visibility through strategic data visualization
- Accessibility and clarity for complex information

---

## Color Palette

### Dark Mode (Primary)
- **Background Base**: 222 15% 8%
- **Surface Elevated**: 222 12% 12%
- **Primary (Environmental Green)**: 142 76% 45% - represents ecological balance
- **Secondary (Neural Blue)**: 217 91% 60% - represents AI/neural networks
- **Accent (Energy Amber)**: 38 92% 50% - for alerts, energy indicators
- **Text Primary**: 210 40% 98%
- **Text Secondary**: 215 20% 65%
- **Border Subtle**: 217 10% 20%

### Light Mode
- **Background Base**: 210 40% 98%
- **Surface Elevated**: 0 0% 100%
- **Primary**: 142 71% 35%
- **Secondary**: 217 91% 45%
- **Accent**: 38 92% 40%
- **Text Primary**: 222 15% 10%
- **Text Secondary**: 215 15% 40%

---

## Typography

**Fonts**: 
- Primary: 'Inter' (Google Fonts) - UI elements, body text
- Display: 'Space Grotesk' (Google Fonts) - headings, hero sections
- Mono: 'JetBrains Mono' (Google Fonts) - data displays, code snippets

**Scale**:
- Hero Display: text-6xl md:text-7xl lg:text-8xl, font-bold
- Section Headings: text-3xl md:text-4xl lg:text-5xl, font-semibold
- Subsection: text-xl md:text-2xl, font-medium
- Body: text-base md:text-lg, font-normal
- Small/Captions: text-sm, font-normal
- Data Labels: text-xs font-mono, uppercase tracking-wide

---

## Layout System

**Spacing Primitives**: Use tailwind units of 2, 4, 8, 12, 16, 24
- Micro spacing: p-2, gap-2
- Component internal: p-4, gap-4
- Component external: m-8, gap-8
- Section padding: py-12 md:py-24
- Container gaps: gap-12 md:gap-16

**Grid Structure**:
- Container: max-w-7xl mx-auto px-4 md:px-8
- Dashboard grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Feature sections: grid-cols-1 md:grid-cols-2 lg:grid-cols-3

---

## Component Library

### Navigation
- Sticky top navigation with glass morphism effect (backdrop-blur-xl)
- Logo left, nav center, CTA right on desktop
- Hamburger menu for mobile with slide-out drawer

### Hero Section
- **Layout**: Asymmetric split - 60% content, 40% visual
- **Content**: Large headline with gradient text (green to blue), descriptive subheading, dual CTAs (primary + secondary outline)
- **Visual**: Animated abstract visualization of interconnected nodes representing the FNEEO system layers (fuzzy/neuro/genetic)
- **Background**: Subtle grid pattern with radial gradient overlay

### Feature Cards
- Glass-morphic cards (bg-white/5 backdrop-blur-md border border-white/10)
- Icon area with gradient background (32x32 icon placeholder)
- Title (text-xl font-semibold), description (text-sm text-secondary)
- Hover state: subtle scale and border color shift

### Dashboard Components
- **Metric Cards**: Large number display with trend indicators, mini sparkline graphs
- **Real-time Visualization**: Line charts for temporal data, radial gauges for current status
- **System Architecture Diagram**: Interactive node-based visualization showing data flow
- **Alert Panel**: Color-coded status indicators (green/amber/red) with severity levels

### Data Visualization
- Use Chart.js for line/bar charts with custom theming
- Gradient fills for area charts (primary color to transparent)
- Animated transitions on data updates
- Tooltips with detailed breakdowns

### CTA Sections
- Full-width gradient backgrounds (subtle, primary to secondary)
- Centered content with max-w-4xl
- Large headline + supporting text + prominent button
- Optional: floating mockup image or icon set

### Footer
- Three-column layout: Brand/description, Quick Links, Newsletter signup
- Social icons with hover color transitions
- Copyright and legal links at bottom
- Subtle top border with gradient

---

## Images

### Hero Section
**Image**: Abstract 3D render of a futuristic city with overlaid data visualization layers - showing environmental sensors, traffic flow, energy grids interconnected. Style: dark, techy, with green/blue accent lighting.
- Placement: Right 40% of hero, extends slightly beyond viewport
- Treatment: Subtle motion parallax on scroll

### System Architecture Section  
**Image**: Layered diagram illustration showing the 5 layers (Input → Fuzzy → Neuro → Genetic → Output) as stacked, semi-transparent planes with data flowing through
- Placement: Center of dedicated section
- Treatment: Interactive hover reveals layer details

### Real-World Impact Section
**Image**: Split-screen showing "before/after" smart city visualization - polluted/hot city vs optimized green city
- Placement: Background image with overlay content
- Treatment: Scroll-triggered transition animation

### Use Case Scenario
**Image**: Isometric city block illustration showing FNEEO interventions (mist systems, traffic rerouting, air purifiers) in action
- Placement: Side-by-side with scenario description
- Treatment: Annotated callouts on hover

---

## Interactions & Animation

**Minimal Animation Strategy**:
- Fade-in on scroll for section entries (duration-500)
- Subtle hover transforms on cards (scale-105)
- Data visualization smooth transitions (duration-700)
- Loading states: skeleton screens with shimmer effect
- Page transitions: fade (duration-300)

**NO**: Excessive parallax, continuous background animations, distracting particle effects

---

## Accessibility

- Maintain WCAG AA contrast ratios minimum
- All interactive elements 44px minimum touch target
- Focus indicators with 2px offset ring in primary color
- Dark mode throughout with proper color adjustments for form inputs
- Semantic HTML structure with proper heading hierarchy
- Alt text for all decorative and informational images