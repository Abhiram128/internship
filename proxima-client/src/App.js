import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProjectForm from './components/ProjectForm';
import { useAuthContext } from "./hooks/useAuthContext";

function App() {
  const { user } = useAuthContext();

  return (
    <div className='app bg-slate-900 text-slate-100 min-h-screen'>
      <Navbar />
      <Routes>
        <Route path='/' element={user ? <Home /> : <Navigate to='login' />} />
        <Route path='/login' element={!user ? <Login /> : <Navigate to='/' />} />
        <Route path='/signup' element={!user ? <Signup /> : <Navigate to='/' />} />
        {/* Add the new Route for ProjectForm */}
        <Route path='/projectform' element={user ? <ProjectForm /> : <Navigate to='login' />} />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
