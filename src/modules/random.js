'use strict'

exports.hungry = (message) => message.channel.send(`FO MI`, {
    files: ['https://i.imgur.com/V3KqI5U.jpg'],
});

exports.legtable = (message) => message.channel.send(`Nishida ta puto galera corre, ELE PEGOU O PÉ DE MESA`, {
    files: ['https://i.imgur.com/a5YVvbL.jpg'],
});

exports.stealphora = (message) => message.channel.send(`Enquanto você digitava isso a Leuphora vendeu o item de alguém de novo`, {
    files: ['https://www.worldanvil.com/uploads/images/df46109fdb584b00c7fb849ebbf6ab90.jpg'],
});

exports.mushroomtea = (message) => message.channel.send(`Tyborn passa-te a bufa, aceitas?`, {
    files: ['https://i.imgur.com/My5aoK9.jpg']
});

exports.evelon = (message) => {
    // Definindo as frases da Evelon
    const quotes = [
        'Você é burro ou assim ou foi parido por uma mula?',
        'Pelo amor de deus, você chama isso de vestido? Eu chamo isso de saco de batatas',
        'Legal, que pena sua existência não faz sentido :)',
    ];
    // Pegando uma frase aleatória do array
    const currentQuote = quotes[Math.floor(Math.random() * quotes.length)];

    return message.channel.send(`**Evelon** - ${currentQuote}`);
}