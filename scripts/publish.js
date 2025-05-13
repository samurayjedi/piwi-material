const { execSync } = require('child_process');
const commitMessage = process.argv[2]; // Get commit message from npm argument

console.log(`${process.argv[2]}`);
if (!commitMessage) {
  console.error(
    'Error: Commit message is required. Usage: `npm run publish --commit="Your commit message"`',
  );
  process.exit(1);
}

try {
  console.log('🔄 Adding files to Git...');
  execSync('git add .');

  console.log('💾 Committing changes...');
  execSync(`git commit -m "${commitMessage}"`);

  console.log('🚀 Pushing to GitHub...');
  execSync('git push -u origin main');

  console.log('📦 Updating npm version (patch)...');
  execSync('npm version patch');

  console.log('📡 Publishing to npm...');
  execSync('npm publish --access public');

  console.log('✅ Successfully published!');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
