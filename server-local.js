const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Cargar productos desde Supabase
const https = require('https');
let productos = [];

function fetchProductsFromSupabase() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'nhkpctbmyhjqsfozxdmb.supabase.co',
      path: '/rest/v1/productos?select=*',
      method: 'GET',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oa3BjdGJteWhqcXNmb3p4ZG1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNDAzMzcsImV4cCI6MjA5NDYxNjMzN30.DzV-NsqO-KpqxdUldgj8OX-NPYWnHthPQ4bGi1ghGco',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oa3BjdGJteWhqcXNmb3p4ZG1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNDAzMzcsImV4cCI6MjA5NDYxNjMzN30.DzV-NsqO-KpqxdUldgj8OX-NPYWnHthPQ4bGi1ghGco'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`Status: ${res.statusCode}, Body: ${data}`));
        }
      });
    });

    req.on('error', (e) => { reject(e); });
    req.end();
  });
}

fetchProductsFromSupabase().then(data => {
  productos = data.map(p => ({
    id: p.id,
    nombre: p.nombre,
    precio: p.precio,
    categoria: p.categoria,
    subcategoria: "General",
    disponible: p.disponible,
    img: `https://via.placeholder.com/400x300?text=${encodeURIComponent(p.nombre)}`
  }));
  console.log(`[SERVER] Cargados ${productos.length} productos desde Supabase`);
}).catch(e => {
  console.error("Error al cargar productos desde Supabase:", e);
  // Fallback a mercy.json
  try {
    const fs = require('fs');
    const path = require('path');
    const fileData = fs.readFileSync(path.join(__dirname, 'mercy.json'), 'utf8');
    const rawProducts = JSON.parse(fileData);
    productos = rawProducts.map((p, index) => ({
      id: index + 1,
      nombre: p.Nombre,
      precio: p['Precio (CUP)'],
      categoria: p.Categoria,
      subcategoria: "General",
      disponible: true,
      img: `https://via.placeholder.com/400x300?text=${encodeURIComponent(p.Nombre)}`
    }));
    console.log(`[SERVER] Fallback: Cargados ${productos.length} productos desde mercy.json`);
  } catch (err) {
    console.error("Error en fallback de mercy.json:", err);
  }
});

// Rutas API
app.get('/api/products', (req, res) => {
  res.json(productos);
});

app.get('/api/products/:id', (req, res) => {
  const producto = productos.find(p => p.id === parseInt(req.params.id));
  if (!producto) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }
  res.json(producto);
});

// Ruta para obtener categorías únicas
app.get('/api/categories', (req, res) => {
  const categories = [...new Set(productos.map(p => p.categoria))];
  res.json(categories);
});

// Ruta para obtener subcategorías por categoría
app.get('/api/subcategories/:category', (req, res) => {
  const subcategories = [...new Set(
    productos
      .filter(p => p.categoria === req.params.category)
      .map(p => p.subcategoria)
  )];
  res.json(subcategories);
});

// Servir archivos estáticos desde el directorio raíz (para romero.html)
app.use(express.static(__dirname));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});