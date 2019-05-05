import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class RenderWithoutRoute extends Component {

    render(){
        return(
            <div>
                <h3>Without route</h3>
                <p>This component is rendered without the "Route" </p>
                <p>This component has props history, location and match because it has been passed the <strong>withRouter</strong> HOC</p>
            </div>
        );
    }
}

export default withRouter(RenderWithoutRoute);