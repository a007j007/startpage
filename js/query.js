
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js"></script>
<script>
	jQuery(document).ready(function($) {
		$.ajax({
			url : "http://api.wunderground.com/api/1f86e61db2cbb267/geolookup/conditions/q/IE/Galway.json",
			dataType : "jsonp",
			success : function(parsed_json) {

			var location = parsed_json['location']['city'];

			var temp_c = parsed_json['current_observation']['temp_c'];

			$('#weather').append('<div>"Current temperature in " + location + " is: " + temp_c"</div>');
			}
		});
	});
</script>
