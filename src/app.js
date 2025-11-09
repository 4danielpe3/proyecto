import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';

// importar las rutas
import productosRoutes from './routes/productosRoutes.js';
import loginRoutes from './routes/loginRoutes.js';
import detallesRoutes from './routes/detallesRoutes.js'

const app = express();

app.use(cors({
  origin: '*', // o la URL de tu app si quieres restringir
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// Middleware para subir archivos
app.use(fileUpload({
  useTempFiles: true,      // permite usar archivos temporales
  tempFileDir: '/tmp',     // carpeta temporal para los archivos
  createParentPath: true
}));

// Middleware para parsear JSON
app.use(express.json());

// Rutas de la API
app.use('/api', detallesRoutes)
app.use('/api', productosRoutes);
app.use('/api', loginRoutes);

// Manejar endpoints no encontrados
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Endpoint not found'
  });
});

export default app;
