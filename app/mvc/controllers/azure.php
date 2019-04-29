<?php
// Include and instantiate the class.

class azure_controller extends Controller {


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
				case 'predict':
					return $this->predict();
				case 'update':
					return $this->update();
				default:
					# code...
					break;
			}
		}

	}


	public function predict()
	{
		try
		{

			$oAzure = new api_Azure($_POST);
			$oResult = $oAzure->predict();

			return $this->ajaxResponse($oResult);
		}
		catch(_ApiException $e) {

			return $this->ajaxError($e);
		}
	}

	public function update()
	{
		try
		{

			$oAzure = new api_Azure($_POST);
			$oResult = $oAzure->update();

			return $this->ajaxResponse($oResult);
		}
		catch(_ApiException $e) {

			return $this->ajaxError($e);
		}
	}
}
