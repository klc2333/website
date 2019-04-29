<?php
// Include and instantiate the class.

class api_forge extends API {


	public function authenticate()
	{

		$sURL = 'https://developer.api.autodesk.com/authentication/v1/authenticate';

		$headers = array(
			'Content-Type' => 'Content-Type: application/x-www-form-urlencoded'
		);

		$oResult = self::$oApiDriver->request($sURL, 'POST', $this->aFields, $headers);

		return $oResult;

	}

	public function bucket($sURL = '')
	{

		$oResult = self::$oApiDriver->request($sURL, 'GET', null, null, $_COOKIE['forge_token']);

		return $oResult;

	}

	public function model()
	{

		$sURL = 'https://developer.api.autodesk.com/modelderivative/v2/designdata/job';

		$oResult = self::$oApiDriver->request($sURL, 'POST', json_encode($this->aFields), null, $_COOKIE['forge_token']);

		return $oResult;

	}

	public function status($sURL = '')
	{

		$oResult = self::$oApiDriver->request($sURL, 'GET', null, null, $_COOKIE['forge_token']);

		return $oResult;

	}

	public function upload($sURL)
	{

		$handle = fopen($this->aFields['file']['tmp_name'], "rb");
		$contents = fread($handle, filesize($this->aFields['file']['tmp_name']));

		$oResult = self::$oApiDriver->request($sURL, 'PUT', $contents, null, $_COOKIE['forge_token']);

		return $oResult;

	}

}
