
import React from 'react';
import { Link } from 'react-router-dom';
import firebase from '../firebase';

export default class NavBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fullname: '',
            isConnecetd: false
        }

        this.logout=this.logout.bind(this);

    }

    componentDidMount() {
        
        firebase.auth().onAuthStateChanged((data) => {
            if (data !== null) {
                console.log(data.email);
            
            this.setState({
                fullname: data.email,
                isConnecetd: true
            })
            }
        })
    }

    logout(){
        // eslint-disable-next-line no-restricted-globals
        if (confirm('DO YOU REALLY WANNA LOG OUT ?')) {
            firebase.auth().signOut();
            this.setState({
                isConnecetd:false
            })
        }
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div className="navbar-brand" >Booking</div>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        
                            
                            {
                                this.state.isConnecetd === false ?
                                    <ul className="navbar-nav">
                                <li className="nav-item active">
                                <Link to='/home' className="nav-link" >Home</Link>
                                    </li>

                                        <li className="nav-item active">
                                            <Link to='/login' className="nav-link">Login</Link>
                                        </li>
                                        <li className="nav-item active">
                                            <Link to='/signup' className="nav-link">Sign up</Link>
                                        </li>
                                        </ul>
                                    :

                                    <ul className="navbar-nav">
                                        <li className="nav-item active">
                                <Link to='/home' className="nav-link" >Home</Link>
                                    </li>
                                    <li className="nav-item">
                                        <div className="nav-link" onClick={ ()=>{this.logout()} }> Log out </div>
                                    </li>
                                        <li className="nav-item disabled">
                                        <div className="nav-link"> welcome {this.state.fullname}</div>
                                    </li>
                                    </ul>

                            }




                        
                    </div>
                </nav>

            </div>
        );
    }
}
