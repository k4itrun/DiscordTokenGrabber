const app = require('express')(),
    bodyParser = require('body-parser'),
    http = require('http').createServer(app);

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

http.listen(app.get('port'), () => {
    console.log(`Endpoint api in port: ${app.get('port')}`);
});
