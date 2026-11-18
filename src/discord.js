const axios = require('axios');
const Logger = require('./logger');

async function updateDiscordStatus(token, text, emoji) {
    try {
        // Discord giới hạn độ dài status tối đa 128 ký tự
        const trimmedText = text.slice(0, 128);

        await axios.patch('https://discordapp.com/api/v8/users/@me/settings', {
            custom_status: {
                text: trimmedText,
                emoji_id: null,
                emoji_name: emoji,
                expires_at: new Date(Date.now() + 60000).toISOString()
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        Logger.success(`Đã cập nhật status: ${trimmedText}`);
    } catch (error) {
        if (error.response && error.response.status === 401) {
            Logger.error('Token Discord không hợp lệ hoặc đã hết hạn!');
        } else {
            Logger.error('Lỗi khi cập nhật Discord Status: ' + error.message);
        }
    }
}

async function checkDiscordToken(token) {
    try {
        const res = await axios.get('https://discordapp.com/api/v8/users/@me', {
            headers: { 'Authorization': token }
        });
        return res.status === 200;
    } catch (e) {
        return false;
    }
}

module.exports = { updateDiscordStatus, checkDiscordToken };