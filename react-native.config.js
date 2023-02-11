module.exports = {
  dependencies: {
    'react-native-sqlite-storage-api30': {
      platforms: {
        android: {
          sourceDir:
            '../node_modules/react-native-sqlite-storage-api30/platforms/android-native',
          packageImportPath: 'import io.liteglue.SQLitePluginPackage;',
          packageInstance: 'new SQLitePluginPackage()',
        },
      },
    },
  },
}
