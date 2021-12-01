import { UnitTestElement } from '@angular/cdk/testing/testbed'

import { UnitTestElementInstrumented } from './unit-test-element-instrumented'

@UnitTestElementInstrumented([
  'blur',
  'clear',
  'click',
  'rightClick',
  'focus',
  'hover',
  'mouseAway',
  'sendKeys',
  'text',
  'setInputValue',
  'selectOptions',
  'dispatchEvent',
])
export class StorybookUnitTestElement extends UnitTestElement { }
