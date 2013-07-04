var synafoos = synafoos || {};

synafoos.winner = {
	init: function() {
		var self = this;
		$('#modal-window').on('click','.team .wins b', function (e) {
			e.preventDefault();
			self.updateWins(this);
		});
	},
	updateWins: function(self) {
		var series_id = $(self).closest('section.series_details').attr('series_id');
		var winning_team = $(self).attr('team_num');
		var action = $(self).attr('class');
		var data_string = 'series_id='+series_id+'&winning_team='+winning_team+'&action='+action;
		var wins = $(self).parent().siblings('em').text();
		$(self).parent().siblings('em').html('<img src="img/loader.gif" alt="" />');
		// Update wins total for this team
		$.ajax({
			type: "GET",
			url: "lib/winner.php",
			data: data_string,
			success: function(data) {
				data = jQuery.parseJSON(data);
				// Update the number of wins in the modal
				$(self).parent().siblings('em').html(data.wins);
				// Update the number of wins in the main area
				$.ajax({
					type: "GET",
					url: "lib/series.php",
					success: function(data) {
						$('#series').html(data);
					}
				});
				// Update the recent results
				$.ajax({
					type: "GET",
					url: "lib/recent_results.php",
					success: function(data) {
						$('#recent_results').html(data);
					}
				});
				if (action == "plus") {
					synafoos.winner.logWin(data);
				}
				else {
					synafoos.winner.rescindWin(data);
				}
			}
		});
		return false;
	},
	logWin: function(data) {
		// Update Modal log
		$('.series_log_modal .series_log_data').prepend('<div class="series_log_match" log_id="'+data.log_id+'"><div class="winner">'+data.winner+'</div><div class="date">'+data.date+'</div></div>');
	},
	rescindWin: function(data) {
		$('.series_log_match[log_id='+data.log_id+']').addClass('rescinded');
	}
}

synafoos.winner.init();