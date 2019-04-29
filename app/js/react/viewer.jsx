var access_token_public = localStorage.forge_access_token_public || null;
var access_token_public_expires = localStorage.forge_access_token_public_expires || 0

var fetchStatusInterval
var fetchPercentage = 0

var authenticatePublic = function(cb) {

    var now = Date.now()

    // If cached access token has expired
    if (!access_token_public || now > access_token_public_expires) {

        $.ajax({
            method: 'POST',
            url: 'forge/authenticate',
            success: (data) => {

                access_token_public = data.access_token
                access_token_public_expires = now + (data.expires_in - 60) * 1000

                localStorage.forge_access_token_public = access_token_public
                localStorage.forge_access_token_public_expires = access_token_public_expires

                cb(access_token_public, access_token_public_expires);
            },
            error: (xhr) => {
                console.log(xhr)
            }
        });

    } else {
        cb(access_token_public, access_token_public_expires)
    }

}

function signedVolumeOfTriangle(p1, p2, p3) {
  return p1.dot(p2.cross(p3)) / 6.0;
}

var viewerApp;
var options = {
    env: 'AutodeskProduction',
    api: 'derivativeV2', // TODO: for models uploaded to EMEA change this option to 'derivativeV2_EU'
    getAccessToken: authenticatePublic
};

class FileUploader extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
        }

        this.handleDropUpload = this.handleDropUpload.bind(this)
        this.uploadHandler = this.uploadHandler.bind(this)

    }

    componentDidMount() {

            let dropArea = document
            let overlay = document.getElementById('overlay')

            // Prevent default drag behaviors
            ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                dropArea.addEventListener(eventName, this.preventDefaults, false)
            })

            // HighlightDropArea drop area when item is dragged over it
            dropArea.addEventListener('dragenter', this.highlightDropArea, false)

            ;['dragleave', 'drop'].forEach(eventName => {
                overlay.addEventListener(eventName, this.unhighlightDropArea, false)
            })

            // Handle dropped files
            dropArea.addEventListener('drop', this.handleDropUpload, false)

    }

    componentWillUnmount() {

            let dropArea = document
            let overlay = document.getElementById('overlay')

            // Prevent default drag behaviors
            ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                dropArea.removeEventListener(eventName, this.preventDefaults)
            })

            // HighlightDropArea drop area when item is dragged over it
            dropArea.removeEventListener('dragenter', this.highlightDropArea)

            ;['dragleave', 'drop'].forEach(eventName => {
                overlay.removeEventListener(eventName, this.unhighlightDropArea)
            })

            // Handle dropped files
            dropArea.removeEventListener('drop', this.handleDropUpload)

    }

    render() {

        return(
            <div id="FileUploader">
                <div className="viewer-message">Drag and drop CAD file here to begin</div>
                <div className="viewer-message">- or -</div>
                <div className="viewer-message">
                    <input type="file" name="CAD" id="CAD" onChange={this.uploadHandler} />
                    <label htmlFor="CAD">Choose from computer</label>
                </div>
                { this.props.uploadMAX && <small className="viewer-message">Max file size: {this.props.uploadMAX}B</small>}
            </div>
        )
    }

    handleDropUpload(e) {
        console.log('dropped')
        var dt = e.dataTransfer
        var files = dt.files
        this.uploadHandler(files[0])

    }

    highlightDropArea() {
        Utils.showOverlay('dropzone')
    }

    preventDefaults(e) {
        e.preventDefault()
        e.stopPropagation()
    }

    unhighlightDropArea() {
        Utils.hideOverlay('dropzone')
    }

    uploadHandler(e) {

        console.log('uploadHandler')

        if (e.target) {
            var file = e.target.files ? e.target.files[0] : null
        } else {
            var file = e
        }

        if (file.size > Utils.sizeToBytes(this.props.uploadMAX)) {
            alert('File is too large')
            return
        }

        this.props.bucketUpload(file)

    }


}


// Create a ES6 class component
class Viewer extends React.Component {


	constructor(props) {
		super(props)

		this.state = {
			upload: false,
            urn: null
		}

        this.bucketUpload = this.bucketUpload.bind(this)
	}

	componentDidMount() {
		this.authenticate()
	}

	render() {
		return (
			<div class="viewer-container">
                <div id="Viewer" key={this.state.urn}>
                    <div className="viewer-inner">
                        <div className="viewer-content">

            				{this.state.upload ?
            				    <FileUploader uploadMAX={this.state.uploadMAX} bucketUpload={this.bucketUpload} />
            					:
            					<div className="loading"></div>
            				}

                        </div>
                    </div>
    			</div>
                {this.state.cancelable && <div className="reset-button"><i onClick={this.props.reset} className="fas fa-lg fa-ban"></i></div>}
            </div>
		);
	}

    authenticate() {

        if (Utils.getCookie('forge_token')) {
            this.getUploadMAX()
        } else {
            $.ajax({
                method: 'POST',
                url: 'forge/authenticate',
                success: (data) => {
                    this.getUploadMAX()
                },
                error: (xhr) => {
                    console.log(xhr)
                }
            });
        }

    }

    bucketDetail() {

        $.ajax({
            method: 'POST',
            url: 'forge/bucket',
            success: (data) => {
                this.state.urn ? this.modelJob() : this.uploadReady()
            },
            error: (xhr) => {
                console.log(xhr)
            }
        })
    }

    bucketUpload(file) {

        console.log('bucketUpload')

        this.setState({upload: false})

        var form = new FormData()

        form.append('file', file)

        $.ajax({
            method: 'POST',
            url: 'forge/upload',
            data: form,
            cache: false,
            contentType: false,
            processData: false,
            success: (data) => {
                console.log('response', data)

                if (data) {
                    this.setState({urn: btoa(data.objectId)}, () => this.modelJob(file))
                } else {
                    $('#Viewer').html('<div class="viewer-inner"><div class="viewer-content"><p>Upload failed</p></div></div>');
                }
            },
            error: (xhr) => {
                console.log('error', xhr)
            }
        })

    }

    documentLoadFailure(viewerErrorCode) {
        console.error('onDocumentLoadFailure - error' + viewerErrorCode);
        $('#Viewer').html('<div class="viewer-inner"><div class="viewer-content"><p>' + 'onDocumentLoadFailure - error' + viewerErrorCode + '</p><a href="mailto:thomas.page@mail.mcgill.ca?subject=Site Feedback -- AM Candidate Detection">Submit feedback</a></div></div>');
        this.setState({cancelable: true})
    }

    documentLoadSuccess(document) {
        console.log('document load success')

        var viewables = viewerApp.bubble.search({'type':'geometry'});
        if (viewables.length === 0) {
            console.error('Document contains no viewables.');
            return;
        }

        viewerApp.selectItem(viewables[0], this.modelLoadSuccess.bind(this), this.modelLoadFailure.bind(this))
        this.replaceSpinner();

    }

    getUploadMAX() {
        $.ajax({
            method: 'POST',
            url: 'main/uploadMAX',
            success: (data) => {
                console.log(data)
                this.setState({uploadMAX: data})
                this.bucketDetail()
            },
            error: (xhr) => {
                console.log(xhr)
            }
        })
    }

    modelJob(file) {
        // Route /api/forge/modelderivative
        var format_type = 'svf';
        var format_views = ['3d'];

        $.ajax({
            method: 'POST',
            url: 'forge/model',
            data: {
                input: {
                    urn: this.state.urn
                },
                output: {
                    formats: [
                        {
                            type: format_type,
                            views: format_views
                        }
                    ]
                }
            },
            success: (data, textStatus, xhr) => {
                if (xhr.status == 201) {
                    console.log('already uploaded')
                    this.viewerReady()
                } else {
                    console.log('new file')
                    fetchStatusInterval = setInterval(() => this.modelStatus(), 5000)
                    console.log('response', data)
                }
            },
            error: (xhr) => {
                console.log('error', xhr)
                $('#Viewer').html('<div class="viewer-inner"><div class="viewer-content"><p>Model conversion failed</p><p>' + xhr.responseJSON + '</p><a href="mailto:thomas.page@mail.mcgill.ca?subject=Site Feedback -- AM Candidate Detection&body=' + 'Failed file conversion%0D%0A' + 'name: `' + file.name + '`%0D%0Asize: ' + file.size + '%0D%0Atype: ' + file.type + '">Submit feedback</a></div></div>');
                this.setState({cancelable: true})
            }
        })

    }

    modelLoadFailure(viewerErrorCode) {
        console.error('onLoadModelError() - errorCode:' + viewerErrorCode);
        $('#Viewer').html('<div class="viewer-inner"><div class="viewer-content"><p>There is an error fetching the translated SVF file. Please try refreshing the page.</p></div></div>');
    }

    modelLoadSuccess(viewer, item) {

        this.setState({cancelable: true})

		viewer.addEventListener( Autodesk.Viewing.GEOMETRY_LOADED_EVENT, () => {
            viewer.loadExtension('Autodesk.ADN.Viewing.Extension.MeshData').then(

                (MeshData) => {

                    console.log(MeshData)

                    var properties = MeshData.getProperties()

                    this.props.updateForm({
                        units: 'mm',
                        elements: properties
                    })

                    console.log(properties)

                }, (err) => {

                console.log('Error loading extension: ')
                console.log(err)
            })

            viewer.navigation.setZoomTowardsPivot(true)

        })

        // Congratulations! The viewer is now ready to be used.
        console.log('Viewers are equal: ' + (viewer === viewerApp.getCurrentViewer()));

    }

    modelStatus() {

        console.log('model status')
        this.setState({cancelable: true})

        $.ajax({
            method: 'POST',
            url: 'forge/status',
            data: {
                urn: this.state.urn
            },
            success: (data) => {
                console.log('response', data, data.progress)

                if (data.status == 'failed') {
                    clearInterval(fetchStatusInterval)
                    $('#Viewer').html('<div class="viewer-inner"><div class="viewer-content"><p>Model conversion failed</p><a href="mailto:thomas.page@mail.mcgill.ca?subject=Site Feedback -- AM Candidate Detection">Submit feedback</a></div></div>');

                } else if (data.progress == "complete") {
                    clearInterval(fetchStatusInterval)
                    fetchPercentage = 100
                    this.viewerReady()

                } else {
                    var new_percentage = data.progress.split("%")[0]

                    if (new_percentage == 0) {
                        fetchPercentage = (fetchPercentage ? fetchPercentage : 0) + 5
                    } else if (new_percentage > percentage) {
                        fetchPercentage = new_percentage
                    }
                }

            },
            error: (xhr) => {
                console.log('error', xhr)
            }
        })

    }

    replaceSpinner() {
        var spinners = document.getElementsByClassName("spinner");
        if (spinners.length == 0) return;
        var spinner = spinners[0];
        spinner.classList.remove("spinner");
        spinner.innerHTML = '<div class="viewer-inner"><div class="viewer-content"><div class="loading"></div></div></div>'

    }

    reset() {
        this.setState({
            cancelable: false,
            upload: true,
            urn: null
        }, this.viewerDestroy)
    }

    uploadReady() {

    	this.setState({upload: true})
    }

    viewerDestroy(cb) {

        if (viewerApp) {

            var viewer = viewerApp.getCurrentViewer()

            if (viewer) {
                var gl = viewer.canvas.getContext('webgl')
            }

            viewerApp.finish()
            viewerApp = null

            if (viewer) {
                var numTextureUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
                for (var unit = 0; unit < numTextureUnits; ++unit) {
                  gl.activeTexture(gl.TEXTURE0 + unit);
                  gl.bindTexture(gl.TEXTURE_2D, null);
                  gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
                }
                gl.bindBuffer(gl.ARRAY_BUFFER, null);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
                gl.bindRenderbuffer(gl.RENDERBUFFER, null);
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);

                var buf = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, buf);
                var numAttributes = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
                for (var attrib = 0; attrib < numAttributes; ++attrib) {
                  gl.vertexAttribPointer(attrib, 1, gl.FLOAT, false, 0, 0);
                }

                gl.canvas.width = 1;
                gl.canvas.height = 1;

                gl.getExtension('WEBGL_lose_context').loseContext();
            }

        }
    }

    viewerReady() {
        console.log('viewer ready')
        this.viewerStart()
    }

    viewerStart() {

        var documentId = 'urn:' + this.state.urn;

        console.log(documentId)

        // Run this when the page is loaded
        Autodesk.Viewing.Initializer(options, () => {
            viewerApp = new Autodesk.Viewing.ViewingApplication("Viewer");
            viewerApp.registerViewer(viewerApp.k3D, Autodesk.Viewing.Viewer3D);
            viewerApp.loadDocument(documentId, this.documentLoadSuccess.bind(this), this.documentLoadFailure.bind(this));
        });

    }

}
