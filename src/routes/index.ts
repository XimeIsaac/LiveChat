import { Router } from 'express';
import path from 'path';

const router = Router();

// Ruta para la página principal
router.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'home.html'));
});

// Ruta para el canal
router.get('/canal/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'canal.html'));
});

export default router;
