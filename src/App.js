import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { Toaster } from 'react-hot-toast';
import { ApiProvider } from './context/AuthContext';
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Category = lazy(() => import("./pages/Category"));
const Header = lazy(() => import("./components/Header"));

function App() {
  return (
    <ApiProvider>
      <div className="App">
        <Toaster
          position="bottom-right"
          reverseOrder={false}
        />
        <Header />
        <div className='main'>
          <Suspense fallback={<div style={{ textAlign: "center", fontWeight: "bold" }}>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/category" element={<Category />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </ApiProvider>
  );
}

export default App;
