$(function () {
	function csvToArray(values) {
		var split_values = values.split(',');
		for (var i = 0; i < split_values.length; i++) {
			split_values[i] = split_values[i].replace(/^\s*/, "").replace(/\s*$/, "");
		}
		return split_values;
	}

	var app = chrome.extension.getBackgroundPage().application;
	var options = app.getOptions();

	$('#email_username_constants').val(options.email.username_constants.join(', '));
	$('#email_hostname_constants').val(options.email.hostname_constants.join(', '));
	$('#password_constant').val(options.password.constant);

	if (options.field_detect_using_class) {
		$('#field_detect_using_class').attr('checked', 'checked');
	}

	$('#field_type_firstname').val(options.field_types.firstname.join(', '));
	$('#field_type_lastname').val(options.field_types.lastname.join(', '));
	$('#field_type_fullname').val(options.field_types.fullname.join(', '));
	$('#field_type_confirm').val(options.field_types.confirm.join(', '));
	$('#field_type_username').val(options.field_types.username.join(', '));
	$('#field_type_organization').val(options.field_types.organization.join(', '));
	$('#field_type_email').val(options.field_types.email.join(', '));
	$('#field_type_number').val(options.field_types.number.join(', '));
	$('#field_type_telephone').val(options.field_types.telephone.join(', '));
	$('#field_type_website').val(options.field_types.website.join(', '));
	$('#field_type_date').val(options.field_types.date.join(', '));
	$('#field_type_day').val(options.field_types.day.join(', '));
	$('#field_type_month').val(options.field_types.month.join(', '));
	$('#field_type_year').val(options.field_types.year.join(', '));

	if (options.email.username_random)
		$('#email_username_random').attr('checked', 'checked');
	else
		$('#email_username_constant').attr('checked', 'checked');

	if (options.email.hostname_random)
		$('#email_hostname_random').attr('checked', 'checked');
	else
		$('#email_hostname_constant').attr('checked', 'checked');

	if (options.password.random)
		$('#password_use_random').attr('checked', 'checked');
	else
		$('#password_use_constant').attr('checked', 'checked');

	$('#link_general').on('click', function () {
		$('#opt-general').show();
		$('#opt-field-types').hide();
		$('#link_field_types').removeClass('active');
		$('#link_general').addClass('active');
	});

	$('#link_field_types').on('click', function () {
		$('#opt-general').hide();
		$('#opt-field-types').show();
		$('#link_general').removeClass('active');
		$('#link_field_types').addClass('active');
	});

	$('.save-settings').on('click', function () {
		options.email.username_random = $('#email_username_random').is(':checked');
		options.email.hostname_random = $('#email_hostname_random').is(':checked');
		options.password.random = $('#password_use_random').is(':checked');

		options.email.username_constants = csvToArray($('#email_username_constants').val());
		options.email.hostname_constants = csvToArray($('#email_hostname_constants').val());
		options.password.constant = $('#password_constant').val();

		options.field_detect_using_class = $('#field_detect_using_class').is(':checked');

		options.field_types.firstname = csvToArray($('#field_type_firstname').val());
		options.field_types.lastname = csvToArray($('#field_type_lastname').val());
		options.field_types.fullname = csvToArray($('#field_type_fullname').val());
		options.field_types.confirm = csvToArray($('#field_type_confirm').val());
		options.field_types.username = csvToArray($('#field_type_username').val());
		options.field_types.organization = csvToArray($('#field_type_organization').val());
		options.field_types.email = csvToArray($('#field_type_email').val());
		options.field_types.number = csvToArray($('#field_type_number').val());
		options.field_types.telephone = csvToArray($('#field_type_telephone').val());
		options.field_types.website = csvToArray($('#field_type_website').val());
		options.field_types.date = csvToArray($('#field_type_date').val());
		options.field_types.day = csvToArray($('#field_type_day').val());
		options.field_types.month = csvToArray($('#field_type_month').val());
		options.field_types.year = csvToArray($('#field_type_year').val());

		app.setOptions(options);
		$('.saved-msg').show();
	});
});