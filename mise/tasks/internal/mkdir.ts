#!/usr/bin/env -S deno run --no-config --ext=ts --allow-env=usage_path --allow-write
//MISE hide=true
//MISE quiet=true
//USAGE arg "<path>" help="Directory to create, including missing parents."

await Deno.mkdir(Deno.env.get('usage_path')!, { recursive: true });
