/* ---------------------------- MODULOS -----------------------------*/
const express = require('express');
const router = express.Router();
const path = require('path');

/* ------------------------------ RUTAS -----------------------------*/
router.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, '../../public', 'index.html'));
    res.status(200);
});

router.get('*', async (req, res) => {
    res.status(404).send('404 - Page not found!!');
});

module.exports = router;