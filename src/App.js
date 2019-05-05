import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter,
  Switch
} from "react-router-dom";
import RenderWithoutRoute from './RenderWithoutRoute';
import PlayerApi from './api';

class App extends Component {
  render() {
    return (
      <Router>
        <div >
          <ul>
            <li><Link to='/'> Home </Link></li>
            <li><Link to='/About'> About </Link></li>
            <li><Link to='/Info'> Info </Link></li>   
            <li><Link to='/Protected'> Protected </Link></li>
            <li><Link to='/Admin'>Admin</Link></li>
            <li><Link to='/Tornadoes'>Tornadoes</Link></li>
          </ul>
        <Switch>         
          <Route exact path='/' component={Home}/>
          <Route path='/About' component={About}/>
          <Route path='/Info' component={Info}/>
          <Route path='/Login' component={Login}/>
          <ProtectedRoute path='/Protected' component={Protected}/>
          <AdminRoute path='/Admin' component={Admin}/>
          <Route path='/Tornadoes' component={Tornadoes} />
        </Switch>
        </div>
      </Router>
    );
  }
}

const Home = () => {
  return (
  <div>
    Home Page
  </div>
  )
};

const Tornadoes = ({match}) => (
  <div>
    <ul>
      <li>
        <Link to={`${match.path}/roster`}>Roster</Link>
      </li>
      <li>
        <Link to={`${match.path}/schedule`}>Schedule</Link>
      </li>
    </ul>
    <Route path={`${match.url}/roster`} component={Roster} />
    <Route path={`${match.url}/schedule`} component={Schedule}/>
  </div>
);

const Roster = ({match}) => (
  <div>
    <Switch>
      <Route exact path={`${match.url}`} component={FullRoster} />
      <Route path={`${match.url}/:id`} component={Player} />
    </Switch>
  </div>
)

const FullRoster = ({match}) => {
  return(
    <div>
      <ul>
        {PlayerApi.players.map(player => <li><Link to={`${match.path}/${player.name}`} >{`${player.name}`}</Link></li> )}
      </ul>
    </div>
  );
}

const Schedule = () => <div>This is the schedule</div>
const Player = ({match}) => <div>{`these are the stats for ${match.params.id}`}</div>



const About = ({match}) => {
  return(
    <div>
      <ul>
        <li><Link to={`${match.url}/me`}>Me</Link></li>
        <li><Link to={`${match.url}/you`}>you</Link></li>
      </ul>
      <Route exact path={`${match.path}`} render={() => <Redirect to={`${match.path}/me`} />} />
      <Route path={`${match.path}/me`} render={() => <div>About me</div>} />
      <Route path={`${match.path}/you`} render={() => <div>About you</div>} />
      <RenderWithoutRoute />
    </div>
  )
}

const Info = ({match}) => {
  return(
    <div>
      <ul>
        <li><Link to={`${match.url}/someInfo`}> 1 </Link></li>
        <li><Link to={`${match.url}/moreInfo`}> 2 </Link></li>
        <li><Link to={`${match.url}/additionalInfo`}> 3 </Link></li>
      </ul>
      <Route path={`${match.path}/:id`} component={SpecificInfo} />
      <Route exact path={`${match.path}`} render={()=> <Redirect to={`${match.url}/additionalInfo`}/>} />
    </div>
  )
} 


const SpecificInfo = (props) => {
  return(
    <div>
      <h1>SpecificInfo Component</h1>
      <p>This is specific info about {props.match.params.id}</p>
      <button onClick={props.history.goBack}>Go back</button>
    </div>
  )
}


let authenticate = {
  isAutheticated:false,
  login: function(cb){
    this.isAutheticated = true;
    setTimeout(cb, 100)
  },
  signout: function(cb){
    this.isAutheticated = false;
    setTimeout(cb, 100)
  }
}

const AdminRoute = ({component: Component, ...rest}) => {
  return <Route {...rest} render={props => authenticate.isAutheticated ? <Component {...props}/> : <Redirect to={{ pathname:'/Login', state:{from:props.location}}}/> }/>
}

const Admin = withRouter(({history}) => {
  console.log(history)
  return(
    <div>
        Admin space
        <button onClick={() => history.goBack()}>Go back</button>
    </div>
  )
})


const ProtectedRoute = ({component: Component, ...rest})  => {
  console.log({component: Component, ...rest})
  return <Route {...rest} render={props =>{ console.log(props); return authenticate.isAutheticated? <Component {...props} /> : <Redirect to={{
    pathname: '/Login',
    state: { from: props.location }
    // this info above is passed down to the Login component. 'from' can be named anything else. Here it will have a reference to /Protected
    // and from inside the Login component below, when we redirect, we can come back to the previous path. It's like state inside Login component
    // keeps a reference from where it came from.
  }}/>} }/>
}


class Login extends Component {
  state = {
    redirectToReferrer: false
  }
  login = () => {
    authenticate.login(() => {
      this.setState({redirectToReferrer: true})
    })
  }

  render(){
    const {redirectToReferrer} = this.state;
    if(redirectToReferrer){
      return(
        <Redirect to={`${this.props.history.location.state.from.pathname}`}/>
      )
    }

    return(
    <div>
      <h3>You need to login</h3>
      <button onClick={() => this.login()}>Login</button>
      
    </div>
    )
  }
}

class Protected extends Component {
  state = {
    loggedIn:true
  }

  logOut = () => {
    authenticate.signout();
    this.setState({loggedIn:false})
  } 

  render(){
    const {loggedIn} = this.state;
    if(!loggedIn){
      return(
        <Redirect to='/Login' />
      )
    } 
    console.log(this.props)
    return(
      <div>
        <h2>Protected route</h2>
        <button onClick={() => this.logOut()}>Logout</button>
        
      </div>
    )
  }
}

export default App;
