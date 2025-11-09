import './styles/styles.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from './store/store.ts'
import Pages from './pages/Pages.tsx'

createRoot(document.getElementById('root')!).render(<App />);

export default function App() {
  return (
    <StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <Pages />
        </BrowserRouter>
      </Provider>
    </StrictMode>
  )
}

