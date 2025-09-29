const plugin = (api) => [
  'module:react-native-dotenv',
  {
    moduleName: '@AppEnvs',
    path: `${api.env() === 'test' ? '.env.test' : '.env'}`,
  },
];

module.exports = plugin;
