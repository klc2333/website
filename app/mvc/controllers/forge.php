<?php
// Include and instantiate the class.

class forge_controller extends Controller {


	private $api_key;
	private $api_secret;

	private $bucket_key;


    public function __construct(){

        $this->api_key = 'W4y43jQ1FlfAYWcCGASIoLos1dOmY3XC';
        $this->api_secret = 'ZtPcGfGpXzaeQ4oO';

        $this->bucket_key = strtolower($this->api_key) . '_adml_bucket_2';

    }


	/**
	 * Load
	 *
	 * Main entry point into the controller, handles dispatching requests
	 *
	 * {@inheritDoc}
	 * @see Controller::load()
	 * @name load
	 * @access public
	 * @param string $action
	 * @return false|void
	 */
	public function load($action = null){
		$this->args = func_get_args();

	   //var_dump($this->args[0]);
		if(isset($this->args[0])) {
			switch($this->args[0])
			{
				case 'authenticate':
					return $this->authenticate();
				case 'bucket':
					return $this->bucket();
				case 'model':
					return $this->model();
				case 'status':
					return $this->status();
				case 'upload':
					return $this->upload();
				default:
					# code...
					break;
			}
		}

	}


	public function authenticate()
	{
		try
		{
			$data = array(
				'client_id' => $this->api_key,
				'client_secret' => $this->api_secret,
				'grant_type' => 'client_credentials',
				'scope' => 'data:read data:write data:create bucket:create bucket:read'
			);

			$oForge = new api_Forge($data);
			$oResult = $oForge->authenticate();

			// Keep token in cookies
			setcookie("forge_token", $oResult['access_token'], time() + $oResult['expires_in'], "/");

			return $this->ajaxResponse($oResult);

		}
		catch(_ApiException $e) {

			return $this->ajaxError($e);
		}
	}

	public function bucket()
	{

		// $oForge = new api_Forge();
		// $oForge->bucketCreate($this->bucket_key, $this->api_key);

		try
		{
			$oForge = new api_Forge();
			$oResult = $oForge->bucket($this->bucket_key);

			return $this->ajaxResponse($oResult);
		}
		catch(_ApiException $e) {

			return $this->ajaxError($e);
		}
	}

	public function model()
	{
		try
		{

			$oForge = new api_Forge($_POST);
			$oResult = $oForge->model();

			return $this->ajaxResponse($oResult);
		}
		catch(_ApiException $e) {

			return $this->ajaxError($e);
		}
	}

	public function status()
	{
		try
		{

			$oForge = new api_Forge();
			$oResult = $oForge->status('https://developer.api.autodesk.com/modelderivative/v2/designdata/' . $_POST['urn'] . '/manifest');

			return $this->ajaxResponse($oResult);
		}
		catch(_ApiException $e) {

			return $this->ajaxError($e);
		}
	}

	public function upload()
	{
		try
		{

			$sURL = 'https://developer.api.autodesk.com/oss/v2/buckets/' . urlencode($this->bucket_key) . '/objects/' . urlencode($_FILES['file']['name']) . '';

			$oForge = new api_Forge($_FILES);
			$oResult = $oForge->upload($sURL);

			return $this->ajaxResponse($oResult);
		}
		catch(_ApiException $e) {

			return $this->ajaxError($e);
		}
	}

}
