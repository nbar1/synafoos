<?php
$series_arr = array();
$i = 0;
if (isset($series_id))
{
	$query = "SELECT * FROM series WHERE series_id = $series_id LIMIT 1";
}
else
{
	$query = "SELECT series_id FROM series ORDER BY series_id DESC LIMIT 10";
}	
$result = mysql_query($query);
if ($result) {
	while($series_ids = mysql_fetch_array($result)) {
		$query = "SELECT * FROM series WHERE series_id = $series_ids[series_id]";
		$result2 = mysql_query($query);
		if ($result2) {
			$series = mysql_fetch_assoc($result2);
			// Doubles Match
			if ($series['players'] == 4)
			{		
				// Team 1
				$query = "SELECT * FROM teams WHERE team_id = $series[team_1]";
				$result2 = mysql_query($query);
				if ($result2) {
					$team1 = mysql_fetch_assoc($result2);
					$query = "SELECT * FROM players WHERE player_id = $team1[player_1]";
					$result2 = mysql_query($query);
					if ($result2) {
						$team1_player1 = mysql_fetch_assoc($result2);
					}
					$query = "SELECT * FROM players WHERE player_id = $team1[player_2]";
					$result2 = mysql_query($query);
					if ($result2) {
						$team1_player2 = mysql_fetch_assoc($result2);
					}
				}
				// Team 2
				$query = "SELECT * FROM teams WHERE team_id = $series[team_2]";
				$result2 = mysql_query($query);
				if ($result2) {
					$team2 = mysql_fetch_assoc($result2);
					$query = "SELECT * FROM players WHERE player_id = $team2[player_1]";
					$result2 = mysql_query($query);
					if ($result2) {
						$team2_player1 = mysql_fetch_assoc($result2);
					}
					$query = "SELECT * FROM players WHERE player_id = $team2[player_2]";
					$result2 = mysql_query($query);
					if ($result2) {
						$team2_player2 = mysql_fetch_assoc($result2);
					}
				}
			}
			// Singles Matches
			else
			{
				// Palyer 1
				$query = "SELECT * FROM players WHERE player_id = $series[team_1]";
				$result2 = mysql_query($query);
				if ($result2) {
					$team1 = mysql_fetch_assoc($result2);
				}
				// Palyer 2
				$query = "SELECT * FROM players WHERE player_id = $series[team_2]";
				$result2 = mysql_query($query);
				if ($result2) {
					$team2 = mysql_fetch_assoc($result2);
				}
			}
		}
		$series_arr[$i] = array(
			"series" => $series,
			"team1" => $team1,
			"team1_player1" => $team1_player1,
			"team1_player2" => $team1_player2,
			"team2" => $team2,
			"team2_player1" => $team2_player1,
			"team2_player2" => $team2_player2,
		);
		++$i;
	}
}
?>