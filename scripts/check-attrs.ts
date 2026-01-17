import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  const { data } = await supabase
    .from('attribute_definitions')
    .select('slug, name_ru')
    .order('name_ru')
    .limit(50)

  console.log('Attributes in DB:')
  data?.forEach(a => console.log(`  ${a.slug} -> "${a.name_ru}"`))
  console.log(`\nTotal: ${data?.length}`)
}

main()
