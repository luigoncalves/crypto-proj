import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import Search from './pages/Search';

function App() {
  return (
    <div>
      <Navbar />

      <div
        style={{
          paddingTop: '70px',
          minHeight: '100vh',
          height: 'min-content',
        }}
      >
        <Routes>
          <Route path='/' element={<HomePage />} />

          {/* <Route path='crypto/:cryptoTicker' element={<CryptoPage />} /> */}

          <Route path='/search/:field' element={<Search />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
