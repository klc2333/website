// Create a ES6 class component
class Modal extends React.Component {

	constructor(props) {
		super(props)

        this.state = {

        }
	}

	componentDidMount() {

	}

	render() {

		return (
			<div id="Modal">

                <div className="overlay">
                    <div className="modal">
                        <div className="fas fa-lg fa-times close-modal" onClick={this.props.close}></div>
                        <div className="content">
                            <div>{this.props.children}</div>
                        </div>
                    </div>
                </div>

			</div>
		);
	}

}
