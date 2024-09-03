import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { AppRoutes } from './routes/AppRoutes';
import { TrioContextProvider } from './context/TrioContextProvider';
import { Container } from 'react-bootstrap';

function App() {

  return (
      <TrioContextProvider>
        <AppRoutes/>
      </TrioContextProvider>
  )
}

export default App
