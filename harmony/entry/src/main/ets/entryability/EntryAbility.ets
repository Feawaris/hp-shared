import { _console } from 'hp-shared'
import { AbilityConstant, UIAbility, Want } from '@kit.AbilityKit'
import { window } from '@kit.ArkUI'

export default class EntryAbility extends UIAbility {
  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    _console.warn('onCreate')
  }

  onDestroy(): void {
    _console.error('onDestroy')
  }

  onWindowStageCreate(windowStage: window.WindowStage): void {
    // Main window is created, set main page for this ability
    _console.warn('onWindowStageCreate')

    windowStage.loadContent('pages/Index', (err) => {
      if (err.code) {
        _console.error('Failed to load the content. Cause: ',err)
        return
      }
      _console.warn('Succeeded in loading the content.')
    })
  }

  onWindowStageDestroy(): void {
    // Main window is destroyed, release UI related resources
    _console.error('onWindowStageDestroy')
  }

  onForeground(): void {
    // Ability has brought to foreground
    _console.warn('onForeground')
  }

  onBackground(): void {
    // Ability has back to background
    _console.warn('onBackground')
  }
}
