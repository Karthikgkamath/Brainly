import './App.css'
import { DashBoard } from './pages/dashboard'
import { SignUp } from './pages/signup';
import {SignIn} from './pages/signin'
import { SharePage } from './pages/sharePage';
import { BrowserRouter,Routes,Route,Navigate } from 'react-router-dom';
function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/signup' replace/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/signin' element={<SignIn/>}/>
        <Route path='/dashboard' element={<DashBoard/>}/>
        <Route path='/share/:shareLink' element={<SharePage/>}/>
      </Routes>
    </BrowserRouter>
  )
}
export default App;