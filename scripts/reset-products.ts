import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  console.log('Resetting products parsing...')

  // Delete product attributes
  const { error: e1 } = await supabase
    .from('product_attributes')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')
  if (e1) console.log('product_attributes:', e1.message)
  else console.log('✓ Deleted product_attributes')

  // Delete product images
  const { error: e2 } = await supabase
    .from('product_images')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')
  if (e2) console.log('product_images:', e2.message)
  else console.log('✓ Deleted product_images')

  // Delete products
  const { error: e3 } = await supabase
    .from('products')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')
  if (e3) console.log('products:', e3.message)
  else console.log('✓ Deleted products')

  // Reset parse_progress
  const { error: e4 } = await supabase
    .from('parse_progress')
    .update({
      products_parsed: false,
      products_count: 0,
      last_page: 0
    })
    .neq('category_id', '00000000-0000-0000-0000-000000000000')
  if (e4) console.log('parse_progress:', e4.message)
  else console.log('✓ Reset parse_progress')

  console.log('\nDone! Ready to re-parse products.')
}

main()
