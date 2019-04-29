<?php
// Include and instantiate the class.

class api_azure extends API {

	private $api_key_predictive;
	private $api_key_revision;

    public function __construct($fields){

        $this->api_key_predictive = 'JVaUMchenTXgnj5y+/tmOhbJKWpfzRwS7gSDh9Cug7STabN8AVq0ErHnztjDGO3qJ6Z4Bl4UjUdDcO4KrlHTyA==';
        $this->api_key_revision = 'ickM5+Q796cPsDfy5LV+PpdgufjidVLIcIrTlVi4w+LjNos1dYIawEf9PpgvlFzPZbCFjLjmU+fg6hdxOm3+Hg==';

        parent::__construct($fields);
    }

	public function predict()
	{

		$sURL = 'https://ussouthcentral.services.azureml.net/workspaces/2f059bd34c7e44ccbec0b9f7512c1c2b/services/402c1d7344fa4d0cb37de8bbf6561f93/execute?api-version=2.0&details=true';

		$oResult = self::$oApiDriver->request($sURL, 'POST', json_encode($this->aFields), null, $this->api_key_predictive);

		return $oResult;

	}

	public function update()
	{

		$sURL = 'https://ussouthcentral.services.azureml.net/workspaces/2f059bd34c7e44ccbec0b9f7512c1c2b/services/c74fd158e581430d846f901c70f9fb03/execute?api-version=2.0&details=true';

		$oResult = self::$oApiDriver->request($sURL, 'POST', json_encode($this->aFields), null, $this->api_key_revision);

		return $oResult;

	}

}
