exports.handler = async function(event) {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
    try {
        const { key, promptTxt, b64 } = JSON.parse(event.body);
        const resp = await fetch('https://googleapis.com' + encodeURIComponent(key), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: promptTxt },
                        { inline_data: { mime_type: 'image/jpeg', data: b64 } }
                    ]
                }]
            })
        });
        const data = await resp.json();
        return { statusCode: 200, body: JSON.stringify(data) };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ error: { message: err.message } }) };
    }
};
