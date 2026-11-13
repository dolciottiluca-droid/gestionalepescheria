const https = require('https');

function chiediAGoogle(modello, key, payload) {
    return new Promise((resolve, reject) => {
        const req = https.request({
            hostname: 'generativelanguage' + '.googleapis.com',
            path: `/v1beta/models/${modello}:generateContent`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': key.trim(),
                'Content-Length': Buffer.byteLength(payload)
            }
        }, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve(body));
        });
        req.on('error', reject);
        req.write(payload);
        req.end();
    });
}

exports.handler = async function(event) {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
    try {
        const { key, promptTxt, b64 } = JSON.parse(event.body);
        const chiaveFinale = process.env.GEMINI_API_KEY || key;
        if (!chiaveFinale) {
            return { statusCode: 400, body: JSON.stringify({ error: { message: 'Chiave API mancante' } }) };
        }

        const payload = JSON.stringify({
            contents: [{
                parts: [
                    { text: promptTxt },
                    { inline_data: { mime_type: 'image/jpeg', data: b64 } }
                ]
            }]
        });

        let result = await chiediAGoogle('gemini-3.8-flash-lite', chiaveFinale, payload);
        if (result.includes('high demand') || result.includes('not found')) {
            result = await chiediAGoogle('gemini-3.8-flash', chiaveFinale, payload);
        }

        return { statusCode: 200, body: result };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ error: { message: err.message } }) };
    }
};
