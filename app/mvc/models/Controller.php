<?php

/**
 * Controller Class
*
* Base class for all controllers in the system
*
* @name Controller
* @abstract
*/
abstract class Controller
{

	public static $oApiDriver = null;


	/**
	 * Constructor
	 *
	 * Initialises the Controller instance
	 *
	 * @name Controller
	 * @access public
	 * @return Controller
	 */
	public function __construct()
	{
		// Create the instance of the API Driver with the given session
		self::$oApiDriver = new _ApiDriver();

	}

	/**
	 * AJAX Response
	 *
	 * Prints out a standardised format for AJAX messages
	 *
	 * @name ajaxResponse
	 * @access public
	 * @static
	 * @param mixed $data				The data to send back
	 * @param bool $error				If the data is an error message
	 * @return false					Returns false so ::load can return it
	 */
	public static function ajaxResponse(/*mixed*/ $data)
	{
		// Set the proper header
		header('Content-Type: application/json; charset=utf-8');

		// Init the return response
		$aJSON	= $data;

		// Encode it and echo it
		echo json_encode($aJSON);

		// Return false for ::load
		return false;
	}

	/**
	 * AJAX Error
	 *
	 * Prints out a standardised error for AJAX messages from an exception
	 *
	 * @name ajaxError
	 * @access public
	 * @static
	 * @param Exception $exception		The exception to return as an error
	 * @return false
	 */
	public static function ajaxError($exception)
	{
		// Set the proper header
		header('Content-Type: application/json; charset=utf-8');

		// Init the return response
		$aJSON = $exception->getMessage();

		// Encode it and echo it
		echo json_encode($aJSON);

		// Return false for ::load
		return false;
	}

	/**
	 * Load
	 *
	 * Must be implemented by all classes that extend Controller. Should return
	 * false if no action should be taken after it's called. e.g. displaying a
	 * view of some sort.
	 *
	 * @name load
	 * @access public
	 * @abstract
	 * @return bool
	 */
	abstract public function load();

	/**
	 * Parse Size
	 *
	 * Coverts PHP shorthandbyte to bytes
	 *
	 * @name parse_size
	 * @access public
	 * @static
	 * @param string $size				The PHP shorthand
	 * @return size						Returns size in bytes
	 */
	public static function parse_size( /* string */ $size)
	{
		$unit = preg_replace('/[^bkmgtpezy]/i', '', $size); // Remove the non-unit characters from the size.
		$size = preg_replace('/[^0-9\.]/', '', $size); // Remove the non-numeric characters from the size.
		if ($unit) {
			// Find the position of the unit in the ordered string which is the power of magnitude to multiply a kilobyte by.
			return round($size * pow(1024, stripos('bkmgtpezy', $unit[0])));
			}
		else {
			return round($size);
		}
	}

}

