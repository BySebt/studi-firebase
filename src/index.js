import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import './assets/css/tailwind.output.css'
import App from './App'
import { SidebarProvider } from './utils/context/SidebarContext'
import LoadingPage from './components/Misc/LoadingPage'
import { Windmill } from '@windmill/react-ui'
import {AuthProvider} from "./auth";
import { ChakraProvider } from "@chakra-ui/react"
import { extendTheme } from "@chakra-ui/react"

// 2. Call `extendTheme` and pass your custom values
const theme = extendTheme({
    colors: {
        studyi: {
            100: "#EDE9FE",
            200: "#DDD6FE",
            300: "#C4B5FD",
            400: "#A78BFA",
            500: "#8B5CF6",
            600: "#7C3AED",
            700: "#6D28D9",
            800: "#5B21B6",
            900: "#4C1D95",
        },

        gray: {
            100: "#F3F4F6",
            200: "#E5E7EB",
            300: "#D1D5DB",
            400: "#9CA3AF",
            500: "#6B7280",
            600: "#4B5563",
            700: "#374151",
            800: "#1A1C23",
            900: "#111827",
        },
    },
})


ReactDOM.render(
  <SidebarProvider>
    <Suspense fallback={<LoadingPage />}>
        <ChakraProvider theme={theme}>
            <Windmill usePreferences>
                <AuthProvider >
                    <App />
                </AuthProvider>
            </Windmill>
        </ChakraProvider>
    </Suspense>
  </SidebarProvider>,
  document.getElementById('root')
)
