import React, {Component} from 'react';
import PropTypes from 'prop-types'

import FlatButton from 'material-ui/FlatButton';
import PlayArrow from 'material-ui/svg-icons/av/play-arrow';
import Pause from 'material-ui/svg-icons/av/pause';
import Replay from 'material-ui/svg-icons/av/replay';


export class SystemModel {
    constructor() {
        this.updateListeners = []
    }
    
    run() {
        this.running = true
        const runner = ()=>{
            this.update()
            this.callUpdateListener()
            if (this.running) {
                requestAnimationFrame(runner.bind(this))
            }
        }
        runner()
    }
    
    stop() {
        this.running = false
    }
    
    callUpdateListener() {
        for (let f of this.updateListeners) {
            f(this)
        }
    }
    
    addUpdateListener(listener) {
        this.updateListeners.push(listener)
    }
}

let canvas_style = {
    //width: '100%'
}

export class CanvasVisualizer extends Component {
    constructor(props) {
        super(props);
        this.props.system.init()
    }
    
    componentDidMount() {
        const {canvas} = this.refs;
        this.props.system.addUpdateListener(this.props.draw_func.bind(null, canvas))
        this.props.system.callUpdateListener()
    }

    render() {
        return (
            <canvas ref="canvas"
                width={this.props.width} height={this.props.height}
                style={canvas_style}
                />
        )
    }
}

CanvasVisualizer.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
};

let button_style = {
    margin: "0px 12px"
}

export class PlayButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_pause: this.props.system.running
        }
        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        if (this.props.system.running) {
            this.props.system.stop()
        } else {
            this.props.system.run()
        }
        this.setState({
            is_pause: this.props.system.running
        })
    }
    render() {
        return <FlatButton backgroundColor="#dddddd" icon={this.state.is_pause ? <Pause /> : <PlayArrow />} onClick={this.handleClick} style={button_style} />
    }
}

export class ResetButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_pause: this.props.system.running
        }
        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        this.props.system.init()
        this.props.system.callUpdateListener()
    }
    render() {
        return <FlatButton backgroundColor="#dddddd" icon={<Replay />} onClick={this.handleClick} style={button_style} />
    }
}
