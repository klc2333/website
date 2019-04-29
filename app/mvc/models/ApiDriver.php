<?php

/**
 * API Driver class
 *
 * Used to make calls to the API
 *
 * @name Api
 */
class _ApiDriver
{
	public static $MAX_RETRIES	= 0;

	/**
	 * cURL
	 *
	 * A resource to an open cURL instance
	 *
	 * @var resource
	 * @access private
	 */
	private $rCURL = null;

	/**
	 * Constructor
	 *
	 * Instantiates an instance of the class
	 *
	 * @name _ApiDriver
	 * @access public
	 * @param _ApiSession $session		The current session associated with the request
	 * @return _ApiDriver
	 */
	public function __construct()
	{

		// Create a new cURL instance
		$this->rCURL		= curl_init();

		// Get the current version of curl
		$aVer				= curl_version();

		// Set curl options
		curl_setopt_array($this->rCURL, array(
			CURLOPT_CONNECTTIMEOUT	=> 15,
			CURLOPT_FOLLOWLOCATION	=> true,
			CURLOPT_RETURNTRANSFER	=> true
		));
	}

	/**
	 * Destructor
	 *
	 * Destroys the instance
	 *
	 * @name ~_ApiDriver
	 * @access public
	 * @return null
	 */
	public function __destruct()
	{
		// If we have a cURL resource, free it
		if(!is_null($this->rCURL)) {
			curl_close($this->rCURL);
		}
	}

	/**
	 * Request
	 *
	 * Sends a properly formatted request to the Service requested
	 *
	 * @name request
	 * @access private
	 * @param string $url				The URL of the request
	 * @param string $method			The method to send the request with
	 * @param array $data				The data to convert to JSON and put in the body
	 * @return
	 */
	public function request($url, $method, $data = null, $headers = null, $token=null, $retries = 0)
	{
		if(!isset($data)) {
			$data = array();
		}

		if(!isset($headers)) {
			$headers = array();
		}

		// Encode the message body and get the length
		if (gettype($data) != 'string') {
			$sBody	= http_build_query($data);
		} else {
			$sBody = $data;
		}
		$iBody	= mb_strlen($sBody);
		$sUrl	= $url;

		// Create the header array
		$aHeaders			= array(
			'Content-Type' =>'Content-Type: application/json; charset=UTF-8',
			'Content-Length' => 'Content-Length: ' . $iBody
		);

		// If we have a session token add it to the headers
		if(isset($token)) {
			$aHeaders['Authorization']	= 'Authorization: Bearer ' . $token . '';
		}

		$aHeaders = array_merge($aHeaders,$headers);
		$aHeaders = array_values($aHeaders);

		// If we are making a GET request
		if($method == 'GET')
		{
			$sUrl	.= '?' . $sBody;
			curl_setopt_array($this->rCURL, array(
				CURLOPT_CUSTOMREQUEST	=> 'GET',
				CURLOPT_HTTPGET			=> true,
				CURLOPT_HTTPHEADER		=> $aHeaders,
				CURLOPT_URL				=> $sUrl
			));
		}
		// Else if it's a DELETE, POST, or PUT request
		else if(in_array($method, array('DELETE', 'POST', 'PUT')))
		{
			curl_setopt_array($this->rCURL, array(
				CURLOPT_CUSTOMREQUEST	=> $method,
				CURLOPT_HTTPHEADER		=> $aHeaders,
				CURLOPT_POSTFIELDS		=> $sBody,
				CURLOPT_URL				=> $sUrl
			));
		}
		// Else the method is invalid
		else {
			return new _ApiError(10, $method);
		}


		// Send the request and get the result
		$sContent	= curl_exec($this->rCURL);

		// If the response is anything other than 200
		if(($sHttpCode = curl_getinfo($this->rCURL, CURLINFO_HTTP_CODE)) != 200)
		{
			// Increment the retries, if we are over the max
			if(++$retries > self::$MAX_RETRIES) {
				return new _ApiError($sHttpCode, $sContent);
			}

			// Else, sleep for half a second, then try again and return the result
			usleep(500000);
			return $this->request($url, $method, $data, $retries);
		}

		// Else decode the content as JSON and return it
		return json_decode($sContent, true);
	}

}

/**
 * API Data
 *
 * Shorthand for returning an _ApiResult instance with only data
 *
 * @name _ApiData
 * @extends _ApiResult
 */
class _ApiData extends _ApiResult
{
	/**
	 * Constructor
	 *
	 * Sets just the data part of the parent
	 *
	 * @name _ApiData
	 * @access public
	 * @param mixed $data				The data part of the result
	 * @return _ApiData
	 */
	public function __construct(/*mixed*/ $data)
	{
		// Call the parent constructor
		parent::__construct($data);
	}
}

/**
 * API Error
 *
 * Shorthand for returning an _ApiResult instance with only an error
 *
 * @name _ApiError
 * @extends _ApiResult
 */
class _ApiError extends _ApiResult
{
	/**
	 * Constructor
	 *
	 * Sets just the error part of the parent
	 *
	 * @name _ApiError
	 * @access public
	 * @param mixed $error
	 * @return _ApiError
	 */
	public function __construct(/*mixed*/ $code = 200, /*string*/ $data = null)
	{
		header('HTTP/1.0 ' . $code);
		throw new _ApiException($data);
	}
}

/**
 * API Exception
 *
 * Used to send API errors that can be handled
 *
 * @name _ApiException
 * @extends Exception
 */
class _ApiException extends Exception {

	public static function fromResult($oRes) {

		return new _ApiException(
			isset($oRes->error['msg']) ? $oRes->error['msg'] : $oRes->error['code'],
			$oRes->error['code']
		);
	}

}

/**
 * API Result class
 *
 * Used as a result from API calls
 *
 * @name _ApiResult
 */
class _ApiResult
{
	/**
	 * Data
	 *
	 * Holds the data part of the result if there is one
	 *
	 * @var mixed
	 * @access public
	 */
	public $data	= null;


	/**
	 * Constructor
	 *
	 * Instantiates the members of the instance
	 *
	 * @name _ApiResult
	 * @access public
	 * @param mixed $error				The error part of the result
	 * @param mixed $data				The data part of the result
	 * @param mixed $warning			The warning part of the result
	 * @return _ApiResult
	 */
	public function __construct(/*mixed*/ $data)
	{
		// Store the arguments locally
		$this->data	= $data;
	}

	/**
	 * To String
	 *
	 * Magic method that is called when an instance is passed to something that
	 * requires a string
	 *
	 * @name __toString
	 * @access public
	 * @return string
	 */
	public function __toString()
	{

		// Convert the array to JSON and return it
		return json_encode($this->data);
	}

	/**
	 * From String
	 *
	 * Converts the results of __toString back into an _ApiResult and returns it
	 *
	 * @name fromString
	 * @access public
	 * @static
	 * @throws _ApiException
	 * @param string|array $json		An encoded or decoded JSON structure
	 * @return _ApiResult
	 */
	public static function fromString(/*string|array*/ $json)
	{
		// If we don't already have an array, assume the string is JSON and
		//	convert it to an associative array
		if(!is_array($json)) {
			$json	= json_decode($json, true);
		}

		// Create a new _ApiResult instance and return it
		return new _ApiResult($json);
	}

	/**
	 * Has Data
	 *
	 * Returns true if the result has data in the message
	 *
	 * @name hasData
	 * @access public
	 * @return bool
	 */
	public function hasData()
	{
		return !is_null($this->data);
	}

}
