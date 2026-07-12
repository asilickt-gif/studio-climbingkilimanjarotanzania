import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '19nbwjcc',
    dataset: 'production'
  },
  deployment: {
    appId: 'zc5tdydfo6rhyzhe8izwllu5',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
