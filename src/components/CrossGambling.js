import React, { Component } from 'react';
import fs from 'fs';
import parser from 'luaparse';
import ErrorModal from './ErrorModal';
import Store from './../utils/store';
const { dialog } = require('electron').remote;

const store = new Store({
    configName: 'user-preferences',
    defaults: {
        path: ""
    }
});

class CrossGambling extends Component {
    constructor() {
        super();

        this.state = {
            crossGambling: [],
            hasError: false,
            errorMessage: ""
        };

        this.closeErrorModal = this.closeErrorModal.bind(this);
        this.getFilePath = this.getFilePath.bind(this);
        this.parseFile = this.parseFile.bind(this);
    };

    parseFile(path){
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                this.setState({ errorMessage: `The LUA file was unable to be parsed. Please inform Kryo.`, hasError: true });
            } else {
                let gamblingData = parser.parse(data);
                let crossGamblingArr = [];
            
                if (gamblingData.body.length == 1) {
                    gamblingData.body[0].init[0].fields[1].value.fields.forEach(obj => {
                        if (obj.value.argument) {
                            crossGamblingArr.push({
                                name: obj.key.raw.replace(/"/g, ""),
                                value: -obj.value.argument.value
                            });
                        } else {
                            crossGamblingArr.push({
                                name: obj.key.raw.replace(/"/g, ""),
                                value: obj.value.value
                            });
                        };
                    });

                    this.setState({
                        crossGambling: crossGamblingArr.sort((x, y) => {
                            return y.value - x.value;
                        })
                    });

                };
            
            }
            
        });
    }

    getFilePath(){
        let filePath = dialog.showOpenDialog({
            filters: [
                {
                    name: 'Custom File Type',
                    extensions: ['lua']
                }
            ], 
            properties: ['openFile'] 
        });

        //Check for filePath incase user cancels
        if (filePath) {
            //Check filePath string for proper filename
            if (filePath[0].includes('CrossGambling.lua')) {
                this.parseFile(filePath[0]);
                store.set('path', filePath[0]);
            } else {
                this.setState({ errorMessage: `The file path, "${filePath[0]}" is invalid.`, hasError: true });
            }
        }
    }

    closeErrorModal(){
        this.setState({ hasError: false, errorMessage: "" });
    };

    componentDidMount(){
        let filePath = store.get('path');
        if (filePath) {
            if (filePath.includes('CrossGambling.lua')) {
                this.parseFile(filePath);
            }
        }
    }

    render(){
        return(
            <div>
                { this.state.crossGambling.length > 0 ?
                    <div className="cross-gambling-container" style={{width: "150px"}}>
                        <div>
                            {this.state.crossGambling.map((obj, index) => {
                            return <div key={`${obj.name}-${index}`} className="cross-gambling-row">
                                    <div>{obj.name}:</div>
                                    <div>{obj.value}</div>
                                </div>
                            })}
                        </div>
                        <div className="button" onClick={this.getFilePath} style={{width: '150px'}}>Select New File</div>
                    </div>
                    :
                    <div className="cross-gambling-container" style={{textAlign: "center", alignItems: 'center'}}>
                        <h3>Please specify the file path to CrossGambling.lua</h3>
                        <div className="button" onClick={this.getFilePath} style={{width: '100px'}}>Select File</div>
                        <div>
                            <div>You can find this file in your World of Warcraft directory</div>
                            <div>"_retail_\WTF\Account\*WOWACCOUNTNAME*\SavedVariables\"</div>
                            <div>Only the file CrossGambling.lua will be accepted!</div>
                        </div>
                    </div>
                }
                {this.state.hasError && <ErrorModal message={this.state.errorMessage} closeModal={this.closeErrorModal}/>}
            </div>
        )
    }
}

export default CrossGambling;