import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-neutral-900 mb-4">Kanban Component Library</h1>
        <p className="text-neutral-600">Run `npm run storybook` to see the component stories</p>
      </div>
    </div>
  </React.StrictMode>,
)
