class Respond extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            analysisRevised: Object.assign({}, this.props.analysis),
            db_testing_token: localStorage.db_testing_token || null,
            login: {
                username: "",
                password: "",
                error: null
            }
        }

        this.authenticate = this.authenticate.bind(this)
        this.onLoginChange = this.onLoginChange.bind(this)
        this.submitRevision = this.submitRevision.bind(this)
        this.updateAnalysis = this.updateAnalysis.bind(this)

    }

    componentDidMount() {

        if (!this.props.submitted && this.state.db_testing_token && this.props.decision == 'agree') {
            this.submitRevision();
        }
    }

    componentDidUpdate() {

        if (!this.props.submitted && this.state.db_testing_token && this.props.decision == 'agree') {
            this.submitRevision();
        }
    }

    render() {

        return(
            <div id="Respond">
                <Modal close={this.props.close} >

                    <div>

                        { this.state.db_testing_token ?
                            <div>

                                { this.props.submitted ?

                                    <div>
                                        <h1>Thank you for submitting your response</h1>
                                        <h1><div className="fas fa-4x fa-check decision-icon green"></div></h1>
                                    </div>

                                    :
                                    ((this.props.decision == 'disagree') &&


                                        <div>
                                            <h1>Submit Revision</h1>

                                            <div className="section how-to">
                                                <div>Click and drag on the sliders to change values</div>
                                                <div className="items">
                                                    <div className="item">
                                                        <img src="img/misc/dragging.gif" />
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="section">
                                                <h2>Economic Analysis</h2>
                                                <div className="items">
                                                    <div className="item">
                                                        <div className="title capitalize">Economic Potential</div>
                                                        <div className="bar-graph-wrapper">
                                                            <div className="bar-graph">
                                                                <div className={"bar-graph-progress " + Utils.getProgressColor(this.state.analysisRevised.economic_potential)} style={{right: ( 100 - Number(this.state.analysisRevised.economic_potential)) + '%'}}></div>
                                                                <input type="range" min="0" max="100" name="economic_potential" className="bar-graph-slider" value={this.state.analysisRevised.economic_potential} onChange={this.updateAnalysis} />
                                                            </div>
                                                            <div>{Math.min(Math.max(parseInt(Number(this.state.analysisRevised.economic_potential).toFixed(2)), 0), 100) + '%'}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="section">
                                                <h2>Potential Analysis</h2>
                                                <div className="items">
                                                    <div className="item">
                                                        <div className="title capitalize">Lightweighting</div>
                                                        <div className="bar-graph-wrapper">
                                                            <div className="bar-graph">
                                                                <div className={"bar-graph-progress " + Utils.getProgressColor(this.state.analysisRevised.lightweighting)} style={{right: ( 100 - Number(this.state.analysisRevised.lightweighting)) + '%'}}></div>
                                                                <input type="range" min="0" max="100" name="lightweighting" className="bar-graph-slider" value={this.state.analysisRevised.lightweighting} onChange={this.updateAnalysis} />
                                                            </div>
                                                            <div>{Math.min(Math.max(parseInt(Number(this.state.analysisRevised.lightweighting).toFixed(2)), 0), 100) + '%'}</div>
                                                        </div>
                                                    </div>

                                                    <div className="item">
                                                        <div className="title capitalize">Part Consolidation</div>
                                                        <div className="bar-graph-wrapper">
                                                            <div className="bar-graph">
                                                                <div className={"bar-graph-progress " + Utils.getProgressColor(this.state.analysisRevised.part_consolidation)} style={{right: ( 100 - Number(this.state.analysisRevised.part_consolidation)) + '%'}}></div>
                                                                <input type="range" min="0" max="100" name="part_consolidation" className="bar-graph-slider" value={this.state.analysisRevised.part_consolidation} onChange={this.updateAnalysis} />
                                                            </div>
                                                            <div>{Math.min(Math.max(parseInt(Number(this.state.analysisRevised.part_consolidation).toFixed(2)), 0), 100) + '%'}</div>
                                                        </div>
                                                    </div>

                                                    <div className="item">
                                                        <div className="title capitalize">Internal Channels</div>
                                                        <div className="bar-graph-wrapper">
                                                            <div className="bar-graph">
                                                                <div className={"bar-graph-progress " + Utils.getProgressColor(this.state.analysisRevised.internal_channels)} style={{right: ( 100 - Number(this.state.analysisRevised.internal_channels)) + '%'}}></div>
                                                                <input type="range" min="0" max="100" name="internal_channels" className="bar-graph-slider" value={this.state.analysisRevised.internal_channels} onChange={this.updateAnalysis} />
                                                            </div>
                                                            <div>{Math.min(Math.max(parseInt(Number(this.state.analysisRevised.internal_channels).toFixed(2)), 0), 100) + '%'}</div>
                                                        </div>
                                                    </div>

                                                    <div className="item">
                                                        <div className="title capitalize">Customization</div>
                                                        <div className="bar-graph-wrapper">
                                                            <div className="bar-graph">
                                                                <div className={"bar-graph-progress " + Utils.getProgressColor(this.state.analysisRevised.customization)} style={{right: ( 100 - Number(this.state.analysisRevised.customization)) + '%'}}></div>
                                                                <input type="range" min="0" max="100" name="customization" className="bar-graph-slider" value={this.state.analysisRevised.customization} onChange={this.updateAnalysis} />
                                                            </div>
                                                            <div>{Math.min(Math.max(parseInt(Number(this.state.analysisRevised.customization).toFixed(2)), 0), 100) + '%'}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="submission-bar">
                                                <button className="element" onClick={this.submitRevision}>Submit</button>
                                            </div>

                                        </div>
                                    )
                                }
                            </div>
                            :
                            <div>

                                <div className="section">

                                    <h1>Login</h1>
                                    <div className="items">

                                        <div className="item">
                                            <div className="title">Username</div>
                                            <div className="data-wrapper">
                                                <input type="text" name="username" className="element" value={this.state.login.username} onChange={this.onLoginChange} />
                                            </div>
                                        </div>
                                        <div className="item">
                                            <div className="title">Password</div>
                                            <div className="data-wrapper">
                                                <input type="password" name="password" className="element" value={this.state.login.password} onChange={this.onLoginChange} />
                                            </div>
                                        </div>

                                    </div>

                                    { this.state.login.error && <div className="login-error">{this.state.login.error}</div> }

                                </div>

                                <div className="submission-bar">
                                    <button className="element" onClick={this.authenticate}>Login</button>
                                </div>

                            </div>
                        }

                    </div>

                </Modal>
            </div>
        )
    }

    authenticate() {

        $.ajax({
            method: 'POST',
            url: 'main/login',
            data: this.state.login,
            success: (data) => {

                localStorage.db_testing_token = true
                this.setState({db_testing_token: true})

            },
            error: (xhr) => {
                console.log(xhr)
                if (xhr.status == 401) {
                    this.state.login.error = xhr.responseJSON
                    this.setState(this.state)
                }
            }
        });


    }

    onLoginChange(e) {

        this.state.login.error = null
        this.state.login[e.target.name] = e.target.value
        this.setState(this.state)
    }

    submitRevision() {
        this.props.submit(this.state.analysisRevised)
    }

    updateAnalysis(e) {

        this.state.analysisRevised[e.target.name] = e.target.value
        this.setState(this.state)

    }

}



// Create a ES6 class component
class Learn extends React.Component {

	constructor(props) {
		super(props)

        this.state = this.getInitialState()

        this.analysisAgree = this.analysisAgree.bind(this)
        this.analysisDisagree = this.analysisDisagree.bind(this)
        this.close = this.close.bind(this)
        this.submit = this.submit.bind(this)

	}

    getInitialState() {
        return ({
            decision: null,
            submitted: false
        })
    }

	render() {

		return (
			<div id="Learn">

                { !this.state.submitted &&
                    <div className="items flex">
                        <div className="item">
                            <div className="title">Do you agree with the analysis?</div>
                            <div className="data-wrapper">
                                <button className="fas fa-2x fa-check green" onClick={this.analysisAgree}></button>
                                <button className="fas fa-2x fa-times red" onClick={this.analysisDisagree}></button>
                            </div>
                        </div>
                    </div>
                }

                { (this.state.decision) &&

                    <Respond
                        analysis={this.props.analysis}
                        close={this.close}
                        decision={this.state.decision}
                        form={this.props.form}
                        submit={this.submit}
                        submitted={this.state.submitted}
                    />

                }


            </div>
		);
	}

    analysisAgree() {

        this.setState({
            decision: 'agree'
        })
    }

    analysisDisagree() {
        this.setState({decision: 'disagree'})
    }

    close() {
        this.setState({decision: null})
    }

    submit(results, cb) {

        var form = Object.assign({
            result_eco_feas: results.economic_potential / 100,
            result_lightweight: results.lightweighting / 100,
            result_pc: results.part_consolidation / 100,
            result_internal: results.internal_channels / 100,
            result_custom: results.customization / 100
        }, this.props.form)


        if (this.props.units == 'in') {

            var ratio = 0.03937007874

            form.volume = form.volume / Math.pow(ratio, 3)
            form.surface_area = form.surface_area / Math.pow(ratio, 2)
            form.bounding_box_x = form.bounding_box_x / ratio
            form.bounding_box_y = form.bounding_box_y / ratio
            form.bounding_box_z = form.bounding_box_z / ratio
        }

        var params = {
            Inputs : {
                input : {
                    ColumnNames: Object.keys(form),
                    Values : [Object.values(form)]
                }
            }
        }

        Utils.toggleOverlay('loader')

        $.ajax({
            method: 'POST',
            url: 'azure/update',
            data: params,
            success: (data) => {
                this.setState({submitted: true}, () => {
                    Utils.hideOverlay()
                    typeof cb == 'function' && cb()
                })
            },
            error: (xhr) => {
                console.log(xhr)
                Utils.hideOverlay()
            }
        });

    }

}
