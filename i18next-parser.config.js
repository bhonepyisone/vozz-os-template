module.exports = {
  locales: ['en', 'fr', 'de'],       // Add your language codes
  output: 'locales/$LOCALE/$NAMESPACE.json',
  input: ['src/**/*.{js,jsx,ts,tsx}'], // Adjust if your files are in another folder
  defaultNamespace: 'translation',
  useKeysAsDefaultValue: true,       // Optional: uses key as value
};
