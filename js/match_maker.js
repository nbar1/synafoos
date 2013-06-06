var synafoos = synafoos || {};

synafoos.matchMaker = {
	init: function() {
		$('#modal_window').on('click','#set_match', function (e) {
			synafoos.matchMaker.setMatch();
		});
		$('.match_maker').click(function() {
			synafoos.matchMaker.getMatchMaker(this);
		});
	},
	dragPlayer: function(player, event) {
		event.dataTransfer.setData('Player', player.id);
	},
	dropInTeam: function(target, event) {
		event.preventDefault();
		var player = event.dataTransfer.getData('Player');
		// there are already 2 players on the team
		// move the first one added back to the pool
		if ($(target).children().size() > 1)
		{
			synafoos.matchMaker.pushInPool($(target).children('img:eq(0)'));
		}
		target.appendChild(document.getElementById(player));
		synafoos.matchMaker.updateTeamNames();
		return false;
	},
	pushInPool: function(player) {
		$('#mm_player_pool').append(player);
	},
	dropInPool: function(target, event) {
		event.preventDefault();
		var player = event.dataTransfer.getData('Player');
		target.appendChild(document.getElementById(player));
		synafoos.matchMaker.updateTeamNames();
	},
	updateTeamNames: function() {
		$('#mm_matchup .mm_team').each(function() {
			var target = this;
			if ($(this).children('.mm_team_players').children().size() === 0)
			{
				$(target).find('.mm_team_name > input').val('').attr('placeholder','Team Name');
			}
			else if ($(this).children('.mm_team_players').children().size() == 1)
			{
				var player_id = $(this).children('.mm_team_players').children('img').attr('player_id');
				dataString = 'player_id='+player_id;
				$.ajax({
					type: "POST",
					url: "lib/player.php",
					data: dataString,
					success: function(data) {
						data = $.parseJSON(data);
						$(target).find('.mm_team_name > input').val(data.nickname);
					}
				});
			}
			else
			{
				var player_1 = $(this).children('.mm_team_players').children('img:eq(0)').attr('player_id');
				var player_2 = $(this).children('.mm_team_players').children('img:eq(1)').attr('player_id');
				dataString = 'player_1='+player_1+'&player_2='+player_2;
				$.ajax({
					type: "POST",
					url: "lib/team.php",
					data: dataString,
					success: function(data) {
						data = $.parseJSON(data);
						if (data.nickname)
						{
							$(target).find('.mm_team_name > input').attr('disabled','disabled');
						}
						else
						{
							$(target).find('.mm_team_name > input').removeAttr('disabled');
						}
						$(target).find('.mm_team_name > input').val(data.nickname);							
					}
				});

			}
		});
	},
	setMatch: function() {
		var team_1_size = $('#mm_team_1 .mm_team_players').children().size();
		var team_2_size = $('#mm_team_2 .mm_team_players').children().size();
		$('.mm_team').removeClass('error').removeClass('error_1').removeClass('error_2').removeClass('error_name');
		if (team_1_size !== team_2_size || team_1_size === 0)
		{
			if (team_1_size == team_2_size)
			{
				$('.mm_team').addClass('error');
			}
			else if (team_1_size < team_2_size)
			{
				if (team_2_size == 1)
				{
					$('#mm_team_1').addClass('error_1');
				}
				else
				{
					$('#mm_team_1').addClass('error_2');	
				}
			}
			else
			{
				if (team_1_size == 1)
				{
					$('#mm_team_2').addClass('error_1');
				}
				else
				{
					$('#mm_team_2').addClass('error_2');	
				}
			}
		}
		else
		{
			var team_1_name = $('#mm_team_1 .mm_team_name input').val();
			var team_2_name = $('#mm_team_2 .mm_team_name input').val();
			var team_1_player_1 = $('#mm_team_1 .mm_team_players img:nth-child(1)').attr('player_id');
			var team_2_player_1 = $('#mm_team_2 .mm_team_players img:nth-child(1)').attr('player_id');
			var dataString = 't1name='+team_1_name+'&t2name='+team_2_name+'&t1p1='+team_1_player_1+'&t2p1='+team_2_player_1+'&num_players=2';
			if ($('#mm_team_1 .mm_team_players').children().size() > 1)
			{
				var team_1_player_2 = $('#mm_team_1 .mm_team_players img:nth-child(2)').attr('player_id');
				var team_2_player_2 = $('#mm_team_2 .mm_team_players img:nth-child(2)').attr('player_id');
				var dataString = 't1name='+team_1_name+'&t2name='+team_2_name+'&t1p1='+team_1_player_1+'&t1p2='+team_1_player_2+'&t2p1='+team_2_player_1+'&t2p2='+team_2_player_2+'&num_players=4';
			}
			if (team_1_name != "" && team_2_name != "")
			{ 
				$.ajax({
					type: "POST",
					url: "lib/match_maker.php",
					data: dataString,
					success: function(data){
						location.reload();
					}
				});
			}
			else
			{ 
				if (team_1_name == "")
				{
					$('#mm_team_1').addClass('error_name');
				}
				if (team_2_name == "")
				{
					$('#mm_team_2').addClass('error_name');
				}
			}
		}
		return false;
	},
	getMatchMaker: function(self) {
		$.ajax({
			type: "POST",
			url: "match_maker.php",
			success: function(data){
				synafoos.modal.showModal(self,data);
			}
		});
	}
};

synafoos.matchMaker.init();