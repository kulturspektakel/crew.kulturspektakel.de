import path from 'path';
import {promises as fs} from 'fs';
import {parse} from 'dotenv';

const ENV_PROD_PATH = path.join(__dirname, '..', '.env.production');
const ENV_PATH = path.join(__dirname, '..', '.env');

(async () => {
  const prod = await (await fs.readFile(ENV_PROD_PATH)).toString().split('\n');

  // adding new line
  prod.unshift('');
  await fs.appendFile(ENV_PATH, prod.join('\n'));
  const conf = await fs.readFile(ENV_PATH);
  // filter comments and empty lines
  await fs.writeFile(
    ENV_PATH,
    conf
      .toString()
      .split('\n')
      .filter((l) => !l.endsWith('=""'))
      .filter((l) => !l.startsWith('#'))
      .join('\n'),
  );

  process.env = {
    ...process.env,
    ...parse(conf),
  };
  await fs.unlink(ENV_PROD_PATH);
  console.log('Merged configs into .env');
})();
