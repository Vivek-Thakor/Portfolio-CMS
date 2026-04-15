fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({username: "t2", email: "t2@t.com", password: "p" })
}).then(res => res.text()).then(console.log).catch(console.error);
