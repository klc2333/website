const infoSection = {

	
    lightweighting: {
        description: ['The combination of AM and topology enables synthesis of creative design solutions with high strength-to-weight ratio'],
        benefits: ['Lightweight structure', 'Material saving', 'Added product value']
    },

    internal_channels: {
        description: ['Internal channels were required to be in regular shape because of the limited capability of conventional manufacturing methods', 'M enables channel design for better performance (e.g. conformal cooling)'],
        benefits: ['Improved performance (e.g. heat dissipation or fluid mix rate)'],
        applicability: ['Channel or alike redesign']
    },

    customization: {
        description: ['AM shows advantages in supporting economic customization', 'Conventional products are mostly massively produced in the same design'],
        benefits: ['Customized solution', 'Added product value'],
        applicability: ['Bio-implant', 'Personal belongings', 'Texture']
    },

    part_consolidation: {
        description: ['Part consolidation is a design technique to reduce the number of parts, thereby eliminating assembly operations', 'Part count of the manifold is reduced from 20 to 5'],
        benefits: ['Reduce part count & cost', 'Avoid assembly-related quality issues', 'Shorten supply chain', 'Simplify product architecture'],
        applicability: ['No relative motion between connected components', 'two components are in the same material', 'Consolidation does not lead to insertion difficulty of a third existing part']
    }
}

var infoTimerIn, infoTimerOut, infoTimerReset


// Create a ES6 class component
class Form extends React.Component {

	constructor(props) {
		super(props)

        this.state = this.getInitialState()

        this.closeInfoSection = this.closeInfoSection.bind(this)
        this.handleFormChange = this.handleFormChange.bind(this)
        this.handleFormClick = this.handleFormClick.bind(this)
        this.handleUnitsChange = this.handleUnitsChange.bind(this)
        this.reset = this.reset.bind(this)
        this.setInfoSection = this.setInfoSection.bind(this)
        this.submit = this.submit.bind(this)
        this.toggleView = this.toggleView.bind(this)
	}

    getInitialState() {
        return ({
            analysis: null,
            form : {
                id: null,

                volume: '',
                surface_area: '',
                bounding_box_x: '',
                bounding_box_y: '',
                bounding_box_z: '',

                components: '',
                fasteners: '',
                assembly_interfaces: '',

                cost: '',
                batch_size: '',
                lead_time: '',
                inventory_cost: '',
                import_export_cost: '',

                surface_markings: '',
                internal_channels: '',
                similar_parts: '',
                size_variation: '',
                human_body: ''

            },
            infoKey: null,
            loading: true,
            submitted: false,
            units: 'mm'
        })
    }

	render() {

		return (
			<div id="Form" className={ this.state.submitted ? "submitted" : "" }>

                <div className="form-inner">
                    <div className="form">
        				<h1>Automated Candidate Detection for Additive Manufacturing</h1>
                        <h5 style={{position: 'absolute', margin: '-25px 30px 0', color: 'var(--theme)'}}>BETA</h5>

                        <div className="section">

                            <select value={this.state.units} onChange={this.handleUnitsChange}>
                                <option value="in">inches</option>
                                <option value="mm">millimeters</option>
                            </select>

                            <h2>Geometry</h2>
                            <div className="items">

                                <div className="item">
                                    <div className="info fas fa-sm fa-info-circle" title="The volume of the part"></div>
                                    <div className="title">Volume</div>
                                    <div className="data-wrapper">
                                        <input name="volume" className={ "element has-units" + (this.validate('volume', 'number') ? " valid" : " invalid" ) } onChange={this.handleFormChange} value={this.state.form.volume} />
                                        <span className="unit">{this.state.units}<sup>3</sup></span>
                                    </div>
                                </div>
                                <div className="item">
                                    <div className="info fas fa-sm fa-info-circle" title="The surface area of the part"></div>
                                    <div className="title">Surface Area</div>
                                    <div className="data-wrapper">
                                        <input name="surface_area" className={ "element has-units" + (this.validate('surface_area', 'number') ? " valid" : " invalid" ) } onChange={this.handleFormChange} value={this.state.form.surface_area} />
                                        <span className="unit">{this.state.units}<sup>2</sup></span>
                                    </div>
                                </div>

                                <div className="item">
                                    <div className="info fas fa-sm fa-info-circle" title="The dimensions of the bounding box"></div>
                                    <div className="title">Bounding Box</div>
                                    <div className="data-wrapper three">
                                        <input name="bounding_box_x" className={ "element has-units" + (this.validate('bounding_box_x', 'number') ? " valid" : " invalid" ) } onChange={this.handleFormChange} value={this.state.form.bounding_box_x} />
                                        <span className="unit">{this.state.units}</span>
                                        <span className="unit left">x</span>
                                    </div>
                                    <div className="data-wrapper three">
                                        <input name="bounding_box_y" className={ "element has-units" + (this.validate('bounding_box_y', 'number') ? " valid" : " invalid" ) } onChange={this.handleFormChange} value={this.state.form.bounding_box_y} />
                                        <span className="unit">{this.state.units}</span>
                                        <span className="unit left">y</span>
                                    </div>
                                    <div className="data-wrapper three">
                                        <input name="bounding_box_z" className={ "element has-units" + (this.validate('bounding_box_z', 'number') ? " valid" : " invalid" ) } onChange={this.handleFormChange} value={this.state.form.bounding_box_z} />
                                        <span className="unit">{this.state.units}</span>
                                        <span className="unit left">z</span>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="section">
                            <h2>Model Information</h2>
                            <div className="items">

                                <div className="item">
                                    <div className="info fas fa-sm fa-info-circle" title="The number of individual parts in an assembly"></div>
                                    <div className="title">Number of Components</div>
                                    <div className="data-wrapper">
                                        <input name="components" className={ "element" + (this.validate('components', 'number') ? " valid" : " invalid" ) } onChange={this.handleFormChange} value={this.state.form.components} />
                                    </div>
                                </div>

                                <div className="item">
                                    <div className="info fas fa-sm fa-info-circle" title="The number of screws, bolts, etc."></div>
                                    <div className="title">Number of Fasteners</div>
                                    <div className="data-wrapper">
                                        <input name="fasteners" className={ "element" + (this.validate('fasteners', 'number') ? " valid" : " invalid" ) } onChange={this.handleFormChange} value={this.state.form.fasteners} />
                                    </div>
                                </div>

                                <div className="item">
                                    <div className="info fas fa-sm fa-info-circle" title="The numer of locations in which parts are joined with fasteners"></div>
                                    <div className="title">Number of Assembly Interfaces</div>
                                    <div className="data-wrapper">
                                        <input name="assembly_interfaces" className={ "element" + (this.validate('assembly_interfaces', 'number') ? " valid" : " invalid" ) } onChange={this.handleFormChange} value={this.state.form.assembly_interfaces} />
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="section">
                            <h2>Model Features</h2>
                            <div className="items flex">

                                <div className="item">
                                    <div className="title">Internal Channels</div>
                                    <div className="data-wrapper">
                                        <button name="internal_channels" className={"fas fa-2x fa-check" + (this.state.form.internal_channels === 1 ? " green" : "")} value="1" onClick={this.handleFormClick}></button>
                                        <button name="internal_channels" className={"fas fa-2x fa-times" + (this.state.form.internal_channels === 0 ? " red" : "")} value="0" onClick={this.handleFormClick}></button>
                                    </div>
                                </div>

                                <div className="item">
                                    <div className="title">Surface Markings</div>
                                    <div className="data-wrapper">
                                        <button name="surface_markings" className={"fas fa-2x fa-check" + (this.state.form.surface_markings === 1 ? " green" : "")} value="1" onClick={this.handleFormClick}></button>
                                        <button name="surface_markings" className={"fas fa-2x fa-times" + (this.state.form.surface_markings === 0 ? " red" : "")} value="0" onClick={this.handleFormClick}></button>
                                    </div>
                                </div>

                                <div className="item">
                                    <div className="title">Similar Parts</div>
                                    <div className="data-wrapper">
                                        <button name="similar_parts" className={"fas fa-2x fa-check" + (this.state.form.similar_parts === 1 ? " green" : "")} value="1" onClick={this.handleFormClick}></button>
                                        <button name="similar_parts" className={"fas fa-2x fa-times" + (this.state.form.similar_parts === 0 ? " red" : "")} value="0" onClick={this.handleFormClick}></button>
                                    </div>
                                </div>

                                <div className="item">
                                    <div className="title">Size Variation</div>
                                    <div className="data-wrapper">
                                        <button name="size_variation" className={"fas fa-2x fa-check" + (this.state.form.size_variation === 1 ? " green" : "")} value="1" onClick={this.handleFormClick}></button>
                                        <button name="size_variation" className={"fas fa-2x fa-times" + (this.state.form.size_variation === 0 ? " red" : "")} value="0" onClick={this.handleFormClick}></button>
                                    </div>
                                </div>

                                <div className="item">
                                    <div className="title">Custom Fit</div>
                                    <div className="data-wrapper">
                                        <button name="human_body" className={"fas fa-2x fa-check" + (this.state.form.human_body === 1 ? " green" : "")} value="1" onClick={this.handleFormClick}></button>
                                        <button name="human_body" className={"fas fa-2x fa-times" + (this.state.form.human_body === 0 ? " red" : "")} value="0" onClick={this.handleFormClick}></button>
                                    </div>
                                </div>

                            </div>
                        </div>


                        <div className="section">
                            <h2>Economics</h2>
                            <div className="items">

                                <div className="item">
                                    <div className="info fas fa-sm fa-info-circle" title="The manufacturing cost for each unit"></div>
                                    <div className="title">Cost per Unit</div>
                                    <div className="data-wrapper">
                                        <input name="cost" className={ "element has-units" + (this.validate('cost', 'number') ? " valid" : " invalid" ) } onChange={this.handleFormChange} value={this.state.form.cost} />
                                        <span className="unit">USD</span>
                                        <span className="unit left">$</span>
                                    </div>
                                </div>

                                <div className="item">
                                    <div className="info fas fa-sm fa-info-circle" title="The number of units being manufactured"></div>
                                    <div className="title">Batch Size</div>
                                    <div className="data-wrapper">
                                        <input name="batch_size" className={ "element has-units" + (this.validate('batch_size', 'number') ? " valid" : " invalid" ) } onChange={this.handleFormChange} value={this.state.form.batch_size} />
                                    </div>
                                </div>

                                <div className="item">
                                    <div className="info fas fa-sm fa-info-circle" title="The lead time for the batch"></div>
                                    <div className="title">Lead Time</div>
                                    <div className="data-wrapper">
                                        <input name="lead_time" className={ "element has-units" + (this.validate('lead_time', 'number') ? " valid" : " invalid" ) } onChange={this.handleFormChange} value={this.state.form.lead_time} />
                                        <span className="unit">days</span>
                                    </div>
                                </div>

                                <div className="item">
                                    <div className="info fas fa-sm fa-info-circle" title="The inventory costs for storing a unit"></div>
                                    <div className="title">Inventory Costs per Day</div>
                                    <div className="data-wrapper">
                                        <input name="inventory_cost" className={ "element has-units" + (this.validate('inventory_cost', 'number') ? " valid" : " invalid" ) } onChange={this.handleFormChange} value={this.state.form.inventory_cost} />
                                        <span className="unit">USD</span>
                                        <span className="unit left">$</span>
                                    </div>
                                </div>

                                <div className="item">
                                    <div className="info fas fa-sm fa-info-circle" title="The costs associated with importing and exporting a unit"></div>
                                    <div className="title">Import / Export Cost</div>
                                    <div className="data-wrapper">
                                        <input name="import_export_cost" className={ "element has-units" + (this.validate('import_export_cost', 'number') ? " valid" : " invalid" ) } onChange={this.handleFormChange} value={this.state.form.import_export_cost} />
                                        <span className="unit">USD</span>
                                        <span className="unit left">$</span>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="submission-bar">
                            <button className="element" onClick={this.props.reset}>Reset</button>
                            <button className="element" onClick={this.submit} disabled={Object.values(this.state.form).some( item => item === '' )} >Submit</button>
                        </div>
                    </div>


                    {(this.state.analysis) &&
                        <div className="response">
                            <h1>Candidacy Analysis</h1>

                            <div className="section">
                                <h2>Economic Analysis</h2>
                                <div className="items">
                                    <div className="item">
                                        <div className="title capitalize">Economic Potential</div>
                                        <div className="bar-graph-wrapper">
                                            <div className="bar-graph" name="economic_potential" onClick={this.setInfoSection}>
                                                <div className={"bar-graph-progress " + Utils.getProgressColor(this.state.analysis.economic_potential)} style={{right: ( 100 - Number(this.state.analysis.economic_potential)) + '%'}}></div>
                                            </div>
                                            <div>{Math.min(Math.max(parseInt(Number(this.state.analysis.economic_potential).toFixed(2)), 0), 100) + '%'}</div>
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
                                            <div className="bar-graph" name="lightweighting" onClick={this.setInfoSection}>
                                                <div className={"bar-graph-progress " + Utils.getProgressColor(this.state.analysis.lightweighting)} style={{right: ( 100 - Number(this.state.analysis.lightweighting)) + '%'}}></div>
                                            </div>
                                            <div>{Math.min(Math.max(parseInt(Number(this.state.analysis.lightweighting).toFixed(2)), 0), 100) + '%'}</div>
                                        </div>
                                    </div>

                                    <div className="item">
                                        <div className="title capitalize">Part Consolidation</div>
                                        <div className="bar-graph-wrapper">
                                            <div className="bar-graph" name="part_consolidation" onClick={this.setInfoSection}>
                                                <div className={"bar-graph-progress " + Utils.getProgressColor(this.state.analysis.part_consolidation)} style={{right: ( 100 - Number(this.state.analysis.part_consolidation)) + '%'}}></div>
                                            </div>
                                            <div>{Math.min(Math.max(parseInt(Number(this.state.analysis.part_consolidation).toFixed(2)), 0), 100) + '%'}</div>
                                        </div>
                                    </div>

                                    <div className="item">
                                        <div className="title capitalize">Internal Channels</div>
                                        <div className="bar-graph-wrapper">
                                            <div className="bar-graph" name="internal_channels" onClick={this.setInfoSection}>
                                                <div className={"bar-graph-progress " + Utils.getProgressColor(this.state.analysis.internal_channels)} style={{right: ( 100 - Number(this.state.analysis.internal_channels)) + '%'}}></div>
                                            </div>
                                            <div>{Math.min(Math.max(parseInt(Number(this.state.analysis.internal_channels).toFixed(2)), 0), 100) + '%'}</div>
                                        </div>
                                    </div>

                                    <div className="item">
                                        <div className="title capitalize">Customization</div>
                                        <div className="bar-graph-wrapper">
                                            <div className="bar-graph" name="customization" onClick={this.setInfoSection}>
                                                <div className={"bar-graph-progress " + Utils.getProgressColor(this.state.analysis.customization)} style={{right: ( 100 - Number(this.state.analysis.customization)) + '%'}}></div>
                                            </div>
                                            <div>{Math.min(Math.max(parseInt(Number(this.state.analysis.customization).toFixed(2)), 0), 100) + '%'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="submission-bar">
                                <button className="element fas fa-arrow-left" onClick={this.toggleView}></button>
                            </div>

                        </div>
                    }

                </div>

                { (this.state.submitted) &&
                    <Learn
                        analysis={this.state.analysis}
                        form={this.state.form}
                        units={this.state.units}
                    />
                }

                { (this.state.infoKey) &&
                    <div id="InfoSection">
                        <div className="fas fa-lg fa-times" onClick={this.closeInfoSection}></div>
                        { (infoSection[this.state.infoKey]) ?
                            <div className="info-inner">
                                <div className="info-image"><img className="floating" onLoad={(e) => e.target.style.display='block'} src={"img/amk/" + this.state.infoKey + ".jpg"} /></div>
                                <div className="info-details">
                                    {Object.keys(infoSection[this.state.infoKey] || {}).map( (key, i) => {

                                        return (
                                            <div key={i}>
                                                <h3 className="capitalize">{key.split("_").join(" ")}</h3>
                                                <ul>
                                                    {infoSection[this.state.infoKey][key].map( (desc, j) => {

                                                        return (
                                                            <li key={j}>{desc}</li>
                                                        )
                                                    })}
                                                </ul>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            :
                            <div className="info-inner">AMK not available.</div>
                        }
                    </div>
                }
			</div>
		);
	}

    closeInfoSection() {

        this.setState({infoKey: null}, () => this.props.setFullscreen(false))
    }

    handleFormChange(e) {

        this.state.form[e.target.name] = e.target.value
        this.setState(this.state)

    }

    handleFormClick(e) {

        this.state.form[e.target.name] = Number(e.target.value)
        this.setState(this.state)

    }

    handleUnitsChange(e) {

        this.state.units = e.target.value
        this.setState(this.state)

    }

    reset() {

        this.setState(this.getInitialState())
    }

    setInfoSection(e) {

        this.setState({infoKey: e.currentTarget.getAttribute('name')}, () => this.props.setFullscreen(true))
    }

    submit() {

        this.state.form.id = Utils.uuid()

        var form = Object.assign({}, this.state.form)

        if (this.state.units == 'in') {

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
            url: 'azure/predict',
            data: params,
            success: (data) => {

                if (data.Results) {

                    if (data.Results.potentials
                     && data.Results.potentials.value
                     && data.Results.potentials.value.Values
                     && data.Results.potentials.value.Values.length) {

                        var potentials = data.Results.potentials.value.ColumnNames.reduce((o, k, i) => ({...o, [k]: Math.min(Math.max(Number(data.Results.potentials.value.Values[0][i] || 0), 0), 100)}), {})
                    }

                    console.log('analysis', potentials)

                    this.setState({
                        analysis: potentials
                    }, this.toggleView)

                    Utils.hideOverlay()

                }

            },
            error: (xhr) => {
                console.log(xhr)
                Utils.hideOverlay()
            }
        });

        this.setState(this.state)

    }

    toggleView() {

        var page = $('body')

        var scrollTop = $("#Form").offset().top

        if (page.scrollTop() == scrollTop) {
            this.setState({submitted: !this.state.submitted})
        } else {
            page.animate({scrollTop: scrollTop},() => {
                this.setState({submitted: !this.state.submitted})
            });
        }

    }

    updateFormCAD(data) {

        this.state.units = data.units
        this.state.form = Object.assign(this.state.form, data.elements);

        this.setState(this.state.form)
    }

    validate(name, type) {

        if (this.state.form[name] == undefined) {return true}

        switch (type) {

            case 'number':
                return Number(this.state.form[name]) >= 0

            default:
                return true

        }

    }

}
