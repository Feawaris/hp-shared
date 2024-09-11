import { _console } from 'hp-shared'
import { BackupExtensionAbility, BundleVersion } from '@kit.CoreFileKit'

export default class EntryBackupAbility extends BackupExtensionAbility {
  async onBackup() {
    _console.warn('onBackup')
  }

  async onRestore(bundleVersion: BundleVersion) {
    _console.warn('onRestore', bundleVersion)
  }
}