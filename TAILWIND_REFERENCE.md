# Tailwind CSS Quick Reference for VIZOM

## Card Components

### Chart Type Card
```html
<button class="chart-type-card group relative p-4 rounded-lg border-2 border-slate-200 
               hover:border-blue-500 hover:shadow-md transition-all duration-200 
               text-left focus:outline-none focus:ring-2 focus:ring-blue-500">
  <!-- Content -->
</button>
```

**Key Classes**:
- `group`: Enables group-hover effects on children
- `relative`: For absolute positioning of indicator
- `border-2`: Thicker border for emphasis
- `hover:border-blue-500`: Color change on hover
- `hover:shadow-md`: Elevation on hover
- `transition-all duration-200`: Smooth animations
- `focus:ring-2`: Accessibility focus indicator

### Icon Container (with group-hover)
```html
<div class="w-12 h-12 rounded-lg bg-blue-100 group-hover:bg-blue-500 
            flex items-center justify-center transition-colors">
  <svg class="w-6 h-6 text-blue-600 group-hover:text-white">
    <!-- Icon -->
  </svg>
</div>
```

**Pattern**: Icon background and color change together on parent hover

---

## Form Components

### Enhanced Textarea
```html
<textarea class="w-full h-64 rounded-lg border-2 border-slate-200 
                 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                 focus:outline-none p-3 resize-y transition-colors">
</textarea>
```

**Key Classes**:
- `border-2`: Prominent border
- `focus:border-blue-500`: Border color on focus
- `focus:ring-2 focus:ring-blue-200`: Outer glow effect
- `focus:outline-none`: Remove default outline
- `transition-colors`: Smooth color transitions

### File Upload Drop Zone
```html
<div class="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center 
            hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
  <!-- Upload UI -->
</div>
```

**Key Classes**:
- `border-dashed`: Dashed border style
- `hover:bg-blue-50`: Subtle background tint
- `cursor-pointer`: Indicates clickability

---

## Alert/Validation Messages

### Success Alert
```html
<div class="mt-2 p-3 rounded-lg border bg-green-50 border-green-200 text-green-800">
  <div class="flex items-center gap-2">
    <svg class="w-5 h-5"><!-- Icon --></svg>
    <span class="text-sm font-medium">Message</span>
  </div>
</div>
```

### Error Alert
```html
<div class="mt-2 p-3 rounded-lg border bg-red-50 border-red-200 text-red-800">
  <!-- Content -->
</div>
```

### Warning Alert
```html
<div class="mt-2 p-3 rounded-lg border bg-yellow-50 border-yellow-200 text-yellow-800">
  <!-- Content -->
</div>
```

**Pattern**: `bg-{color}-50` + `border-{color}-200` + `text-{color}-800`

---

## Button Styles

### Primary Button
```html
<button class="w-full inline-flex items-center justify-center px-4 py-3 
               rounded-lg bg-slate-900 text-white font-medium 
               hover:bg-slate-800 focus:ring-4 focus:ring-slate-300 
               transition-all shadow-sm">
  <svg class="w-5 h-5 mr-2"><!-- Icon --></svg>
  Generate Visual
</button>
```

### Secondary Button (Outlined)
```html
<button class="w-full inline-flex items-center justify-center px-4 py-3 
               rounded-lg border-2 border-slate-300 text-slate-900 font-medium 
               hover:bg-slate-50 focus:ring-4 focus:ring-slate-200 transition-all">
  Download
</button>
```

### Format Button (Toggle)
```html
<!-- Selected -->
<button class="px-3 py-2 rounded-lg border-2 border-slate-900 
               bg-slate-900 text-white hover:bg-slate-800 
               transition-colors text-sm font-medium">
  PNG
</button>

<!-- Unselected -->
<button class="px-3 py-2 rounded-lg border-2 border-slate-200 
               hover:border-slate-300 transition-colors text-sm font-medium">
  PDF
</button>
```

---

## Grid Layouts

### Responsive Chart Type Grid
```html
<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
  <!-- Cards -->
</div>
```

**Breakpoints**:
- Mobile: 2 columns
- Tablet (md): 3 columns
- Desktop (lg): 5 columns

### Data Input + Preview Layout
```html
<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <section class="lg:col-span-1"><!-- Input (1/3) --></section>
  <section class="lg:col-span-2"><!-- Preview (2/3) --></section>
</div>
```

### Export Format Grid
```html
<div class="grid grid-cols-2 gap-2">
  <!-- 2x2 grid of format buttons -->
</div>
```

---

## Tab Navigation

### Tab Bar
```html
<div class="flex border-b mb-4">
  <!-- Active Tab -->
  <button class="data-tab px-4 py-2 text-sm font-medium 
                 border-b-2 border-slate-900 text-slate-900">
    Manual
  </button>
  
  <!-- Inactive Tab -->
  <button class="data-tab px-4 py-2 text-sm font-medium 
                 text-slate-500 hover:text-slate-700">
    Upload CSV
  </button>
</div>
```

**Pattern**: Active tab has `border-b-2` + darker text

---

## Loading States

### Spinner
```html
<div class="flex items-center justify-center gap-3 text-slate-600 p-8">
  <svg class="animate-spin h-6 w-6 text-slate-600" viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" 
            stroke="currentColor" stroke-width="4" fill="none"></circle>
    <path class="opacity-75" fill="currentColor" 
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
  </svg>
  <span class="font-medium">Generating your visual…</span>
</div>
```

**Key**: `animate-spin` utility for rotation

### Live Indicator
```html
<div class="flex items-center gap-2">
  <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
  <span class="text-xs text-slate-500">Live</span>
</div>
```

**Key**: `animate-pulse` for breathing effect

---

## Empty States

### Preview Empty State
```html
<div class="min-h-[500px] rounded-lg border-2 border-dashed border-slate-300 
            flex items-center justify-center text-slate-400 bg-slate-50">
  <div class="text-center p-8">
    <svg class="mx-auto h-16 w-16 text-slate-300 mb-4"><!-- Icon --></svg>
    <div class="text-sm font-medium text-slate-600">Title</div>
    <div class="text-xs text-slate-500 mt-1">Description</div>
  </div>
</div>
```

**Pattern**: Dashed border + centered content + muted colors

---

## Hover Effect Patterns

### Border Color Change
```css
border-slate-200 hover:border-blue-500
```

### Background Tint
```css
hover:bg-blue-50
```

### Shadow Elevation
```css
hover:shadow-md
```

### Combined Hover
```css
hover:border-blue-500 hover:bg-blue-50 hover:shadow-md transition-all
```

---

## Focus States (Accessibility)

### Ring Focus
```css
focus:outline-none focus:ring-2 focus:ring-blue-500
```

### Ring with Offset
```css
focus:ring-4 focus:ring-slate-300
```

**Pattern**: Always include focus states for keyboard navigation

---

## Transition Utilities

### All Properties
```css
transition-all duration-200
```

### Specific Properties
```css
transition-colors    /* background, border, text colors */
transition-transform /* scale, rotate, translate */
transition-opacity   /* opacity changes */
```

**Best Practice**: Use specific transitions for better performance

---

## Responsive Utilities

### Breakpoint Prefixes
- `sm:` - 640px and up
- `md:` - 768px and up
- `lg:` - 1024px and up
- `xl:` - 1280px and up

### Common Responsive Patterns
```html
<!-- Stack on mobile, side-by-side on desktop -->
<div class="flex flex-col md:flex-row gap-4">

<!-- Hide on mobile, show on desktop -->
<div class="hidden md:block">

<!-- Full width on mobile, 1/3 on desktop -->
<div class="w-full lg:w-1/3">

<!-- 2 cols mobile, 4 cols desktop -->
<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
```

---

## Color Palette Used

### Slate (Primary)
- `slate-50` - Backgrounds
- `slate-200` - Borders (default)
- `slate-300` - Borders (hover)
- `slate-500` - Text (muted)
- `slate-600` - Text (secondary)
- `slate-700` - Text (hover)
- `slate-800` - Backgrounds (hover)
- `slate-900` - Backgrounds (primary), Text (primary)

### Semantic Colors
- **Blue**: Info, primary actions
- **Green**: Success
- **Red**: Error
- **Yellow**: Warning
- **Purple**: Line charts
- **Orange**: Tables
- **Pink**: Dashboards

---

## Spacing Scale

### Padding/Margin
- `p-2` = 0.5rem (8px)
- `p-3` = 0.75rem (12px)
- `p-4` = 1rem (16px)
- `p-6` = 1.5rem (24px)
- `p-8` = 2rem (32px)

### Gap
- `gap-2` = 0.5rem
- `gap-3` = 0.75rem
- `gap-4` = 1rem
- `gap-6` = 1.5rem

---

## Common Combinations

### Card
```css
bg-white rounded-xl shadow-sm border p-6
```

### Section Container
```css
max-w-7xl mx-auto px-6 py-8
```

### Icon + Text
```css
flex items-center gap-2
```

### Centered Content
```css
flex items-center justify-center
```

### Full Width Button
```css
w-full inline-flex items-center justify-center px-4 py-3
```

---

## Pro Tips

1. **Use `group` for parent-child hover effects**
   ```html
   <div class="group">
     <div class="group-hover:bg-blue-500">Child changes on parent hover</div>
   </div>
   ```

2. **Combine focus states with rings**
   ```css
   focus:outline-none focus:ring-2 focus:ring-blue-500
   ```

3. **Use arbitrary values for custom sizes**
   ```css
   h-[420px]  /* Custom height */
   min-h-[500px]  /* Custom min-height */
   ```

4. **Stack utilities for complex effects**
   ```css
   hover:border-blue-500 hover:bg-blue-50 hover:shadow-md transition-all
   ```

5. **Use `transition-all` sparingly**
   - Prefer specific transitions (`transition-colors`) for performance
   - Use `transition-all` only when multiple properties change

---

## Debugging Tips

1. **Border debugging**: Add `border border-red-500` to see element boundaries
2. **Background debugging**: Add `bg-red-100` to see spacing
3. **Use browser DevTools**: Inspect computed Tailwind classes
4. **Check responsive**: Use DevTools device toolbar

---

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind Play](https://play.tailwindcss.com) - Online playground
- [Heroicons](https://heroicons.com) - SVG icons used in VIZOM
- [Tailwind UI](https://tailwindui.com) - Premium components

---

Built for VIZOM - AI Visual Builder
