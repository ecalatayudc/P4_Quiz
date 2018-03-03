const {log, biglog, errorlog, colorize} = require("./out");
const model = require("./model");

exports.helpCmd = rl =>{
     log("Comandos:");
     log("  h|help - Muestra esta ayuda.");
     log("  list - Listar los quizzes existentes.");
     log("  show <id> - Muestra la pregunta y la respuesta del quiz indicado.");
     log("  add - Añadir un nuevo quiz interactivamente.");
     log("  delete <id> - Borrar el quiz indicado.");
     log("  edit <id> - Editar el quiz indicado.");
     log("  test <id> - Probar el quiz indicado.");
     log("  p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
     log("  credits - Créditos.");
     log("  q|quit Salir del programa.");
     rl.prompt();
};
exports.listCmd = rl =>{
	model.getAll().forEach((quiz, id) => {
		log(`[${colorize(id, 'magenta')}]: ${quiz.question}`);
	});
	rl.prompt();
};
exports.showCmd = (rl,id) =>{
	if(typeof id === "undefined"){
		errorlog(`Falta el parámetro id.`)
	}else{
		try{
			const quiz = model.getByIndex(id);
			log(`[${colorize(id, 'magenta')}]: ${quiz.question} ${colorize('=>','magenta')} ${quiz.answer}`);
		}catch(error){
			errorlog(error.message)
		}
	}
	rl.prompt();
};
exports.addCmd = rl =>{
	rl.question(colorize('Introduzca una pregunta: ', 'red'), question =>{
		rl.question(colorize( ' Introduzca la respuesta ', 'red'), answer =>{
			model.add(question, answer);
			log(` ${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=>','magenta')} ${answer}`);
			rl.prompt();
		});

	});
};
exports.deleteCmd = (rl,id) =>{
      if(typeof id === "undefined"){
		errorlog(`Falta el parámetro id.`)
	}else{
		try{
			model.deleteByIndex(id);
		}catch(error){
			errorlog(error.message)
		}
	}
      rl.prompt();
};
exports.editCmd = (rl, id) =>{
	if(typeof id === "undefined"){
		errorlog(`Falta el parámetro id.`)
		rl.prompt();
	}else{
		try{
			const quiz = model.getByIndex(id);

			process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);
			
			rl.question(colorize('Introduzca una pregunta: ', 'red'), question =>{
				
				process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);

				rl.question(colorize( ' Introduzca la respuesta: ', 'red'), answer =>{
					model.update(id,question, answer);
					log(` Se ha campbiado el quiz ${colorize(id, 'magenta')} por: ${question} ${colorize('=>','magenta')} ${answer}`);
					rl.prompt();
				});
			});
		}catch(error){
			errorlog(error.message);
			rl.prompt();
		}
	}
};
exports.testCmd = (rl,id) =>{
	if(typeof id === "undefined"){
		errorlog(`Falta el parámetro id.`)
		rl.prompt();
	}else{
		try{
			const quiz = model.getByIndex(id);

			

				rl.question(colorize( quiz.question + '? ', 'red'), answer =>{
					if(getCleanedString( answer.toLowerCase().trim()) === getCleanedString(quiz.answer.toLowerCase().trim())){
						log('Su respuesta es: correcta');
						//biglog('Correcta', 'green');
					}else{
						log('Su respuesta es: incorrecta');
						//biglog('Incorrecta', 'red');
					}
					
					rl.prompt();
				});
			
		}catch(error){
			errorlog(error.message);
			rl.prompt();
		}
	}

};
exports.playCmd = rl =>{
	let score = 0;
	let toBeResolved = [];
    let ql = model.count();
	for (var i = 0; i < ql; i++) {
		toBeResolved[i]= i;
	}

	const playone= () =>{
		if(toBeResolved.length === 0){
			log(` ¡QUIZ COMPLETADO!`);
			log(` Tu número de aciertos ha sido:`);
			biglog(score, 'blue');
			rl.prompt();
		}else{
			let nTBR=Math.floor(Math.random()*(toBeResolved.length));
			let id= toBeResolved[nTBR];
			let quiz = model.getByIndex(id);
			toBeResolved.splice(nTBR,1);
			rl.question(colorize( quiz.question + '? ', 'red'), answer =>{
				if(getCleanedString( answer.toLowerCase().trim()) === getCleanedString(quiz.answer.toLowerCase().trim())){
					score++;
					log(`Respuesta correcta - llevas ${score}  aciertos`);
					playone();
				}else{
					log('Respuesta incorrecta, fin del quiz');
					log('número total de aciertos:');
					biglog(score, 'blue');
					//biglog(toBeResolved.length,'green');
					rl.prompt();
				}
						
						
			});
		}
    }
    playone();
};

exports.creditsCmd = rl =>{
	 log('Autores de la práctica:');
     log('Enrique Calatayud Candelas','green');
     rl.prompt();
};

exports.quitCmd = rl =>{
	 rl.close(); 
};
getCleanedString = (cadena)=>{
   // Definimos los caracteres que queremos eliminar
   var specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.";

   // Los eliminamos todos
   for (var i = 0; i < specialChars.length; i++) {
       cadena= cadena.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
   }   

   // Quitamos acentos y "ñ". Fijate en que va sin comillas el primer parametro
   cadena = cadena.replace(/á/gi,"a");
   cadena = cadena.replace(/é/gi,"e");
   cadena = cadena.replace(/í/gi,"i");
   cadena = cadena.replace(/ó/gi,"o");
   cadena = cadena.replace(/ú/gi,"u");
   cadena = cadena.replace(/ñ/gi,"n");
   return cadena;
}