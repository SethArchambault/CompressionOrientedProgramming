<!doctype html>
<html lang="en-US">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<title>Compression Oriented Programming</title>
<meta name="csrf-token" content="<?php echo $_SESSION['csrf_token']; ?>">
<meta name="description" content="">
<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
<style> /* Style tags? Yep! No need for the browser to download a second file for a single page app. */

/*  Took a few icons from font awesome, created a font using http://icomoon.io */
    @font-face {font-family: 'icons'; src:  url('fonts/icons.eot?wzct3a'); src:  url('fonts/icons.eot?wzct3a#iefix') format('embedded-opentype'), url('fonts/icons.ttf?wzct3a') format('truetype'), url('fonts/icons.woff?wzct3a') format('woff'), url('fonts/icons.svg?wzct3a#refimyride') format('svg'); font-weight: normal; font-style: normal;}
    [class^="fa-"], [class*=" fa-"] {font-family: 'icons' !important; speak: none; font-style: normal; font-weight: normal; font-variant: normal; text-transform: none; line-height: 1; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;}
    .fa-user:before {content: "\e900";}
    .fa-envelope:before {content: "\e901";}
    .fa-angle-right:before {content: "\e902";}
    .fa-drivers-license:before {content: "\e903";}
    .fa-address-card-o:before {content: "\e903";}

/* CSS Fix - No need for CSS resets these days. */
    html {
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: transparent;
    }
    body {
    margin: 0;
    line-height: 1;
    font-family: sans-serif;
    -webkit-font-smoothing: antialiased; 
    background: #ffffff;
    font-size: 16px;
    color: #333;
    }
    h1,h2,h3,h4,h5,h6 {
    margin-top: 0;
    margin-bottom: 0;
    font-size: inherit;
    }
    p {
    margin-top: 0;
    margin-bottom: 0;
    }
    strong {
    font-weight: bold;
    }
    img {
    border: 0;
    max-width: 100%;
    height: auto;
    vertical-align: middle;
    }
    a {
    text-decoration: underline;
    color: inherit;
    color:#58538B;
    }
    a:hover {
    text-decoration:none;
    }
    ::-moz-focus-inner {
    border: 0;
    padding: 0;
    }

/* General 

accent color: rgb(79, 179, 110);

 */

    p {
        font-size: 14px;
        line-height:1.5em;
        padding:0 0 10px;
        margin:0;
    }
    hr {
        color: #a9a9a9;
        opacity: 0.3;
    }

/* Found some nice text box stylings online, and customized them, probably with some influence from Bootstrap. */

    select {
        box-sizing: border-box;
        background: transparent;
        width: 100%;
        padding: 5px;
        font-size: 16px;
        line-height: 1;
        height: 34px;
        width:295px;
        display: inline-block;
        height: calc(2.5rem - 2px);
        padding: 0.375rem 1.75rem 0.375rem 0.75rem;
        padding-right: 0.75rem \9;
        color: #55595c;
        vertical-align: middle;
        background: #fff url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='#333' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E") no-repeat right 0.75rem center;
        background-image: none \9;
            background-size: 8px 10px;
        -moz-appearance: none;
        -webkit-appearance: none;
        border-radius: 0px 4px 4px 0px/5px 5px 4px 4px; 
        background-color: #fff; 
        box-shadow: 1px 2px 5px rgba(0,0,0,.09); 
        border: solid 1px hsla(0, 0$, 0%, 0.75);
    }
    @media(min-width:768px)
    {
        select {
            width:339px;
        }
    }

    input[type=radio] {
    visibility: hidden;
    display:none;
    }

    input[type=radio]:checked + label:after {
    opacity: 1;
    }

    label.radio {
    cursor: pointer;
    padding-left:25px;
    padding-right: 10px;
    overflow: visible;
    display: inline-block;
    position: relative;
    margin-bottom: 15px;
    padding-top:3px;
    }


    label.radio:before {
        background: #ffffff;
        border:2px solid hsla(0, 0, 0, 0.75);
        content:'';
        position: absolute;
        top:2px;
        left: 0;
        width: 20px;
        height: 20px;
        border-radius: 100%;
        box-sizing: border-box;         /* Opera/IE 8+ */
    }

    label.radio:after {
        opacity: 0;
        content: '';
        position: absolute;
        width: 0.5em;
        height: 0.25em;
        background: transparent;
        top: 7.5px;
        left: 4.5px;
        border: 3px solid hsla(0, 0%, 0%, 0.75);
        border-top: none;
        border-right: none;
        transform: rotate(-45deg);
    }

    input[type=text],input[type=email]{
        width: 192px; 
        height: 36px; 
        border-radius: 0px 4px 4px 0px/5px 5px 4px 4px; 
        background-color: #fff; 
        box-shadow: 1px 2px 5px rgba(0,0,0,.09); 
        border: solid 1px #666;
        margin-left: 0px;
        margin-top: 0px; 
        padding-left: 10px;
    }
    @media (min-width: 359px) {
        input[type=text],input[type=email]{
        width:236px;
        }
    }

    @media (min-width: 412px) {
        input[type=text],input[type=email]{
        width:281px;
        }
    }

    @media (min-width: 768px) {
        input[type=text],input[type=email]{
        width:281px;
        }
    }

    input:focus {
        box-shadow: inset 0 0 5px hsla(0, 25%, 44%, 1);
        outline: none;
    }

    .icon {
    text-align:left;
    display: inline-block;
	height:20px;
    width: 30px;
        background-color: hsla(0, 0%, 0%, 0.8);
    box-shadow: 1px 2px 5px rgba(0,0,0,.09); 
    padding: 10px 0px 10px 15px;
    color: white;
    border: solid 0px #cbc9c9;
    border-radius: 4px 0px 0px 4px;
    }

    .button {
    font-size: 20px;
    font-weight: 600;
    color: white;
    padding: 8px 25px 0px 20px;
    text-decoration: none;
    text-align: center;
    border-radius: 5px; 
        background-color: hsla(0,0%,0%,0.8);
    box-shadow: 0 3px hsla(0, 0%, 50%, 0.75);
    transition: all 0.1s linear 0s; 
    border-style:none;
    top: 0px;
    position: relative;
    display:block;
    clear:both;
    margin:0 auto 16px;
    width:110px;
    height: 28px;
    }

    .button:hover {
    top: 3px;
    background-color:hsla(0, 0%, 44%, 1);

    box-shadow: none;
    }

</style>
</head>
<body>

<div id="app"></div>

<script id="state" type="text/template">
initialized false 
page 1 
user_name_first 
user_name_middle 
user_name_last 
user_email 
user_member_current 
user_member_id 
user_wayne 
user_comarts 
dollar_plan 
dollar_amount
user_dob 
user_ssn 
home_address 
home_city 
home_state 
home_zipcode 
home_years 
home_previous_address 
home_previous_city 
home_previous_state 
home_previous_zipcode 
job_employer 
job_phone
job_title 
job_income 
job_income_rate
job_years 
job_previous_employer 
user_contact_method 
user_phone 
reference_1_name 
reference_1_phone 
reference_1_address
reference_1_city
reference_1_state
reference_1_zipcode
reference_1_relationship
reference_2_name 
reference_2_phone 
reference_2_address
reference_2_city
reference_2_state
reference_2_zipcode
reference_2_relationship
sending 
error 
completed_form 
</script>     

<script id="template" type="text/template">
( intro 
    _ <div style="max-width:430px; margin:0 auto;padding:20px 10px;"> 
        _ <p style="text-align:center;"><i>Form time!</i></p> 
        _ <p style="text-align:center;">Here's a form:</p> 
    _ </div> 
) intro 
_ <div style="max-width:400px; margin: 0 auto; padding:0 30px 15px;">
( progress_bar_div 
    _ <div style="padding-top:60px;"> 
			_ <div style="border-radius:10px;overflow:hidden;background:hsla(0,0%,0%,0.1);">
			_ <div id="progress_bar" style="transition:width .4s; height:30px;background:rgba(0, 0, 0, 1);" id="progress-bar"></div></div> 
    _ <div style="padding:10px 0;text-align:center;">Page <span id="page"></span> of <span id="page_max"><span></div> 
    _ </div> 
) progress_bar_div 
( page_1 
    _ <hr><br> 
    # First Name
    [text] user_name_first fa-user ~First Name~ 20 
    # Middle Name
    [text] user_name_middle fa-user ~Middle Name~ 20 
    # Last Name
    [text] user_name_last fa-user ~Last Name~ 20 
    [ page_1_error_div
        ! ~Fields Required~ ~<div style="padding-bottom:10px;" id="page_1_error"></div>~ 
    ] page_1_error_div
    [ page_1_next_div 
        >next 2 
    ] page_1_next_div 
) page_1 
( page_2 
    <back 1 
    _ <h1 style="padding-bottom:15px;">Your Eligibility</h1> 
    _ <p>Hi there <span class="user_name_first_span"></span>! Let's Begin.</p> 
    _ <hr> 
    # Are you a member? 
    [checkbox] user_member_current 
    ( user_member_id_div 
        # What is your member ID? 
        [text] user_member_id fa-angle-right ~Member ID~ 20 
    ) user_member_id_div 
    ( user_wayne_div 
        # Do you like marbles? 
        [checkbox] user_wayne 
    ) user_wayne_div 
    [ user_comarts_div 
        # Do you like the color red? 
        [checkbox] user_comarts 
    ] user_comarts_div  
    [ can_be_member_div 
        ! ~Not a problem.~ ~<p>It's okay. Let's continue.</p>~ 
    ] can_be_member_div 
    [ can_not_be_member_div 
        ! ~Sorry!~ ~<p>We're sorry!</p>~ 
    ] can_not_be_member_div 
    [ page_2_next_div 
        >next 3 
    ] page_2_next_div 
) page_2 
( page_3 
    <back 2 
    _ <h1 style="padding-bottom:15px;">Page 3</h1> 
    _ <p>Thanks, <span class="user_name_first_span"></span>! Let's talk.</p> 
    # How much? 
    [text] dollar_amount fa-angle-right ~$~ 20 
    [ dollar_amount_too_small_div 
        ! ~That loan is too small~ ~<p>Sorry, must be greater than $500</p>~ 
    ] dollar_amount_too_small_div 
    [ dollar_amount_too_big_div 
        ! ~That loan is too big~ ~<p>Sorry, can not be greater than $3000</p>~ 
    ] dollar_amount_too_big_div 
    [ dollar_plan_div 
        # What for? 
        [text] dollar_plan fa-angle-right ~Your Plan~ 255 
    ] dollar_plan_div 
    [ page_3_next_div 
        >next 4 
    ] page_3_next_div 
) page_3 
( page_4 
    <back 3 
    _ <h1 style="padding-bottom:15px;">About You</h1> 
    _ <p>Great! Now let's talk about you.</p> 
    # Phone 
    [text] user_phone fa-angle-right ~Phone~ 20  
    # Email
    [text] user_email fa-envelope ~Email~ 50 
    # What's the best way to get in touch? 
    _ <Div id="user_contact_method" style="padding:10px 10px 0; text-align:center;max-width:170px; margin:0 auto;">
    [radio] user_contact_method [Email:email,Phone:phone] 
    _ </div>
    # Birth Date 
    [text] user_dob fa-angle-right ~mm/dd/yyyy~ 11 
    # Social Security Number 
    [text] user_ssn fa-angle-right ~Social Security Number~ 15 
    # Address 
    [text] home_address fa-angle-right ~Address~ 50
    # City  
    [text] home_city fa-angle-right ~City~ 15  
    # State 
    [text] home_state fa-angle-right ~State~ 15  
    # Zipcode  
    [text] home_zipcode fa-angle-right ~Zipcode~ 10  
    # Number of years at residence 
    _ <div id="home_years">
    [radio] home_years [Less than 2 Years:<2,More than 2 Years:>2] 
    _ </div>
    [ home_previous_div  
        _ <hr> 
        # What was your previous address? 
        [text] home_previous_address fa-angle-right ~Address~ 50 
        # What was your previous city? 
        [text] home_previous_city fa-angle-right ~City~ 15 
        # What was your previous state? 
        [text] home_previous_state fa-angle-right ~State~ 15  
        # What was your previous zipcode?  
        [text] home_previous_zipcode fa-angle-right ~Zipcode~ 10 
    ] home_previous_div  
    [ page_4_error_div
        ! ~<span id="page_4_error_title"></span>~ ~<div style="padding-bottom:10px;" id="page_4_error"></div>~ 
    ] page_4_error_div
    [ page_4_next_div
        >next 5 
    ] page_4_next_div
) page_4 
( page_5 
    <back 4 
    _ <h1 style="padding-bottom:15px;">About Your Job</h1> 
    _ <p>Now let's chat about your day gig.</p> 
    # Who is your employer? 
    [text] job_employer fa-angle-right ~Employer~ 15 
    # What is your employer's phone number?
    [text] job_phone fa-angle-right ~Employer Phone~ 15 
    # What is your job title? 
    [text] job_title fa-angle-right ~Job Title~ 10  
    # What is your income? 
    [text] job_income fa-angle-right ~Job Income~ 15  
    # When do you receive the above amount?
    [dropdown] job_income_rate [Choose One:,Hourly:hourly,Weekly:weekly,Biweekly:biweekly,Monthly:monthly,Annually:annually] 
    # How long have you worked at your current job? 
    _ <div id="job_years">
    [radio] job_years [Less than 2 Years:<2,More than 2 Years:>2] 
    _ </div>
    [ job_previous_div 
        _ <hr> 
        # Where did you work before that? 
        [text] job_previous_employer fa-angle-right ~Previous Job~ 15  
    ] job_previous_div 
    # Please provide a couple of refererces. 
    > Please don't use relatives or people you live with as references. 
    # Reference 1 
    [text] reference_1_relationship fa-angle-right ~Relationship~ 50  
    [text] reference_1_name fa-angle-right ~Name~ 20  
    [text] reference_1_phone fa-angle-right ~Phone~ 20  
    [text] reference_1_address fa-angle-right ~Address~ 50
    [text] reference_1_city fa-angle-right ~City~ 15  
    [text] reference_1_state fa-angle-right ~State~ 15  
    [text] reference_1_zipcode fa-angle-right ~Zipcode~ 10  
    # Reference 2 
    [text] reference_2_relationship fa-angle-right ~Relationship~ 50  
    [text] reference_2_name fa-angle-right ~Name~ 20  
    [text] reference_2_phone fa-angle-right ~Phone~ 20  
    [text] reference_2_address fa-angle-right ~Address~ 50
    [text] reference_2_city fa-angle-right ~City~ 15  
    [text] reference_2_state fa-angle-right ~State~ 15  
    [text] reference_2_zipcode fa-angle-right ~Zipcode~ 10  
    [ send_button_div 
        _ <div><a id="send_button" href="javascript:void(0);" class="button">Done</a></div>
    ] send_button_div 
    [ page_5_required_div
        ! ~<span id="page_5_required_title"></span>~ ~<div style="padding-bottom:10px;" id="page_5_required"></div>~ 
    ] page_5_required_div
    [ error_div 
        ! ~Error~ ~<p>Sorry! There was an error. Please contact us.</p>~ 
    ] error_div 
    [ sending_div 
        _ <p style="text-align:center;">Sending...</p> 
    ] sending_div 
    [ end_success_div 
        ! ~Application Submitted~ ~<p>Thanks!</p>~ 
    ] end_success_div 
) page_5 
_ </div> 
</script>
<script src="/app.js"></script>
</body>
</html>

