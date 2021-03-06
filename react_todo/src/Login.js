import React from 'react';
import { firebaseAuth, firebaseDB } from "./Config";
import "./Login.css";
import {
    Redirect,
    Route
} from 'react-router-dom'
// import { TweenMax, Power2, TimelineLite } from "gsap";
import FontAwesome from "react-fontawesome";

export default class LoginComponent extends React.Component {
    render() {
        return <div>
            <PropsRoute exact path="/login/signin" name="signin" component={SigninComponent} changeLoaderState={this.props.changeLoaderState} />

            <Route exact path="/login/signup" name="signup" component={SignupComponent} />
          </div>;
    }
}
const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return React.createElement(component, finalProps);
};

const PropsRoute = ({ component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={routeProps => {
        return renderMergedProps(component, routeProps, rest);
      }}
    />
  );
};

class SigninComponent extends React.Component {
    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleGitHub = this.handleGitHub.bind(this);
        this.handleTwitter = this.handleTwitter.bind(this);
        this.handleFacebook = this.handleFacebook.bind(this);
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
        this.props.changeLoaderState(true);
        let email = this.state.email;
        let password = this.state.password;
        if (email === undefined || password === undefined) {
            alert('please something input');
            return;
        }
        firebaseAuth().signInWithEmailAndPassword(email, password)
            .then(function (firebaseUser) {
                var user = firebaseAuth().currentUser;
                if (user) {
                    self.setState({ redirectToReferrer: true })
                    self.props.changeLoaderState(false);
                }
            })
            .catch(function (error) {
                // var errorCode = error.code;
                // var errorMessage = error.message;
            });
    }


    handleGitHub(event) {
        let self = this;
        const provider = new firebaseAuth.GithubAuthProvider();
        this.signInSocial(self, provider);
    }
    handleTwitter(event) {
        let self = this;
        const provider = new firebaseAuth.TwitterAuthProvider();
        this.signInSocial(self, provider);
    }
    handleFacebook(event) {
        let self = this;
        const provider = new firebaseAuth.FacebookAuthProvider();
        this.signInSocial(self, provider);
    }

    signInSocial(self, provider) {
        firebaseAuth().signInWithPopup(provider).then(function (result) {
            // var token = result.credential.accessToken;
            let user = result.user;
            //データがない場合は作成
            let urlid = "users/" + user.uid;
            firebaseDB().ref(urlid).once("value")
                .then(function (snapshot) {
                    let objData = snapshot.val();
                    self.createUserData(self, user, objData);
                });
        }).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
            console.log("errorCode: " + errorCode);
            console.log("errorCode: " + errorMessage);
            console.log("errorCode: " + email);
            console.log("errorCode: " + credential);
        });
    }
    


    createUserData(self, user, objData) {
        if (!objData) {
            let dataObj = { todolist: "" };
            firebaseDB()
                .ref("users/" + user.uid)
                .set(dataObj);
        }
        self.setState({ redirectToReferrer: true });
    }

    render() {
        const { from } = this.props.location.state || { from: { pathname: '/' } }
        const { redirectToReferrer } = this.state
        if (redirectToReferrer) {
            return (
                <Redirect to={from} />
            )
        }
        return <div className="login-box">
            <div className="form-input-box">
              <input type="text" name="email" placeholder="E-Mail" className="form-input" value={this.state.value} onChange={this.handleChange} />
            </div>
            <div className="form-input-box">
              <input type="password" name="password" placeholder="Password" className="form-input" value={this.state.value} onChange={this.handleChange} />
            </div>
            <button className="btn-submit" onClick={this.handleSubmit}>
              Login
            </button>
            <div className="line-or">or</div>
            <button className="btn-social btn-social--github" onClick={this.handleGitHub}>
              <FontAwesome name="github" className="icon" />
              Github Login
            </button>
            <button className="btn-social btn-social--twitter" onClick={this.handleTwitter}>
              <FontAwesome name="twitter" className="icon" />Twitter Login
            </button>
            <button className="btn-social btn-social--facebook" onClick={this.handleFacebook}>
              <FontAwesome name="facebook" className="icon" />facebook Login
            </button>
          </div>;
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

        firebaseAuth().createUserWithEmailAndPassword(email, password)
            .then(function (user) {
                let dataObj = {
                    todolist: ""
                };
                self.setState({ redirectToReferrer: true })
                firebaseDB()
                  .ref("users/" + user.uid)
                  .set(dataObj);

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
        return <div className="login-box">
            <form onSubmit={this.handleSubmit}>
              <div className="form-input-box">
                <input type="text" name="email" className="form-input" placeholder="E-Mail" value={this.state.value} onChange={this.handleChange} />
              </div>
              <div className="form-input-box">
                <input type="password" name="password" className="form-input" placeholder="Password" value={this.state.value} onChange={this.handleChange} />
              </div>
              <button className="btn-submit">Register</button>
            </form>
          </div>;
    }
}