<?php
/**
 * API class
 *
 * @name API
 */
class API
{
	/**
	 * Fields
	 *
	 * The list of fields and data associated with the instance (only used by
	 * children instance)
	 *
	 * @var array
	 * @access public
	 */
	public $aFields	= null;

	/**
	 * Initialised
	 *
	 * Used to identify if the API is initialised
	 *
	 * @var boolean
	 * @access protected
	 */
	protected static $initialised = false;

	/**
	 * API Driver
	 *
	 * Holds an instance of the API Driver
	 *
	 * @var _ApiDriver
	 * @access protected
	 * @static
	 */
	protected static $oApiDriver = null;

	/**
	 * Constructor
	 *
	 * Initialises the instance and stores the fields and values (if there is
	 * any)
	 *
	 * @name API
	 * @access public
	 * @param array $fields				The fields and values
	 * @return API
	 */
	public function __construct($fields = array())
	{
		// Store the field data
		$this->aFields = $fields;

		$this->init();
	}

	/**
	 * Current
	 *
	 * Returns the currently logged in user
	 *
	 * @name current
	 * @access public
	 * @static
	 * @return api_auth_Login
	 */
	public static function current()
	{
		return self::$oCurrLogin;
	}

	/**
	 * Initialise
	 *
	 * Initialises the API models so they are ready to be used to call anything
	 * from the API
	 *
	 * @name init
	 * @access public
	 * @static
	 * @param string $token				The API session token
	 * @return bool
	 */
	public static function init()
	{
		// If we don't already have an instance
		if(is_null(self::$oApiDriver))
		{

			// Create the instance of the API Driver with the given session
			self::$oApiDriver = new _ApiDriver();

			// Set the initialised flag
			self::$initialised = true;
		}

		// Return OK
		return true;
	}

	/**
	 * Initialised
	 *
	 * Returns the initialised state
	 *
	 * @name initialised
	 * @access public
	 * @static
	 * @return bool
	 */
	public static function initialised() {
		return self::$initialised;
	}

	/**
	 * To Array
	 *
	 * Returns the field data as a plain array
	 *
	 * @name toArray
	 * @access public
	 * @return array
	 */
	public function toArray()
	{
		return $this->aFields;
	}

	/**
	 * Get Driver
	 *
	 * Returns the current driver instance
	 *
	 * @name getDriver
	 * @access public
	 * @static
	 * @return ApiDriver
	 */
	public static function getDriver()
	{
		return self::$oApiDriver;
	}

}
