/*
Code Overview

Two Global Variables:
		prop - for constants (just page_max)
		state - for changing state

Three Main Functions:
		stateUpdate - after every event, keep state in sync 
		domUpdate - update dom after every state change
		template - convert template tag in form.php to html

Dom Utility Functions:
		get - replacement for $('#myid')
		scope - simple closure
		fieldsGlowOn - Highlight fields that should of been filled out by now
		fieldsGlowOff

Events: All events call stateUpdate

Guiding Principles
- Easy to gain mastery over
-- No outside documentation needed
-- Minimal amount of connections to follow

*/



/* globals */
		var prop = {};
		prop.page_max = 5;
		var state = {};

/* Utility Functions */
		function get(id)
		{
				return document.getElementById(id);
		}

		function scope(func)
		{
				return func();
		}

/* Events */
		window.onload = stateUpdate;
		window.onhashchange = stateUpdate;
		window.onkeyup = stateUpdate;
		window.oninput = stateUpdate; //keyup for firefox android
		window.onunfocus = stateUpdate;
		window.onclick = stateUpdate;
		window.onchange = stateUpdate;
		window.ontouchend = stateUpdate;

function stateUpdate(e)
{
		var state_old = JSON.parse(JSON.stringify(state));

		/********** router ************/
		if (e.type == "load" || (e.type == "hashchange"))
		{
				if (e.type == "load")
				{
						// stateInit
								state = (function(raw) {
										var lines = raw.match(/.+/g);
										var _state = {};
										for (var n = 0; n < lines.length; ++n)
										{
												var line = /\s*(\S+)\s*(.*)\s*/.exec(lines[n]);
												_state[line[1]] = line[2] || "";
										}
										return _state;
								})(get('state').text);

						// localStorage
								if (window.localStorage.getItem("compression_state") !== null)
								{
										var local_storage_state = JSON.parse(window.localStorage.getItem("compression_state")); 
										for (var name in local_storage_state) {
												if (local_storage_state.hasOwnProperty(name)) {
														state[name] = local_storage_state[name];
												}
										}
								}

						// stateDefaults 

								if (typeof state.page === 'number')
								{
										location.hash = "page/" + state.page;
								}
								state.initialized = "true";
								state.completed_form = false;
								state.sending = false;
								state.error = false;
						
						// domInit
								get('app').innerHTML = template(get('template').text);
				}
				else
				{
						get('app').scrollIntoView();
				}
				var url = window.location.href;
				var hash_index = url.indexOf('#');
				if (hash_index != -1)
				{
						var hash_value = url.substring(hash_index + 1, url.length);
						if (hash_value.length === 0)
						{
								state.page = 1;
						}
						else if (hash_value.indexOf('/') != -1)
						{
								var hash_split = hash_value.split('/');
								if (hash_split[0] == "page" && hash_split.length == 2)
								{
										state.page = parseInt(hash_split[1]);
								}
						}
				}
		}
		var state_changed = [];

		if (state.initialized == "true")
		{
				if ("user_phone"        == e.target.id ||
						"job_phone" == e.target.id ||
						"reference_1_phone" == e.target.id ||
						"reference_2_phone" == e.target.id ||
						"user_dob" == e.target.id ||
						"user_ssn" == e.target.id ||
						"dollar_amount" == e.target.id || 
						"job_income" == e.target.id)
				{
						state[e.target.id] = (""+e.target.value).replace(/\D/g, '');
						state_changed.push(e.target.id);
				}
				else if (e.type == 'click' && e.target.getAttribute('data-scroll-to'))
				{
						e.preventDefault();
						get(e.target.getAttribute('data-scroll-to')).scrollIntoView({behavior: "smooth"});
				}
				else if (e.target.id == "send_button" &&
								 e.type == 'click' && 
								 state.sending == false)
				{
						e.preventDefault();
						state.sending = true;
						state.error = false;
						var params = "";
						for (var name in state) {
								if (state.hasOwnProperty(name)) {
										var value = state[name];
										params += encodeURIComponent(name) + "=" + encodeURIComponent(value) + "&";
								}
						}
						params += encodeURIComponent("completed_form") + "=" + encodeURIComponent("1") + "&";
						http = new XMLHttpRequest();
						http.onreadystatechange = function() {
								if (http.readyState == 4) {
										state.sending = false;
										if (http.status == 200)
										{
												console.log("xhr.responseText", http.responseText);
												var ok_res = JSON.parse(http.responseText);
												if (ok_res.errors.length == 0)
												{
														state.completed_form = true;
														window.localStorage.removeItem('compression_state');
												}
												else
												{
														state.error = true;
												}
										}
										else
										{
												state.error = true;
												console.log("Error! Status: ", http.status, "Text:", http.responseText);
										} 
										domUpdate([]);
								}
						};
						http.open("POST", "/api/save");
						http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
						http.send(params);
				}
				else if (state[e.target.name] !== undefined)
				{
						state[e.target.name] = e.target.value;
				}

				var stored_state = JSON.parse(JSON.stringify(state));
				stored_state.user_ssn = "";
				stored_state.completed_form = "";
				stored_state.sending = "";
				stored_state.error = "";
				window.localStorage.setItem('compression_state', JSON.stringify(stored_state));

				var state_keys = Object.keys(state);

				for (var so_i = 0; so_i < state_keys.length; ++so_i)
				{
						if (state[state_keys[so_i]] != state_old[state_keys[so_i]])
						{
								state_changed.push(state_keys[so_i]);
						}
				}

				domUpdate(state_changed);
		}
}



function domUpdate(state_changed)
{
		var required_fields = [];
		var optional_fields = [];
		for(var sc_i = 0; sc_i < state_changed.length; ++sc_i)
		{
				var state_changed_name = state_changed[sc_i];
				
				if ("user_phone" == state_changed_name  ||
				"job_phone" == state_changed_name ||
				"relative_phone" == state_changed_name ||
				"reference_1_phone" == state_changed_name ||
						"reference_2_phone" == state_changed_name )
				{
						get(state_changed_name).value = scope(function(){
								var s = state[state_changed_name];
								var value;
								var m = /^(\d{3})(\d{3})(\d+)$/.exec(s);
								if (m)
								{
										value = "(" + m[1] + ") " + m[2] + "-" + m[3];
								}
								else
								{
										m = /^(\d{3})(\d{1,3})$/.exec(s);
										if (m)
										{
												value = "(" + m[1] + ") " + m[2];
										}
										else
										{
												value = s;
										}
								}
								return value;
						});
				}
				else if ("dollar_amount" == state_changed_name ||
								 "job_income" == state_changed_name)
				{
						console.log(state_changed_name);
						get(state_changed_name).value = scope(function() {
								var c = state[state_changed_name];
								var value = "";
								if (c.length > 0)
								{
										value = "$"+c.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
								}
								else
								{
										value = "";
								}
								return value;
						});
				}
				else if ("user_dob" == state_changed_name)
				{
						get(state_changed_name).value = scope(function() {
								var s = state[state_changed_name];
								var value;
								var m = /^(\d{2})(\d{2})(\d+)$/.exec(s);
								if (m)
								{
										value = m[1] + "/" + m[2] + "/" + m[3];
								}
								else
								{
										m = /^(\d{2})(\d+)$/.exec(s);
										if (m)
										{
												value = m[1] + "/" + m[2];
										}
										else
										{
												value = s;
										}
								}
								return value;
						});
				}
				else if ('user_ssn' == state_changed_name)
				{
						get(state_changed_name).value = scope(function() {
								var value;
								var s = state[state_changed_name];
								var m = /^(\d{3})(\d{2})(\d+)$/.exec(s);
								if (m)
								{
										value = m[1] + " " + m[2] + " " + m[3];
								}
								else
								{
										m = /^(\d{3})(\d+)$/.exec(s);
										if (m)
										{
												value = m[1] + " " + m[2];
										}
										else
										{
												value = s;
										}
								}
								return value;
						});
				}
				else
				{
						if (get(state_changed_name))
						{
								get(state_changed_name).value = state[state_changed_name];
						}
						else
						{
						}
				}
				// htmlupdate
				if ("user_name_first" == state_changed_name)
				{
						var first_name_array = document.getElementsByClassName('user_name_first_span');
						for (var i = 0; i < first_name_array.length; ++i)
						{
								first_name_array[i].innerText = state.user_name_first;
						}
						
				}
		}




		/********** progress bar *******/
		if (state.page > 1)
		{
				var _progress_bar_width = state.page / prop.page_max * 100 + "%";
				get('progress_bar').style.width = _progress_bar_width; 
				get('page').innerHTML = state.page;
				get('page_max').innerHTML = prop.page_max;
				get('progress_bar_div').style.display = "block";
		}
		else
		{
				get('progress_bar_div').style.display = "none";
		}	

		/********** page 1 **********/
		if (state.page == 1)
		{
				get('page_1').style.display = 'block';
				get('intro').style.display = 'block';

			  
				if (state.user_name_first && state.user_name_last)
				{
						get('user_name_first').style.boxShadow = "none";
						get('page_1_next_div').style.maxHeight = "200px";
						get('page_1_error_div').style.maxHeight = "0px";
				}
				else if (state.user_name_last)
				{
						get('user_name_first').style.boxShadow = "0 0 10px #ff8888";
						get('page_1_error_div').style.maxHeight = "200px";
						get('page_1_error').innerHTML = 'First Name is Required';
						get('page_1_next_div').style.maxHeight = "0px";
				}
				else
				{
						get('user_name_first').style.boxShadow = "none";
						get('page_1_next_div').style.maxHeight = "0px";
						get('page_1_error_div').style.maxHeight = "0px";
				}
		}
		else
		{
				get('page_1').style.display = 'none';
				get('intro').style.display = 'none';
		}
		/********** page 2 **********/
		if (state.page == 2)
		{
				get('page_2').style.display = 'block';

				if (state.user_member_current == "Yes")
				{
						get('user_member_id_div').style.display = "block";
				}
				else
				{
						get('user_member_id_div').style.display = "none";
				}

				if (state.user_member_current == "No")
				{
						get('user_wayne_div').style.display = "block";
				}
				else
				{
						get('user_wayne_div').style.display = "none";
				}

				if (state.user_member_current == "No" &&
						state.user_wayne == "No")
				{
						get('user_comarts_div').style.maxHeight = "200px";
				}
				else
				{
						get('user_comarts_div').style.maxHeight = "0px";
				}

				if (state.user_member_current == "No" &&
						(state.user_wayne == "Yes" ||
						 state.user_comarts == "Yes"))
				{
						get('can_be_member_div').style.maxHeight = "200px";
				}
				else
				{
						get('can_be_member_div').style.maxHeight = "0px";
				}
				if (state.user_member_current == "No" &&
						(state.user_wayne == "No" && 
						 state.user_comarts == "No"))
				{
						get('can_not_be_member_div').style.maxHeight = "200px";
				}
				else
				{
						get('can_not_be_member_div').style.maxHeight = "0px";
				}
				if (state.user_member_current == "Yes" ||
						state.user_wayne == "Yes" ||
						state.user_comarts == "Yes")
				{
						get('page_2_next_div').style.maxHeight = "200px";
				}
				else
				{
						get('page_2_next_div').style.maxHeight = "0px";
				}
		}
		else
		{
				get('page_2').style.display = 'none';
		}
		/********** page 3 **********/
		if (state.page == 3)
		{
				get('page_3').style.display = 'block';
				if (state.dollar_amount &&
						state.dollar_plan &&
						state.dollar_amount > 3000)
				{
						get('dollar_amount_too_big_div').style.maxHeight = "200px";
				}
				else
				{
						get('dollar_amount_too_big_div').style.maxHeight = "0px";
				}
				if (state.dollar_amount &&
						state.dollar_plan &&
						state.dollar_amount < 500)
				{
						get('dollar_amount_too_small_div').style.maxHeight = "200px";
				}
				else
				{
						get('dollar_amount_too_small_div').style.maxHeight = "0px";
				}

				if (state.dollar_amount)
				{
						get('dollar_plan_div').style.maxHeight = "200px";
				}
				else
				{
						get('dollar_plan_div').style.maxHeight = "0px";
				}	

				if (state.dollar_amount >= 500 &&
						state.dollar_amount <= 3000 &&
					 state.dollar_plan)
				{
						get('page_3_next_div').style.maxHeight = "200px";
				}
				else
				{
						get('page_3_next_div').style.maxHeight = "0px";
				}	
		}
		else
		{
				get('page_3').style.display = 'none';
		}
		/********** page 4 **********/
		if (state.page == 4)
		{
				get('page_4').style.display = 'block';
				if ("<2" == state.home_years)
				{
						get('home_previous_div').style.maxHeight = "800px";
				}
				else
				{
						get('home_previous_div').style.maxHeight = "0px";
				}

				// required_fields
				required_fields = [{id: 'user_contact_method', text: 'Preferred Contact Method'},
														 {id: 'user_dob', text: 'Date of Birth'},
														 {id: 'user_ssn', text: 'Social Security Number'},
														 {id: 'home_address', text: 'Address'},
														 {id: 'home_city', text: 'City'},
														 {id: 'home_state', text: 'State'},
														 {id: 'home_years', text: 'Number of years at residence'},
														 {id: 'home_zipcode', text: 'Zipcode'}];
				// conditional required_fields 
						if (state.home_years == "<2")
						{
								required_fields = required_fields.concat([{id: 'home_previous_address', text: 'Previous Address'},
																		{id: 'home_previous_city', text: 'Previous City'},
																		{id: 'home_previous_state', text: 'Previous State'},
																		{id: 'home_previous_zipcode', text:'Previous Zipcode'}]);
						}

						optional_fields = [{id:'user_phone', text:'Phone'},{id:'user_email', text:'Email'}];
						if (state.user_contact_method == "phone")
						{
								required_fields.push({id:'user_phone', text:'Phone'});
						}
						else if (state.user_contact_method == "email")
						{
								required_fields.push({id:'user_email', text:'Email'});
						}
				var required_fields_missing = [];
				for (i = 0; i < required_fields.length; ++i)
				{
						if (state[required_fields[i].id].length == 0)
						{
								required_fields_missing.push(required_fields[i]);
						}
				}

				// Page 4 Error Div
						if (required_fields_missing.length == 0)
						{
								get('page_4_error_div').style.maxHeight = "0px";
						}
						else
						{
								var page_4_error_title_html = "Required Field";
								if (required_fields_missing.length > 1)
								{
										page_4_error_title_html += "s";
								}

								var page_4_error_html = "";
								for (i = 0; i < required_fields_missing.length; ++i)
								{
										page_4_error_html += '<p><a href="javascript:void(0);" data-scroll-to="'+required_fields_missing[i].id+'">' + required_fields_missing[i].text + '</a></p>';
								}
								get('page_4_error_title').innerHTML = page_4_error_title_html;
								get('page_4_error').innerHTML = page_4_error_html;
								get('page_4_error_div').style.maxHeight = "400px";
						}

				if (state.home_years == ">2" || 
						(state.home_years == "<2" && state.home_previous_zipcode ))
				{
						if (required_fields_missing.length == 0)
						{
								get('page_4_next_div').style.maxHeight = "200px";
								fieldsGlowOff(required_fields);
								fieldsGlowOff(optional_fields);
						}
						else
						{
								get('page_4_next_div').style.maxHeight = "0px";
								fieldsGlowOff(required_fields);
								fieldsGlowOff(optional_fields);
								fieldsGlowOn(required_fields_missing);
						}
				}
				else
				{
						get('page_4_next_div').style.maxHeight = "0px";
						fieldsGlowOff(required_fields);
						fieldsGlowOff(optional_fields);
				}
		}
		else
		{
				get('page_4').style.display = 'none';
		}
		/********** page 5 **********/
		if (state.page == 5)
		{
				get('page_5').style.display = 'block';
				if ("<2" == state.job_years)
				{
						get('job_previous_div').style.maxHeight = "800px";
				}
				else
				{
						get('job_previous_div').style.maxHeight = "0px";
				}

				// required_fields
				required_fields = [{id: 'job_employer', text: 'Employer'},
													 {id: 'job_phone', text:'Employer\'s Phone Number'},
													 {id: 'job_title', text:'Job Title'},
													 {id: 'job_income', text:'Income'},
													 {id: 'job_income_rate', text:'When you get paid'},
													 {id: 'job_years', text:'How long you have worked with at your current job'},
													 {id: 'reference_1_name', text:'Reference 1 Name'},
													 {id: 'reference_1_phone', text:'Reference 1 Phone'},
													 {id: 'reference_1_address', text:'Reference 1 Address'},
													 {id: 'reference_1_city', text:'Reference 1 City'},
													 {id: 'reference_1_state', text:'Reference 1 State'},
													 {id: 'reference_1_zipcode', text:'Reference 1 Zipcode'},
													 {id: 'reference_1_relationship', text:'Reference 1 Relationship'},
													 {id: 'reference_2_name', text:'Reference 2 Name'},
													 {id: 'reference_2_phone', text:'Reference 2 Phone'},
													 {id: 'reference_2_address', text:'Reference 2 Address'},
													 {id: 'reference_2_state', text:'Reference 2 State'},
													 {id: 'reference_2_city', text:'Reference 2 City'},
													 {id: 'reference_2_zipcode', text:'Reference 2 Zipcode'},
													 {id: 'reference_2_relationship', text:'Reference 2 Relationship'}
				];
				// conditional required_fields 
						if (state.job_years == "<2")
						{
								required_fields.push({id:'job_previous_employer', text:'Previous Employer'});
						}

				required_fields_missing = [];
				for (i = 0; i < required_fields.length; ++i)
				{
						if (state[required_fields[i].id].length == 0)
						{
								required_fields_missing.push(required_fields[i]);
						}
				}

				// Page 5 Error Div
						if (required_fields_missing.length == 0)
						{
								get('page_5_required_div').style.maxHeight = "0px";
						}
						else
						{
								var page_5_required_title_html = "Required Field";
								if (required_fields_missing.length > 1)
								{
										page_5_required_title_html += "s";
								}

								var page_5_required_html = "";
								for (i = 0; i < required_fields_missing.length; ++i)
								{
										page_5_required_html += '<p><a href="javascript:void(0);" data-scroll-to="'+required_fields_missing[i].id+'">' + required_fields_missing[i].text + '</a></p>';
								}
								get('page_5_required_title').innerHTML = page_5_required_title_html;
								get('page_5_required').innerHTML = page_5_required_html;
								get('page_5_required_div').style.maxHeight = "1000px";
						}

				// glow required fields if at end
				if (required_fields_missing.length > 0 &&
						state.reference_2_zipcode)
				{
						fieldsGlowOff(required_fields);
						fieldsGlowOn(required_fields_missing);
				}
				else
				{
						fieldsGlowOff(required_fields);
				}


				if (required_fields_missing.length == 0 &&
						!state.completed_form &&
						!state.sending)
				{
						get('send_button_div').style.maxHeight = "200px";
				}
				else
				{
						get('send_button_div').style.maxHeight = "0px";
				}

				if (state.sending)
				{
						get('sending_div').style.maxHeight = "200px";
				}
				else
				{
						get('sending_div').style.maxHeight = "0px";
				}

				if (state.error)
				{
						get('error_div').style.maxHeight = "200px";
				}
				else
				{
						get('error_div').style.maxHeight = "0px";
				}

				if (state.completed_form == true)
				{
						get('end_success_div').style.maxHeight = "200px";
				}
				else
				{
						get('end_success_div').style.maxHeight = "0px";
				}
		}
		else
		{
				get('page_5').style.display = 'none';
		}
}

function template(_input) {
		var lines = _input.match(/\s*(\S+\s+.+)/g);
		var _html = "";
		for (var n = 0; n < lines.length; ++n)
		{
				var line = /[ \t]*(\S*)[ \t]+(.*)/.exec(lines[n]);
				var command =  line[1];
				var line_args = line[2];
				var args = [];
				var value;
				var id;
				if ("[text]" == command)
				{
						args = /(\S*) (\S*) ~([^~]+)~ (\S*)/.exec(line_args);
console.log(args);
						id = args[1];
						var icon = args[2];
						var placeholder = args[3];
						var max_length = args[4];
						value = "";
						var style = "padding-bottom:15px;";
						if (args[5] !== undefined)
						{
								style = args[5];
						}

						_html += '\
								<div style="' + style + '">\
								<div>\n\
								<label class="icon" for="' + id + '"><i class="fa ' + icon + '"></i></label><input \
										type="text" name="' + id + '" id="' + id + '" placeholder="' + placeholder + '" \
										value="' + value + '" maxlength="' + max_length + '">\n\
								</div>\
								</div>\n';
				}
				else if ("[checkbox]" == command)
				{
						args = /([^ ]*)/.exec(line_args);
						id = args[1];

						value = "";
						if (state[id] !== undefined)
						{
								value = state[id];
						}
						else
						{
						}
						var yes_checked = "";
						var no_checked = "";
						if (value == "Yes")
						{
								yes_checked = ' checked=true ';
						}
						if (value == "No")
						{
								no_checked = ' checked=true ';
						}
						_html += '<div style="width:140px;margin:0 auto;">'+
								'<input type="radio" value="Yes" name="' + id + '"' + yes_checked + ' id="' + id + '_yes">'+
								'<label class="radio" type="radio" for="' + id + '_yes">Yes</label>'+
								'<input type="radio" value="No" name="' + id + '"' + no_checked + 'id="' + id + '_no">'+
								'<label class="radio" type="radio" for="' + id + '_no">No</label></div>';
				}
				else if ("[radio]" == command)
				{
						args = /([^ ]*) \[([^\]]*)\]/.exec(line_args);
						id = args[1];
						var options = args[2].match(/([^,]+)/gm);
						_html += '<div>';
						for (var a = 0; a < options.length; ++a)
						{
								var checked = "";
								var option = /([^:]*):(.*)/.exec(options[a]);
								if (state[id] == option[2])
								{
										checked = ' checked=true ';
								}
								var label = option[1];
								value = option[2];
								_html += '<input type="radio" value="' + value + '" name="' + id + '" ' + checked + ' id="' + id + '_' + value + '">'+
										'<label class="radio" type="radio" for="' + id + '_' + value + '">' + label + '</label>';
						}
						_html += '</div>';

				}
				else if ("[dropdown]" == command)
				{
						args = /(\S*) \[([^\]]*)\]/.exec(line_args);
						id = args[1];
						var options = args[2].match(/([^,]+)/gm);
						_html += '<div style="padding-bottom:15px;"><select name="' + id + '" id="' + id + '">';
						for (var a = 0; a < options.length; ++a)
						{
								var selected = "";
								var option = /([^:]*):(.*)/.exec(options[a]);
								if (state[id] == option[2])
								{
										selected = 'selected="selected"';
								}
								_html += '<option value="' + option[2] + '"' + selected + '>' + option[1] + '</option>';
						}
						_html += '</select></div>';
				}
				else if ("_" == command)
				{
						args = /(.*)/.exec(line_args);
						_html += args[1];
				}
				else if ("(" == command)
				{
						args = /(\S*)/.exec(line_args);
						_html += '\<div id="' + args[1] + '" style="display:none;">\n';
				}
				else if (")" == command)
				{
						args = /(\S*)/.exec(line_args);
						_html += '\</div><!--' + args[1] + '-->\n';
				}
				else if ("[" == command)
				{
						args = /(\S*)/.exec(line_args);
						_html += '\<div id="' + args[1] + '" style="max-height:0px; overflow:hidden; transition: max-height 0.2s ease;">\n';
				}
				else if ("]" == command)
				{
						args = /(\S*)/.exec(line_args);
						_html += '\</div><!--' + args[1] + '-->\n';
				}
				else if (">next" == command)
				{
						args = /(\S*)/.exec(line_args);
						_html += '\<div><a href="#page/' + args[1] + '" class="button">Next</a></div>\n';
				}
				else if ("<back" == command)
				{
						args = /(\S*)/.exec(line_args);
						_html += '<a href="#page/' + args[1] + '" style="text-decoration:underline;font-size:13px;display:block;padding-bottom:15px;">< Back</a>\n';
				}
				else if ("#" == command)
				{
						args = /(.*)/.exec(line_args);
						_html += '<p style="padding-bottom:5px;">' + args[1] + '</p>';
				}
				else if (">" == command)
				{
						args = /(.*)/.exec(line_args);
						_html += '<p style="font-style:italic;padding-left:0px;text-align:right;color:#969ac1;">' + args[1] + '</p>';
				}
				else if ("!" == command)
				{
						args = /~([^~]*)~ ~([^~]*)~/.exec(line_args);
						var head = args[1];
						var body = args[2];
						_html += '<div class="message-box" style="\
								border: 1px solid rgb(79, 79, 10);\
								border-radius:5px;\
								padding:10px 15px 5px;\
								margin-bottom:15px;\
						">\n\
								<h1 style="padding-bottom:10px;">' + head + '</h1>' + body + '</div>';
				}
		}
		return _html;
}


/* Dom Utility Functions */

		/* required_fields = [{id:'',text:''}, {id:'', text:''}] */
		function fieldsGlowOn(required_fields)
		{
				for (var i = 0; i < required_fields.length; ++i)
				{
						get(required_fields[i].id).style.boxShadow = "0 0 10px red";
				}
		}
		function fieldsGlowOff(required_fields)
		{
				for (var i = 0; i < required_fields.length; ++i)
				{
						get(required_fields[i].id).style.boxShadow = "none";
				}
		}


