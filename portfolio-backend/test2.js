const { exec } = require('child_process');

const server = exec('node server.js', { cwd: 'c:\\Users\\RAJ\\Desktop\\college\\Web technology\\Portfolio-CMS\\portfolio-backend' });

server.stdout.on('data', (data) => console.log('STDOUT:', data.toString()));
server.stderr.on('data', (data) => console.log('STDERR:', data.toString()));

setTimeout(() => {
  const fetch = require('node-fetch');
  console.log('Sending request...');
  fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({username: "t3", email: "t3@t.com", password: "p" })
  }).then(res => res.text()).then(txt => {
     console.log('RESPONSE:', txt);
     server.kill();
  }).catch(e => {
     console.log('FETCH ERROR:', e);
     server.kill();
  });
}, 3000);
