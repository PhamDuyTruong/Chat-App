import './App.css';
import Login from './Components/Login';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import ChatRoom from './Components/ChatRoom';
import AuthProvider from './Context/AuthProvider';
import AppProvider from './Context/AppProvider';
import AddRoomModal from './Components/Modals/AddRoomModal';
import InviteMember from './Components/Modals/InviteMember';

function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <AppProvider>
      <Switch>  
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact  path="/">
          <ChatRoom />
        </Route>
      </Switch>
      <AddRoomModal />
      <InviteMember />
      </AppProvider>
    </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
