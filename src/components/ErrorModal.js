import React, { Component } from 'react';

class ErrorModal extends Component {
    constructor() {
        super();

    }

    render(){
        return(
            <div className="error-modal-background">
                <div className="error-modal-window">
                    <div className="title">Error</div>
                    <div style={{textAlign: "center"}}>{this.props.message}</div>
                    <div className="button" onClick={() => {this.props.closeModal()}} style={{width: '150px'}}>OK</div>
                </div>
            </div>
        )
    }

}

export default ErrorModal;