import { readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { root } from './build.mjs';
for(const folder of ['src','scripts','tests'])for(const file of await readdir(resolve(root,folder)))if(/\.m?js$/.test(file)){const r=spawnSync(process.execPath,['--check',resolve(root,folder,file)],{stdio:'inherit'});if(r.status!==0)process.exit(r.status??1);}
console.log('Sintaxe dos módulos verificada.');
