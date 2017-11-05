<?php


class CurlOutput
{
	public $error; // "" 
	public $response; // []
}	


// Helper Functions
function curlSend(string $url, array $http_header, array $post_fields): CurlOutput
{
    $curl = curl_init();

    curl_setopt_array($curl, [ 
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_HTTPHEADER => $http_header
    ]);

    $output = new CurlOutput();
    $output->response = curl_exec($curl);
    $output->error = curl_error($curl);

    curl_close($curl);

	return $output;
}

function scope(Callable $func)
{
	return call_user_func($func);
}

// Routing
ini_set('date.timezone', 'America/New_York');

$server_method = $_SERVER['REQUEST_METHOD']; 
$server_uri = scope(function() { 
	$uri = $_SERVER['REQUEST_URI'];
	$pos = strpos($uri, '?');
	if ($pos)
	{
		$uri = substr($uri, 0, $pos);
	}
	return $uri;
});

// home is used for index and 404

if("/" == $server_uri &&
   "GET" == $server_method)
{
    scope(function() {
        session_start();
        $_SESSION['csrf_token'] = bin2hex(openssl_random_pseudo_bytes(16));
        include "../form.php";
    });
} 

else if ("/api/save" == $server_uri &&
         "POST" == $server_method)
{
    // Call MySql StoredProcedure
	echo json_encode(["errors" => []], true);
}

else if ("/api/email_subscribe" == $server_uri &&
         "POST" == $server_method)
{
    scope(function() {
	session_start();
	if(isset($_POST['email_address']) 
		&& isset($_POST['csrf_token']) 
		&& $_POST['csrf_token'] == $_SESSION['csrf_token'])
	{
		$filtered_email = filter_var($_POST['email_address'], FILTER_SANITIZE_EMAIL);
		file_put_contents("../emails.txt", $_POST['csrf_token'] . ', '.date("Y-m-d h:i:s") .  ", " . $filtered_email . "\n", FILE_APPEND);
		$curl_post_fields = [
			"email_address" => $filtered_email,
			"status" 				=> "subscribed",
		];
		$curl_url = "https://us7.api.mailchimp.com/3.0/lists/52a4be760a/members";
		$curl_http_header = [ 
			"authorization: apikey 0b9f12e183e64a7d918b8733126e2735-us7",
			"cache-control: no-cache",
			"content-type: application/x-www-form-urlencoded"
		];
		$curl_data = curlSend($curl_url, $curl_http_header, $curl_post_fields);
		if ($curl_data->error == NULL)
		{
			if (isset($curl_data->response['status']))
			{
				http_response_code($curl_data->response['status']);
				if ($curl_data->response['status'] == 500)
				{
					errorSend("Saginaw - Error from /email_subscribe", "500 ". json_encode($curl_data->response));
				}
			}
			else
			{
				errorSend("Saginaw - Error, mailchimp result has no status", "500 no status");
			}

			$response = $curl_data->response;
		}
		else
		{
			http_response_code(500);
			errorSend("Saginaw - Error from /email_subscribe", "500 ". $curl_data->error);
			$response = ["message" => "Error: " . $curl_data->error];
		}
	}
	else
	{
		if (!isset($_POST['csrf_token']))
		{
			errorSend("Saginaw - Error from /email_subscribe", "500 csrf_token not found in POST");
			$response['server_error'] = "No csrf token in request";
		}
		else
		{
			errorSend("Saginaw - Error from /email_subscribe", "500 email_address probably not found in POST");
			$response['server_error'] = "No email_address probably in request";
		}
		header('HTTP/1.1 500 Internal Server Error');
		$response['message'] = "Oops! Something broke, did you enter your email?";
	}
	echo json_encode($response, true);
    });
} // "/api/email_subscribe" 

else {
    scope(function() {
        echo "A great 404 page goes here";
    } );
}

