/* ---------------------------- MODULOS ----------------------------- */
import { Router } from 'express';
// import path, { dirname } from 'path';
import path from 'path';

/* -------------------------- INSTANCIAS  --------------------------- */
const router = Router();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

/* ------------------------------ RUTAS -----------------------------*/
router.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, '../../public', 'index.html'));
    res.status(200);
});

router.get('*', async (req, res) => {
    res.status(404).send('404 - Page not found!!');
});

export default router;