import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import './assets/css/tailwind.output.css'
import App from './App'
import { SidebarProvider } from './utils/context/SidebarContext'
import LoadingPage from './components/Misc/LoadingPage'
import { Windmill } from '@windmill/react-ui'

ReactDOM.render(
  <SidebarProvider>
    <Suspense fallback={<LoadingPage />}>
      <Windmill usePreferences>
        <App />
      </Windmill>
    </Suspense>
  </SidebarProvider>,
  document.getElementById('root')
)
