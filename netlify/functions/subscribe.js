const BLOCKED_DOMAINS = new Set([
  'gmail.com', 'googlemail.com',
  'yahoo.com', 'yahoo.co.uk', 'yahoo.fr', 'yahoo.de', 'yahoo.se', 'yahoo.es', 'yahoo.it', 'yahoo.co.jp',
  'hotmail.com', 'hotmail.co.uk', 'hotmail.se', 'hotmail.fr', 'hotmail.de', 'hotmail.es', 'hotmail.it',
  'outlook.com', 'outlook.se', 'outlook.de', 'outlook.fr', 'outlook.es', 'outlook.co.uk',
  'live.com', 'live.se', 'live.co.uk', 'live.fr', 'live.de', 'live.nl',
  'msn.com',
  'gmx.de', 'gmx.com', 'gmx.net', 'gmx.at', 'gmx.ch',
  'web.de', 'freenet.de', 't-online.de',
  'aol.com', 'aol.co.uk',
  'icloud.com', 'me.com', 'mac.com',
  'protonmail.com', 'proton.me',
  'tutanota.com', 'tutanota.de', 'tuta.io',
  'fastmail.com', 'fastmail.fm',
  'hey.com',
  'mail.com', 'inbox.com',
  'ymail.com', 'rocketmail.com',
  'telia.com', 'spray.se', 'comhem.se', 'bredband.net', 'tele2.se',
  'btinternet.com', 'sky.com', 'virginmedia.com',
  'orange.fr', 'sfr.fr', 'laposte.net', 'wanadoo.fr',
  'libero.it', 'virgilio.it',
  'seznam.cz', 'wp.pl', 'onet.pl',
  'rambler.ru', 'yandex.ru', 'yandex.com', 'mail.ru',
  'qq.com', '163.com', '126.com',
]);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  let email;
  try {
    ({ email } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request.' }) };
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Please enter a valid email address.' }) };
  }

  const domain = email.split('@')[1].toLowerCase();
  if (BLOCKED_DOMAINS.has(domain)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Please use your business email address.' }),
    };
  }

  const POSTMARK_API_KEY = process.env.POSTMARK_API_KEY;
  if (!POSTMARK_API_KEY) {
    console.error('POSTMARK_API_KEY not set');
    return { statusCode: 500, body: JSON.stringify({ error: 'Configuration error.' }) };
  }

  const send = (payload) =>
    fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': POSTMARK_API_KEY,
      },
      body: JSON.stringify(payload),
    });

  const adminRes = await send({
    From: 'tech@innomega.se',
    To: 'tech@innomega.se',
    Subject: `New subscriber: ${email}`,
    TextBody: `New AI Business Intelligence subscriber:\n\n${email}\n\nDomain: ${domain}`,
  });

  if (!adminRes.ok) {
    const err = await adminRes.text();
    console.error('Postmark admin notification failed:', adminRes.status, err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to process subscription. Please try again.' }) };
  }

  const welcomeRes = await send({
    From: 'tech@innomega.se',
    To: email,
    Subject: "You're subscribed to AI Business Intelligence",
    HtmlBody: `
      <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:48px 32px;color:#1a1a1a;">
        <p style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#6b7280;margin:0 0 32px;">INNOMEGA — AI Business Intelligence</p>
        <h1 style="font-size:28px;font-weight:300;color:#111827;margin:0 0 20px;line-height:1.3;">You're in.</h1>
        <p style="font-size:16px;color:#374151;line-height:1.75;margin:0 0 16px;">Thank you for subscribing to AI Business Intelligence — essays on how artificial intelligence is reshaping how businesses operate, compete, and think about strategy.</p>
        <p style="font-size:16px;color:#374151;line-height:1.75;margin:0 0 36px;">We publish deliberately, not on a schedule. When we have something worth saying, you'll hear from us.</p>
        <a href="https://www.innomega.se/blog/" style="display:inline-block;padding:13px 28px;background:#1a1a1a;color:#ffffff;text-decoration:none;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;font-weight:500;border-radius:9999px;">Read latest articles</a>
        <p style="font-size:13px;color:#9ca3af;margin-top:48px;line-height:1.6;">INNOMEGA AB &middot; Sweden<br>You subscribed at innomega.se. To unsubscribe, reply to this email.</p>
      </div>
    `,
    TextBody: `You're subscribed to AI Business Intelligence by INNOMEGA.\n\nWe publish essays on how artificial intelligence is reshaping how businesses operate, compete, and think about strategy. We publish deliberately — when we have something worth saying, you'll hear from us.\n\nRead our latest articles: https://www.innomega.se/blog/\n\n---\nINNOMEGA AB · Sweden\nTo unsubscribe, reply to this email.`,
  });

  if (!welcomeRes.ok) {
    const err = await welcomeRes.text();
    console.error('Postmark welcome email failed:', welcomeRes.status, err);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
};
