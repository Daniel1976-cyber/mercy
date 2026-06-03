import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nhkpctbmyhjqsfozxdmb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oa3BjdGJteWhqcXNmb3p4ZG1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNDAzMzcsImV4cCI6MjA5NDYxNjMzN30.DzV-NsqO-KpqxdUldgj8OX-NPYWnHthPQ4bGi1ghGco';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  const { data: productos, error } = await supabase
    .from('productos')
    .select('*')
    .ilike('nombre', '%cerveza%');

  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  console.log('Found products:', productos);
  console.log('Total matches:', productos.length);
}

main();