# Quick Start Guide

## Run the Project Locally

### Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required dependencies including:
- React and React DOM
- TypeScript
- Tailwind CSS
- Storybook
- Vite
- And other required packages

### Step 2: Start Storybook

```bash
npm run storybook
```

This command will:
- Build Storybook
- Start a local development server
- Open your default browser to `http://localhost:6006`

### Step 3: Explore the Stories

Once Storybook is running, you'll see:
- **Default** - Basic kanban board with sample data
- **Empty State** - Board with no tasks
- **With Many Tasks** - Performance demonstration with 30+ tasks
- **Different Priorities** - Priority visualization
- **Interactive Demo** - Try drag-and-drop!
- **Mobile View** - Responsive design demonstration
- **Accessibility** - Keyboard navigation demo
- **With WIP Limits** - Work-in-progress limits

## Other Useful Commands

### Type Checking
```bash
npm run type-check
```

### Build Production Bundle
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## What You Can Do in Storybook

1. **Drag and Drop**: Click and drag any task card between columns
2. **Create Tasks**: Click "Add Task" at the bottom of any column
3. **Edit Tasks**: Click on any task card to edit it
4. **Delete Tasks**: Click the delete icon on any task
5. **Keyboard Navigation**: Use keyboard to interact with all features
6. **Test Responsive**: Resize your browser to see mobile view

## Troubleshooting

### Port Already in Use
If port 6006 is already in use:
```bash
# Storybook will ask if you want to use a different port
# Type 'Y' and press Enter
```

### Installation Errors
If you encounter errors during installation:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### TypeScript Errors
If you see TypeScript errors:
```bash
npm run type-check
```

## Next Steps After Running

1. Test all interactive features
2. Explore different stories
3. Try creating and editing tasks
4. Test keyboard navigation
5. Deploy to Chromatic/Vercel/Netlify for production

## Need Help?

- Check the main README.md for detailed documentation
- Review the code comments in components
- Check Storybook controls and actions panels

