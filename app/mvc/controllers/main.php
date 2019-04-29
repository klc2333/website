<?php
// Include and instantiate the class.

class main_controller extends Controller {

	private $accounts = array(
		'loughborough' 		=> 'RWb5MnjJ',
		'adml' 				=> 'vuqM4WtK'
	);

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
				case 'login':
					return $this->login();
				case 'uploadMAX':
					return $this->uploadMAX();
				default:
					# code...
					break;
			}
		}
	}

	public function login()
	{
		try
		{

			if (isset($this->accounts[$_POST['username']]) && ($_POST['password'] == $this->accounts[$_POST['username']]) ) {

				return $this->ajaxResponse(true);

			} else {

				throw new _ApiError(401, 'Username or password is incorrect');
			}
		}
		catch(_ApiException $e) {

			return $this->ajaxError($e);
		}
	}

	public function uploadMAX()
	{
		return $this->ajaxResponse(ini_get('upload_max_filesize'));
	}

}
