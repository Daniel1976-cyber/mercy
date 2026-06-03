import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nhkpctbmyhjqsfozxdmb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oa3BjdGJteWhqcXNmb3p4ZG1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNDAzMzcsImV4cCI6MjA5NDYxNjMzN30.DzV-NsqO-KpqxdUldgj8OX-NPYWnHthPQ4bGi1ghGco';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  try {
    // Use placeholder image URL
    const imageUrl = 'https://via.placeholder.com/400x300?text=Cerveza';

    // Insert product
    const productData = {
      nombre: 'Cerveza',
      categoria: 'REGALOS FIESTA Y VARIOS', // choose any category
      subcategoria: 'Bebidas',
      precio: 120.00, // example price
      disponible: true,
      img: imageUrl,
      descripcion: 'Cerveza artesanal de alta calidad'
    };

    const { data: product, error: productError } = await supabase
      .from('productos')
      .insert([productData])
      .select();

    if (productError) {
      console.error('Error inserting product:', productError);
      return;
    }

    console.log('Product inserted:', product);
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

main();