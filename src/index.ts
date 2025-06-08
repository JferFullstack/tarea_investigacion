import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { pool } from '../backend/db';

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Multer configuración para recibir archivo en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Ruta para subir imagen
app.post('/upload', upload.single('imagen'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ msg: 'No se subió ningún archivo' });

    const nombre = req.body.nombre || 'Sin nombre';

    // Guardar en MySQL
    const query = 'INSERT INTO fotos (nombre, imagen) VALUES (?, ?)';
    const [result] = await pool.query(query, [nombre, file.buffer]);

    res.json({ msg: 'Imagen guardada correctamente', id: (result as any).insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
