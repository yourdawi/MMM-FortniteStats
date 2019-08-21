Module.register("MMM-FortniteStats",{
  //Defaults
  defaults: {
    Authtoken: "APIKEY", // Your API Key here @fortniteapi.com
    Nickname: "NICKNAME", // Your Nickname / EPIC USERNAME
    Platform: "PLATFORM", // Your Platform (ps4,pc,xbox)
    // CHANGE ABOVE //
    ClientID: "TEST", // No change
    Stats: "total", // no change
    StatsResult: "EMPTY", // no change
    StatsText: "Loading", // no change
    // CHANGE IF YOU WANT TO // 
    UpdateInterval: 30 // In seconds / Switch between Solo, Duo, Squad, Total
  },
  // define scripts
  getScripts: function() {
	return [
		'https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js',  // this file will be loaded from the jquery servers.
	]
  },
  // LOADING API
  start: function(){
    var request = new XMLHttpRequest()
    request.open("GET", "https://fortnite-api.theapinetwork.com/users/id?username=" + this.config.Nickname, true)
    request.setRequestHeader("Authorization", this.config.Authtoken)
    var self = this
    request.onload = function () {
    var data = JSON.parse(this.response)
    self.config.ClientID = data["data"]["uid"]
    self.getStats()
    }
    request.send()
    this.startUpdateLoop()
  },
  // Load Styles
  getStyles: function(){
    return [
		'style.css',
	]
  },

  // receiving stats from api

  getStats: function(){
      var request = new XMLHttpRequest()
      request.open("GET", "https://fortnite-api.theapinetwork.com/prod09/users/public/br_stats?user_id=" + this.config.ClientID + "&platform=" + this.config.Platform, true)
      request.setRequestHeader("Authorization", this.config.Authtoken)
      var self = this
      request.onload = function () {
      var data = JSON.parse(this.response)
      self.config.StatsResult = data
      self.generateStatsText()
      }
      request.send()
  },

  // The displayed text

  generateStatsText: function() {
    if(this.config.StatsResult != "EMPTY"){


    if(this.config.Stats == "total"){
      var total = this.config.StatsResult.totals
      this.config.StatsText = "Kills: " + total.kills + " Wins: " + total.wins + " Matches played: " + total.matchesplayed + " Score: " + total.score + " Winrate: " + total.winrate + " KD: " + total.winrate
      this.updateDom()
    }
    if(this.config.Stats == "solo"){
      var solo = this.config.StatsResult.stats
      this.config.StatsText = "Wins: " + solo.placetop1_solo + " Top 10: " + solo.placetop10_solo + " Top 25: " + solo.placetop25_solo + " Matches played: " + solo.matchesplayed_solo + " Kills: " + solo.kills_solo + " KD: " + solo.kd_solo + " Winrate: " + solo.winrate_solo + " Score: " + solo.score_solo
      this.updateDom()
    }
    if(this.config.Stats == "duo"){
      var duo = this.config.StatsResult.stats
      this.config.StatsText = "Wins: " + duo.placetop1_duo + " Top 5: " + duo.placetop5_duo + " Top 12: " + duo.placetop12_duo + " Matches played: " + duo.matchesplayed_duo + " Kills: " + duo.kills_duo + " KD: " + duo.kd_duo + " Winrate: " + duo.winrate_duo + " Score: " + duo.score_duo
      this.updateDom()
    }
    if(this.config.Stats == "squad"){
      var squad = this.config.StatsResult.stats
      this.config.StatsText = "Wins: " + squad.placetop1_squad + " Top 3: " + squad.placetop3_squad + " Top 6: " + squad.placetop6_squad + " Matches played: " + squad.matchesplayed_squad + " Kills: " + squad.kills_squad + " KD: " + squad.kd_squad + " Winrate: " + squad.winrate_squad + " Score: " + squad.score_squad
      this.updateDom()
    }
  }
    console.log(this.config.StatsResult)
  },

  // Change Stats

  updateStats: function(){
    if (this.config.Stats == "solo"){
      this.config.Stats = "duo"
      this.getStats()
    }
    else if (this.config.Stats == "duo"){
      this.config.Stats = "squad"
      this.getStats()
    }
    else if (this.config.Stats == "squad"){
      this.config.Stats = "total"
      this.getStats()
    }
    else if (this.config.Stats == "total"){
      this.config.Stats = "solo"
      this.getStats()
    }
  },

  // loop the update to change Solo, Duo, Suqad or total
  startUpdateLoop: function(){
    setInterval(() => {
      this.updateStats()
    }, this.config.UpdateInterval * 1000);
  },

  // Override dom generator
  getDom: function(){
    var wrapper = document.createElement("stats");
    var title = document.createElement("header");
    title.innerHTML = "Fortnite Stats - " + this.config.Nickname + " - " + this.config.Stats
    var body = document.createElement("body");
    var div = document.createElement("div");
    var stats = document.createElement("P");
    wrapper.appendChild(body)
    body.appendChild(div)
    div.appendChild(stats)
    wrapper.appendChild(title);

    stats.innerHTML = this.config.StatsText

    return wrapper;
  }

});
