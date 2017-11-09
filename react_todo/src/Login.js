import React, { Component } from 'react';
import * as firebase from "firebase";
import {
    BrowserRouter as Router,
    Redirect,
    Route
} from 'react-router-dom'

const provider = new firebase.auth.GithubAuthProvider();

export default class LoginComponent extends React.Component {
    render() {
        return (
            <div>
                <Route path="/login/signin" name="signin" component={SigninComponent} />
                <Route path="/login/signup" name="signup" component={SignupComponent} />
            </div>
        );
    }
}

class SigninComponent extends React.Component {
    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleGitHub = this.handleGitHub.bind(this);
        this.state = {
            redirectToReferrer: false
        };
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        let self = this;
        let email = this.state.email;
        let password = this.state.password;
        if (email === undefined || password === undefined) {
            alert('please something input');
            return;
        }
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function (firebaseUser) {
                var user = firebase.auth().currentUser;
                if (user) {
                    console.log("user:"+user);
                    self.setState({ redirectToReferrer: true })
                }
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
            });
    }
    handleGitHub(event) {
        let self = this;
        firebase.auth().signInWithPopup(provider).then(function (result) {
            // This gives you a GitHub Access Token. You can use it to access the GitHub API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            console.log("token:user");
            console.dir(user);

            //データがない場合は作成
            let urlid = "users/" + user.uid;
            console.log("urlid:" + urlid);
            firebase.database().ref(urlid).once('value').then(function (snapshot) {
                var objDate = snapshot.val();
                console.log("objDate::"+objDate);
                
                if (!objDate){
                    let dataObj = {
                        todolist: ""
                    };
                    firebase.database().ref('users/' + user.uid).set(dataObj);
                }
                self.setState({ redirectToReferrer: true })

            });

        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
  
    }

    render() {
        const { from } = this.props.location.state || { from: { pathname: '/' } }
        const { redirectToReferrer } = this.state
        if (redirectToReferrer) {
            console.log("ある？");
            return (
                <Redirect to={from} />
            )
        }
        return (
            <div className="login-box">
                <div className="form-input-box">
                    <input type="text" name="email" placeholder="E-Mail" className="form-input" value={this.state.value} onChange={this.handleChange} />
                </div>
                <div className="form-input-box">
                    <input type="password" name="password" placeholder="Password" className="form-input" value={this.state.value} onChange={this.handleChange} />
                </div>
                <button className="btn-submit" onClick={this.handleSubmit}>Login</button>
                <p>or</p>
                <button onClick={this.handleGitHub}>Github</button>
                <button>Twitter</button>
                <button>facebook</button>
            </div>
        );
    }
}









class SignupComponent extends React.Component {
    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            redirectToReferrer: false
        };
    }
    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        let self = this;
        let email = this.state.email;
        let password = this.state.password;
        if (email === undefined || password === undefined) {
            alert('.');
            return;
        }
        if (email.length < 4) {
            alert('Please enter an email addressed.');
            return;
        }
        if (password.length < 4) {
            alert('Please enter a password.');
            return;
        }

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function (user) {
                let dataObj = {
                    todolist: ""
                };
                self.setState({ redirectToReferrer: true })
                firebase.database().ref('users/' + user.uid).set(dataObj);

                alert('Your account has created!');

            }, function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode === 'auth/weak-password') {
                    alert('The password is too weak.');
                } else {
                    alert(errorMessage);
                }
            });


        event.preventDefault();
    }
    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-input-box">
                        <input type="text" name="email" className="form-input" placeholder="E-Mail" value={this.state.value} onChange={this.handleChange} />
                    </div>
                    <div className="form-input-box">
                        <input type="password" name="password" className="form-input" placeholder="Password" value={this.state.value} onChange={this.handleChange} />
                    </div>
                    <button className="btn-submit">Register</button>
                </form>
            </div>
        );
    }
}