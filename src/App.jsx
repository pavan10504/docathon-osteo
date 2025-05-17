import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './pages/home'
import Comorbidity from './pages/comorbidity'
import DrugResponse from './pages/drug_response'
import Landing from './pages/landing'
import Osteo from './pages/osteo'
import Chat from './pages/chat'
export default function App() {
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Landing/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/osteo" element={<Osteo/>} />
        <Route path="/comorbidity" element={<Comorbidity/>} />
        <Route path='/chat' element={<Chat/>} />
        <Route path="/response" element={<DrugResponse/>} />
      </Routes>
    </Router>
  )
}

