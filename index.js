const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require("./options");

const token = '5545917134:AAHB3JA3k2Hbsb0rZT2TC2FrPB2hJ-NOrgo'

const bot = new TelegramApi(token, {polling: true})

const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас Я загадаю цифру от 0 до 9, а ты должен ее угадать!`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}


bot.setMyCommands([
    {command: '/start', description: 'Начальное приветствие'},
    {command: '/info', description: 'Получить информацию о пользователе'},
    {command: '/game', description: 'Игра угадай число'}

])


const start = () => {
    bot.on('message', async (msg) => {
        const text = msg.text;
        const chatId = msg.chat.id;
        const firstName = msg.from.first_name;
        const lastName = msg.from.last_name;
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp')
            await bot.sendSticker(chatId,'https://tlgrm.ru/_/stickers/85b/9a3/85b9a330-80ac-4e5d-a7b7-d63f5fab2e6b/6.webp')
            return  bot.sendMessage(chatId, `Добро пожаловать в телеграм бот Ильи - автора канала web3 Solidity`)
        }
        if (text === '/info') {
            return  bot.sendMessage(chatId, `Тебя зовут ${firstName} ${lastName}`)
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!)')
    })

    bot.on('callback_query', async (msg) => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data === chats[chatId]) {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/8.webp')
            await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions)
        } else {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/85b/9a3/85b9a330-80ac-4e5d-a7b7-d63f5fab2e6b/6.webp')
            return bot.sendMessage(chatId, `К сожалению, ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions)
        }

        bot.sendMessage(chatId, `Ты выбрал цифру ${data}`)
    })
}

start()