/* eslint-env node */
const { execSync } = require('child_process');

try {
  console.log('Running Vitest tests...');
  const output = execSync('npx vitest run', { encoding: 'utf8' });
  console.log('Test output:');
  console.log(output);
  console.log('All tests passed successfully!');
  process.exit(0);
} catch (error) {
  console.error('Test execution failed:');
  console.error(error.stdout);
  process.exit(1);
}