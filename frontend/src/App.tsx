import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import MyProjects from './pages/MyProjects'
import Preview from './pages/Preview'
import Pricing from './pages/Pricing'
import View from './pages/View'
import Community from './pages/Community'
import Projects from './pages/Projects'
import Navbar from './components/Navbar'

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<MyProjects />} />
        <Route path="/projects/:projectId " element={<Projects />} />
        <Route path="/preview/:projectId" element={<Preview /> } />
        <Route path="/preview/:projectId/:versionId" element={<Preview /> } />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/view/:projectId" element={<View />} />
        <Route path="/community" element={<Community />} />
      </Routes> 
    </div>
  )
}

export default App
