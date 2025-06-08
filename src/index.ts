import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Pool } from 'pg';

const app = express();
const PORT = 3000;

const pool = new Pool({
  user: 'TU_USUARIO_PG',
  host: 'localhost',
  database: 'tarea_db',
  password: 'TU_CONTRASENA_PG',
  port: 5432,
});

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

app.post('/api/upload', async (req, res) => {
  try {
    const { image, nombre } = req.body;

    if (!image) {
      return res.status(400).json({ message: 'No se recibió la imagen' });
    }

    const buffer = Buffer.from(image, 'base64');

    const result = await pool.query(
      'INSERT INTO fotos (nombre, imagen) VALUES ($1, $2) RETURNING id',
      [nombre || 'imagen_sin_nombre', buffer]
    );

    res.status(200).json({ message: 'Imagen guardada en BD', id: result.rows[0].id });
  } catch (error) {
    console.error('Error al guardar imagen:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
