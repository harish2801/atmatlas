import fs from 'node:fs/promises';import path from 'node:path';import {fileURLToPath} from 'node:url';
export const dbPath=process.env.ATM_DB_PATH||fileURLToPath(new URL('./data/db.json',import.meta.url));
let queue=Promise.resolve();
export async function readDB(){await queue;return JSON.parse(await fs.readFile(dbPath,'utf8'));}
export function changeDB(fn,expectedRevision){const task=queue.then(async()=>{let db=JSON.parse(await fs.readFile(dbPath,'utf8'));if(expectedRevision!==undefined&&Number(expectedRevision)!==db.revision){const e=Error('Data changed in another window. Refresh and try again.');e.status=409;throw e;}const result=await fn(db);db.revision++;const temp=dbPath+'.tmp';await fs.mkdir(path.join(path.dirname(dbPath),'backups'),{recursive:true});await fs.copyFile(dbPath,path.join(path.dirname(dbPath),'backups','previous.json'));await fs.writeFile(temp,JSON.stringify(db,null,2));await fs.rename(temp,dbPath);return {db,result};});queue=task.catch(()=>{});return task;}
