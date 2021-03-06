import React from 'react';
import  firebase  from '../firebase';
import NavBar from '../components/Navbar';

class Login extends React.Component {

    constructor(props){
        super(props);
        this.state={
            email:'',
            password:'',
            errorMessage:''
        }

        this.connectUser=this.connectUser.bind(this);
        this.emailChange=this.emailChange.bind(this);
        this.passwordChange=this.passwordChange.bind(this);
        
    }

    emailChange(e){
        this.setState({
            email:e.target.value
        })
    }

    passwordChange(e){
        this.setState({
            password:e.target.value
        })
    }


    componentDidUpdate(){
        /*firebase.auth().onAuthStateChanged((data)=>{
            this.props.history.push('/home');
        })*/
    }
    

    connectUser(e){
        firebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password).then((data)=>{
            if (data.user) {
                this.props.history.push('/home');
            }
            
        }).catch((error)=>{
            console.log(error);
            
            this.setState({
                errorMessage:error.message
            })
        })
    } 

    render(){
        return (
            <div className="App">
                <NavBar/>
              <div className="my-5 container">
                <div className="my-5">
                    <div className="card " style={{width:350,margin:'auto'}}>
                    
                       <div className="card-body">
                           <h3>Login</h3>
                        <div className="form-group">
                                <label >Email address</label>
                                <input onChange={ (event)=>this.emailChange(event)} value={this.state.email} type="email" class="form-control" aria-describedby="emailHelp" placeholder="Enter email" />
                                <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                            </div>
                            <div className="form-group">
                                <label >Password</label>
                                <input  onChange={ (event)=>this.passwordChange(event)} value={this.state.password} type="password" class="form-control"  placeholder="Password" />
                            </div>
                            <div className="my-2">
                                <p>You don't have an account ? sign up now.</p>
                            </div>

                            {
                                this.state.errorMessage !== '' ?
                                <div className="form-group">
                                    <div className="alert alert-danger">{this.state.errorMessage}</div>
                                </div>
                                :
                                <div></div>
                            
                            }
                            <button disabled={ this.state.email === '' || this.state.password ==='' } onClick={ (event)=>this.connectUser(event) } type="submit" class="btn btn-primary">Submit</button>
                            
                       </div>
                      
        
                    </div>
                </div>
              </div>
            </div>
          );
    }
}

export default Login;
