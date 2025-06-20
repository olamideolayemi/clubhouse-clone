import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './pages/main';
import SignInPage from './pages/sign-in';
import RoomPage from './pages/room';
import { StreamCall } from '@stream-io/video-react-sdk';
import { useUser } from './user-context';

function App() {
  const { call } = useUser();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/room"
          element={call ?
            <StreamCall call={call}>
              <RoomPage />
            </StreamCall> : <Navigate to="/" />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  )
}

export default App
