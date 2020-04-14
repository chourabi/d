import React from 'react';
import logo from './logo.svg';
import './App.css';
import Booking from './pages/Booking';
import Login from './pages/Login';
import NavBar from './components/Navbar';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import Signup from './pages/Signup';
import firebase from './firebase';

class App extends React.Component {
  
  constructor(props){
    super(props);
  }


  componentDidMount(){
    firebase.auth().onAuthStateChanged((data)=>{
      if (data===null) {
        this.props.history.push('/home');
      }
    })
  }


  render(){
    return (
    
          
      <Router>
      

    <Switch>
      
      <Route path="/home" component={Booking} />
      <Route path="/signup" component={Signup} />
      <Route path="/login" component={Login} />
      <Route path="/" component={Login} />
      
    </Switch>
</Router>

);
  }

}

export default App;
