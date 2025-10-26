# VIZOM Features Overview

## 🎨 Chart Type Selector

### Visual Card Grid
- **Responsive Grid Layout**: `grid-cols-2 md:grid-cols-3 lg:grid-cols-5`
- **5 Chart Types**: Bar, Line, Pie, Table, Dashboard
- **Interactive Cards** with:
  - Colored icons (blue, purple, green, orange, pink)
  - Hover effects with border color changes
  - Selected state with visual indicator (colored dot)
  - Focus states for accessibility
  - Smooth transitions

### Card Features
- **Icon + Title + Description** layout
- **Hover States**: Border changes to chart-specific color + shadow
- **Selected State**: Shows colored indicator dot in top-right corner
- **Click to Select**: Updates `currentChartType` variable

---

## 📝 Data Input Components

### Tabbed Interface
Three tabs for different input methods:
1. **Manual Input**
2. **Upload CSV**
3. **Examples**

### 1. Manual Input Tab

**Enhanced Textarea**:
- `border-2` with focus states
- `focus:border-blue-500` + `focus:ring-2 focus:ring-blue-200`
- Placeholder with example format
- Auto-resize with `resize-y`
- Real-time validation

**Input Validation**:
- ✅ **Success**: Green alert with checkmark icon
- ⚠️ **Warning**: Yellow alert with warning icon (< 10 chars)
- ❌ **Error**: Red alert with X icon (> 2000 chars)
- ℹ️ **Info**: Blue alert with info icon
- Auto-hide success messages after 3 seconds

**Keyboard Shortcuts**:
- `Ctrl + Enter`: Generate visual

---

### 2. CSV Upload Tab

**Drag-and-Drop Zone**:
- Dashed border with hover effects
- `hover:border-blue-500` + `hover:bg-blue-50`
- Upload icon (cloud with arrow)
- File size limit display (5MB max)
- Click to browse functionality

**Drag Events**:
- `dragover`: Highlights zone in blue
- `dragleave`: Removes highlight
- `drop`: Processes file

**File Validation**:
- ✅ File type check (`.csv` only)
- ✅ Size validation (5MB max)
- ✅ Error messages for invalid files

**CSV Parsing**:
- Reads file content
- Extracts headers and rows
- Displays file info card with:
  - File name
  - Row count
  - Column count
- Converts CSV to readable format
- Auto-populates textarea
- Shows first 10 rows as preview

**File Info Display**:
- Blue background alert
- Document icon
- File metadata

---

### 3. Examples Tab

**Pre-built Templates**:
Four clickable example cards:

1. **Monthly Sales** (Blue hover)
   - Bar chart with 6 months of data
   
2. **Website Traffic** (Purple hover)
   - Line chart showing growth trend
   
3. **Market Share** (Green hover)
   - Pie chart with percentages
   
4. **Product Performance** (Orange hover)
   - Table with sales metrics

**Card Features**:
- Title + description layout
- Border color changes on hover
- Background tint on hover
- Click to load example into textarea
- Auto-switches to Manual tab
- Shows success message

---

## 🎯 Export Format Selector

**2x2 Grid Layout**:
- PNG (default selected)
- PDF
- CSV
- SVG

**Button States**:
- **Selected**: Dark background + white text + thick border
- **Unselected**: Light border + hover effect
- Smooth transitions

---

## 🚀 Action Buttons

### Generate Button
- Full width
- Dark background with icon (lightning bolt)
- `focus:ring-4` for accessibility
- Disabled state during generation
- Loading spinner integration

### Download Button
- Full width
- Outlined style with icon (download arrow)
- Hover effects
- Focus ring

---

## 👁️ Preview Section

### Live Indicator
- Animated green dot (`animate-pulse`)
- "Live" label

### Loading State
- Spinner animation
- "Generating your visual…" message
- Centered layout

### Preview Container
- Minimum height: 500px
- Dashed border when empty
- Iframe-based rendering for isolation
- Sandbox attributes for security
- Empty state with:
  - Large chart icon
  - Instructional text
  - Subtle background color

---

## 🎨 Tailwind Utilities Used

### Layout
- `grid`, `grid-cols-*`, `gap-*`
- `flex`, `flex-col`, `items-center`, `justify-center`
- `space-y-*`, `space-x-*`
- `w-full`, `h-full`, `min-h-*`

### Spacing
- `p-*`, `px-*`, `py-*` (padding)
- `m-*`, `mt-*`, `mb-*` (margin)

### Borders & Shadows
- `border`, `border-2`, `border-dashed`
- `rounded-lg`, `rounded-xl`
- `shadow-sm`, `shadow-md`, `shadow-lg`

### Colors
- `bg-*-50/100/500/900` (backgrounds)
- `text-*-500/600/800/900` (text)
- `border-*-200/300/500` (borders)

### Interactive States
- `hover:*` (hover effects)
- `focus:*` (focus states)
- `group-hover:*` (parent hover effects)
- `transition-*` (smooth animations)

### Responsive
- `md:*` (tablet breakpoint)
- `lg:*` (desktop breakpoint)
- `sm:*` (small screens)

### Typography
- `text-sm`, `text-base`, `text-lg`
- `font-medium`, `font-semibold`, `font-bold`

### Visibility
- `hidden`, `block`, `flex`
- `opacity-*`

---

## 🔧 JavaScript Functionality

### Event Listeners
- ✅ Chart type card clicks
- ✅ Tab switching
- ✅ Format button selection
- ✅ File upload (click + drag-drop)
- ✅ Example template loading
- ✅ Generate button
- ✅ Download button
- ✅ Keyboard shortcuts
- ✅ Real-time input validation

### File Handling
- ✅ CSV file reading
- ✅ File validation (type + size)
- ✅ CSV parsing
- ✅ Data formatting
- ✅ Error handling

### Validation
- ✅ Input length checks
- ✅ File type validation
- ✅ File size validation
- ✅ Visual feedback (colored alerts)
- ✅ Auto-dismiss success messages

### State Management
- ✅ Selected chart type tracking
- ✅ Selected format tracking
- ✅ Generated HTML storage
- ✅ Loading state management

---

## 📱 Responsive Behavior

### Mobile (< 768px)
- Chart type grid: 2 columns
- Data input: Full width, stacked
- Preview: Full width below input
- Buttons: Full width, stacked

### Tablet (768px - 1024px)
- Chart type grid: 3 columns
- Data input: Full width
- Preview: Full width

### Desktop (> 1024px)
- Chart type grid: 5 columns
- Data input: 1/3 width (left)
- Preview: 2/3 width (right)
- Side-by-side layout

---

## 🎯 UX Enhancements

### Visual Feedback
- ✅ Hover effects on all interactive elements
- ✅ Focus rings for keyboard navigation
- ✅ Loading indicators
- ✅ Success/error messages
- ✅ Color-coded alerts
- ✅ Smooth transitions

### Accessibility
- ✅ Focus states with rings
- ✅ Semantic HTML
- ✅ ARIA-friendly structure
- ✅ Keyboard navigation support
- ✅ Clear visual indicators

### User Guidance
- ✅ Placeholder text with examples
- ✅ Empty state instructions
- ✅ File size limits displayed
- ✅ Validation messages
- ✅ Example templates
- ✅ Live preview indicator

---

## 🚀 Performance

- ✅ CSS compiled and minified
- ✅ Minimal JavaScript bundle
- ✅ Efficient event delegation
- ✅ Debounced validation
- ✅ Lazy iframe rendering
- ✅ Auto-cleanup of success messages

---

## 🔐 Security

- ✅ Iframe sandbox for preview
- ✅ File size limits
- ✅ File type validation
- ✅ Input sanitization
- ✅ API key protection guidance

---

## 📦 Components Summary

| Component | Tailwind Classes | Interactivity |
|-----------|-----------------|---------------|
| Chart Type Cards | `border-2`, `hover:border-*`, `group`, `transition-all` | Click to select |
| Data Tabs | `border-b-2`, `text-slate-900` | Click to switch |
| Textarea | `border-2`, `focus:border-blue-500`, `focus:ring-2` | Real-time validation |
| Drop Zone | `border-dashed`, `hover:bg-blue-50` | Drag-drop + click |
| Example Cards | `hover:border-*`, `hover:bg-*-50` | Click to load |
| Format Buttons | `border-2`, `bg-slate-900` (selected) | Click to select |
| Validation Alerts | `bg-*-50`, `border-*-200`, `text-*-800` | Auto-show/hide |
| Preview | `border-dashed`, `min-h-[500px]` | Iframe rendering |

---

## 🎨 Color Scheme

- **Primary**: Slate (900, 800, 700, 600, 500)
- **Chart Types**:
  - Bar: Blue (500, 100)
  - Line: Purple (500, 100)
  - Pie: Green (500, 100)
  - Table: Orange (500, 100)
  - Dashboard: Pink (500, 100)
- **Alerts**:
  - Success: Green (50, 200, 800)
  - Error: Red (50, 200, 800)
  - Warning: Yellow (50, 200, 800)
  - Info: Blue (50, 200, 800)

---

## ✨ Next Steps

To further enhance the UI:

1. **Add animations**: Use `@keyframes` for card reveals
2. **Dark mode**: Add dark mode toggle with Tailwind's `dark:` variant
3. **Tooltips**: Add hover tooltips for icons
4. **Progress bars**: Show upload/generation progress
5. **History**: Save recent generations
6. **Themes**: Allow custom color schemes
7. **Templates**: More example templates
8. **Export options**: More format options

---

Built with Tailwind CSS v4 + Modern JavaScript
