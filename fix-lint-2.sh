sed -i 's/import { useState } from "react";/import { useState } from "react";\nimport { motion } from "framer-motion";/g' src/app/admin/systems/create/page.tsx
sed -i 's/import { motion } from "framer-motion";//g' src/app/admin/systems/create/page.tsx
sed -i 's/const { data, error } = await supabase.from('"'"'systems'"'"').insert(\[formData\]).select();/const { error } = await supabase.from('"'"'systems'"'"').insert(\[formData\]).select();/g' src/app/admin/systems/create/page.tsx
