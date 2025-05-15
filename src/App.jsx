import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './pages/home'
export default function App() {
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/comorbiditiy" element={<h1>Comorbidity</h1>} />
        <Route path="/response" element={<h1>Response</h1>} />
      </Routes>
    </Router>
  )
}

