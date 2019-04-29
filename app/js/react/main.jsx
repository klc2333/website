
// Obtain the root
const rootElement = document.getElementById('root')

// Create a ES6 class component
class App extends React.Component {


	constructor(props) {
		super(props)

	    this.state = {
	    	fullscreen : false,
	    	reset: false,
	    	view : null
	    }

	    this.formElement = React.createRef()
	    this.viewerElement = React.createRef()

	    this.setFullscreen = this.setFullscreen.bind(this)
	    this.updateForm = this.updateForm.bind(this)
	    this.reset = this.reset.bind(this)
	}

	componentDidMount() {
		console.log('Main component mounted')
	}

	render() {
		return (
			<div id="content">

				<Viewer ref={this.viewerElement} updateForm={this.updateForm} reset={this.reset} />
				<Form ref={this.formElement} setFullscreen={this.setFullscreen} reset={this.reset} />
				<div className={"underlay" + (this.state.fullscreen ? " fullscreen" : "")}></div>

				<a href="https://adml.lab.mcgill.ca" className="adml-logo"></a>
			</div>
		);
	}

	reset() {
		this.viewerElement.current.reset()
		this.formElement.current.reset()
	}

	setFullscreen(state) {
		this.setState({fullscreen: state})
	}

	updateForm(data) {
		this.formElement.current.updateFormCAD(data)
	}

	viewChange(e) {
		this.setState({view: 5})
	}

}


// Use the ReactDOM.render to show your component on the browser
ReactDOM.render(
	<App test='5' />,
	rootElement
)
