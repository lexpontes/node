const readline = require('readline');

let character1, character2;

const characters = [
    {
        ID: 1,
        NAME: "Mario",
        VELOCITY: 4,
        MANEUVERABILITY: 3,
        POWER: 3,
        POINTS: 0
    },
    {
        ID: 2,
        NAME: "Peach",
        VELOCITY: 3,
        MANEUVERABILITY: 4,
        POWER: 2,
        POINTS: 0
    },
    {
        ID: 3,
        NAME: "Yoshi",
        VELOCITY: 2,
        MANEUVERABILITY: 4,
        POWER: 3,
        POINTS: 0
    },
    {
        ID: 4,
        NAME: "Bowser",
        VELOCITY: 5,
        MANEUVERABILITY: 2,
        POWER: 5,
        POINTS: 0
    },
    {
        ID: 5,
        NAME: "Luigi",
        VELOCITY: 3,
        MANEUVERABILITY: 4,
        POWER: 4,
        POINTS: 0
    },
    {
        ID: 6,
        NAME: "Donkey Kong",
        VELOCITY: 2,
        MANEUVERABILITY: 2,
        POWER: 5,
        POINTS: 0
    }
];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function selectCharacter(position) {
    return new Promise((resolve, reject) => {
        rl.question(`Digite o ID do personagem ${position}:`, (answer) => {
            const character = characters.find(char => char.ID === parseInt(answer));
            if (!character) {
                console.log("ID de personagem inválido. Por favor, tente novamente.");
                selectCharacter(position).then(resolve);
            } else {
                resolve(character);
            }
        });
    });
}

async function selectCharacters() {
    console.log("Escolha dois personagens:");

    character1 = await selectCharacter(1);
    character2 = await selectCharacter(2);

    console.log("Você selecionou os personagens:", character1.NAME, "e", character2.NAME);
    rl.close();
}

const blockTypes = ["STRAIGHTAWAY", "CURVE", "CONFRONTATION"];

// Creating the function for Rolling Dice
async function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

// Choosing a ramdon Block for the actual race
async function getRandomBlock() {
    let randomIndex = Math.floor(Math.random() * blockTypes.length);

    return blockTypes[randomIndex];
}

async function logRowResult(characterName, whatBlock, diceResult1, atributes) {
    console.log(`${characterName} 🎲 Rolou o dado em um bloco do tipo: ${whatBlock} e tirou ${diceResult1} + ${atributes} = ${diceResult1 + atributes}`)
}


// Creating the Play Engine for the Race
async function raceEngine(character1, character2) {
    for(let round = 1; round <= 5; round++) {
        console.log(`🏳️ Rodada ${round}`);

        let block = await getRandomBlock();
        console.log(`Bloco: ${block}`);

        //Rolling the dice
        let diceResult1 = await rollDice();
        let diceResult2 = await rollDice();

        //Testing skill
        let totalTestSkill1 = 0;
        let totalTestSkill2 = 0;

        if (block === blockTypes[0]) {
            totalTestSkill1 = diceResult1 + character1.VELOCITY;
            totalTestSkill2 = diceResult2 + character2.VELOCITY;

            await logRowResult(character1.NAME, "RETA", diceResult1, character1.VELOCITY);
            await logRowResult(character2.NAME, "RETA", diceResult2, character2.VELOCITY);
        }

        else if (block === blockTypes[1]) {
            totalTestSkill1 = diceResult1 + character1.MANEUVERABILITY;
            totalTestSkill2 = diceResult2 + character2.MANEUVERABILITY;

            await logRowResult(character1.NAME, "CURVA", diceResult1, character1.MANEUVERABILITY);
            await logRowResult(character2.NAME, "CURVA", diceResult2, character2.MANEUVERABILITY);
        } 

        else if (block === blockTypes[2]) {
            totalTestSkill1 = diceResult1 + character1.POWER;
            totalTestSkill2 = diceResult2 + character2.POWER;

            await logRowResult(character1.NAME, "CONFRONTO", diceResult1, character1.POWER);
            await logRowResult(character2.NAME, "CONFRONTO", diceResult2, character2.POWER);
        }

        if (totalTestSkill1 > totalTestSkill2) {
            character1.POINTS++;
            console.log(`${character1.NAME} marcou um ponto!`);

            if (block === blockTypes[2] && character2.POINTS > 0) {
               character2.POINTS--;
               console.log(`${character2.NAME} perdeu um ponto!`);
            }
        }    
           
        else if (totalTestSkill1 < totalTestSkill2) {
            character2.POINTS++;
            console.log(`${character2.NAME} marcou um ponto!`);

            if (block === blockTypes[2] && character1.POINTS > 0) {
               character1.POINTS--;
               console.log(`${character1.NAME} perdeu um ponto!`);
            }
        }    
        else {
            console.log(`${character1.NAME} e ${character2.NAME} empataram`);
        }

    }

    console.log(`${character1.NAME} fez um total de ${character1.POINTS} pontos`);
    console.log(`${character2.NAME} fez um total de ${character2.POINTS} pontos`);

    if (character1.POINTS > character2.POINTS) {
        console.log(`🏴 ${character1.NAME} venceu a corrida`);
    }
    else  if (character1.POINTS < character2.POINTS) {
          console.log(`🏴 ${character2.NAME} venceu a corrida`);
    }
    else    {
          console.log(`🏴 ${character1.NAME} e ${character2.NAME} empataram a corrida`);
    }    
}

// Defining the main function as AutoInvoke  
async function runRace() {
    console.log(`🏁🏳️ Corrida entre ${character1.NAME} e ${character2.NAME}\n`);

    await raceEngine(character1, character2);
}

async function main() {
    await selectCharacters(); // Espera pela seleção dos personagens
    await runRace(); // Depois que os personagens são selecionados, inicia a corrida
}

main().catch(err => {
    console.error("Ocorreu um erro:", err);
    rl.close();
});
