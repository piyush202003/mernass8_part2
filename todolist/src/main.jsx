import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import Header from './pages/header.jsx'
import Footer from './pages/footer.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Footer />
  </StrictMode>,
)
