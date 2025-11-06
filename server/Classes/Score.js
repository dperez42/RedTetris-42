const fs = require("fs");
const path = require("path");

class Score {
	constructor() { 
		console.log("init class Score")
		this.resultsFile = path.join(process.cwd(), "results.json");
		this.results = this.loadResult()
		this.ranking = []
		console.log(this.resultsFile)
		console.log(this.results)
		this.calcRanking()
	}
	
	// add result to a file "results.json"
	saveResult(game) {
		const result = {
		  game: game.name,
		  winner: game.winner,
		  date: new Date().toISOString(),
		  players: game.players.map(p => ({
			  name: p.name,
			  score: p.score
		  })),
		};
	
		try {
		  let results = [];
		  if (fs.existsSync(this.resultsFile)) {
			results = JSON.parse(fs.readFileSync(this.resultsFile, "utf-8"));
		  }
		  results.push(result);
		  fs.writeFileSync(this.resultsFile, JSON.stringify(results, null, 2));
		  console.log("✅ Game result saved:", result);
		  // redo ranking & send

		} catch (err) {
		  console.error("❌ Error saving result:", err);
		}
	}
	// load result from file "results.json"
	loadResult(){
		console.log("reading scores from.")
		try {
			if (fs.existsSync(this.resultsFile)) {
			  const data = fs.readFileSync(this.resultsFile, "utf-8");
			  const results = JSON.parse(data);
			  console.log(`📄 Loaded ${results.length} saved results`);
			  return results;
			} else {
			  console.log("ℹ️ No results file found, returning empty list");
			  return [];
			}
		  } catch (err) {
			console.error("❌ Error loading results:", err);
			return [];
		  }
	}
	calcRanking(){
		// Objeto acumulador de scores por jugador
		const scores = {};
		// Recorremos todas las partidas
		this.results.forEach(game => {
			game.players.forEach(player => {
			  if (!scores[player.name]) {
				scores[player.name] = 0;
			  }
			  scores[player.name] += player.score || 0;
			});
		});
		// Convertimos a array y ordenamos de mayor a menor
		const ranking = Object.entries(scores)
		.map(([name, Score]) => ({ name, Score }))
		.sort((a, b) => b.Score - a.Score);
  
	  	//console.log("🏆 Ranking calculado:", ranking);
	  	this.ranking = ranking
	}
	// get ranking
	getRanking(){
		return this.ranking
	}

}

module.exports = Score;