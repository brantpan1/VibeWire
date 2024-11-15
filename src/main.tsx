import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Home from './Home.tsx'
import { Settings } from 'lucide-react'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <Home />    //for some reason this is throwing a blank screen when I add it in*/}
    <App />
    <Settings />
  </StrictMode>,
)
