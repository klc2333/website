<?php
/**
 * Index
 *
 * Primary entry point into the app host
 *
 * @author Thomas Page
 * @created 2019-04-19
 */

    // Get the current directory of this file
    $gsCommonPath   = dirname(__FILE__);

    // Set the root path of the application as the working directory
    chdir(realpath($gsCommonPath . '/..'));

    // Auto load local classes
    spl_autoload_register(function ($class) {
        require 'mvc/models/' . str_replace('_', DIRECTORY_SEPARATOR, $class) . '.php';
    });

    $UPLOAD_MAX_FILESIZE = ini_get('upload_max_filesize');

    /*********************************
     * Load the controller and default view
     ********************************/

    $sURI = $_SERVER['REQUEST_URI'];

    $sURI = explode("/app/",$sURI);
    $sURI = isset($sURI[1]) ? $sURI[1] : "";

    $aURL   = (isset($sURI) && $sURI != '') ?
                explode('/', trim($sURI, '/')) :
                array();


    // If there's no URL, default to the homepage
    if(empty($aURL))
    {
        // Set the controller to static
        $gsController   = 'main';
        $aURL           = array();
    }
    // Else, see if the URL matches a controller
    else
    {
        // Shift off the controller
        $gsController   = array_shift($aURL);

        // If the controller doesn't exist
        if(!in_array($gsController, array(
            'main',
            'forge',
            'azure'
        ))) {
            array_unshift($aURL, $gsController);
            $gsController   = 'notfound';
        }

    }

    // Catch any _ApiExceptions or normal Exceptions so that they are properly
    //  handled
    try
    {
        // Generate the path to the controller
        $sCtrlPath  = 'mvc/controllers/' . $gsController . '.php';

        // Load the controller into memory
        require $sCtrlPath;

        // Generate the class name
        $sCtrlClass = $gsController . '_controller';

        // Create a new instance of the controller
        $oCtrl  = new $sCtrlClass();

        // print_r($oCtrl);

        // And load it by passing the arguments to it after removing the controller name
        $bRet   = call_user_func_array(array($oCtrl, 'load'), $aURL);

        // If the controller didn't return false, render the View
        if(false !== $bRet)
        {
            ob_start('mb_output_handler');
            include 'mvc/views/' . $gsController . '.html';
            echo ob_get_clean();
        }

    }
    catch(_ApiException $e)
    {

        throw $e;

    }
