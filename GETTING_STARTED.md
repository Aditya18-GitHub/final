# Getting Started with Kanban Board Component

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Storybook**
   ```bash
   npm run storybook
   ```

3. **Open Browser**
   Navigate to http://localhost:6006

## Development Workflow

### Type Checking
```bash
npm run type-check
```

### Build for Production
```bash
npm run build
```

### Testing the Component

All functionality is demonstrated through Storybook stories. Open Storybook and navigate through:

1. **Default** - See the component with sample data
2. **Empty State** - View empty board
3. **With Many Tasks** - Test performance with 30+ tasks
4. **Interactive Demo** - Try drag-and-drop
5. **Mobile View** - Test responsive design
6. **Accessibility** - Test keyboard navigation

## Key Features to Test

### Drag and Drop
- Click and drag any task card between columns
- Visual feedback during drag
- Task position updates automatically

### Task Management
- Click "Add Task" at the bottom of any column
- Fill in the task details
- Click on existing tasks to edit them
- Delete tasks using the delete button

### Keyboard Navigation
- Use Tab to navigate between elements
- Space/Enter to activate buttons
- Arrow keys to navigate within lists
- Delete key to remove tasks
- Escape to close modals

### Responsive Design
- Resize browser window to see responsive behavior
- On mobile, columns stack vertically
- Touch-friendly interactions

## Project Structure

```
src/
├── components/
│   ├── KanbanBoard/       # Main board component and stories
│   └── primitives/         # Reusable UI components
├── hooks/                  # Custom React hooks
├── utils/                  # Utility functions
└── styles/                 # Global CSS
```

## Customization

The component uses Tailwind CSS for styling. To customize:

1. Edit `tailwind.config.js` for design tokens
2. Modify component files for behavior changes
3. Add new stories in `.stories.tsx` files

## Next Steps

1. Deploy Storybook to Chromatic, Vercel, or Netlify
2. Update README with deployed Storybook URL
3. Test all features thoroughly
4. Prepare your submission
