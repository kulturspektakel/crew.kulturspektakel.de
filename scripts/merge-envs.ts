import path from 'path';
import {promises as fs} from 'fs';
import {parse} from 'dotenv';

const ENV_PROD_PATH = path.join(__dirname, '..', '.env.production');
const ENV_PATH = path.join(__dirname, '..', '.env');
const ENV_YML = path.join(__dirname, '..', 'env.json');

(async () => {
  const prod = await (
    await fs.readFile(ENV_PROD_PATH)
  )
    .toString()
    .split('\n')
    // filter empty vars
    .filter((l) => !l.endsWith('=""'));

  // adding new line
  prod.unshift('');
  await fs.appendFile(ENV_PATH, prod.join('\n'));

  const conf = await fs.readFile(ENV_PATH);
  const p = parse(conf);
  delete p.PORT;

  await fs.writeFile(ENV_YML, JSON.stringify(p));

  // await fs.unlink(ENV_PROD_PATH);
  console.log('Merged configs into .env');
})();
