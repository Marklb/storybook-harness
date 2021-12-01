import { HarnessEnvironment, HarnessLoader, TestElement } from '@angular/cdk/testing'

import { StorybookUnitTestElement } from './unit-test-element'

export class StorybookHarnessEnvironment extends HarnessEnvironment<Element> {

  constructor(
    rawRootElement: Element,
  ) {
    super(rawRootElement)
  }

  static loader(rootElement?: Element): HarnessLoader {
    return new StorybookHarnessEnvironment(rootElement || document.body)
  }

  forceStabilize(): Promise<void> {
    throw new Error('Method not implemented.')
  }

  waitForTasksOutsideAngular(): Promise<void> {
    throw new Error('Method not implemented.')
  }

  protected getDocumentRoot(): Element {
    return document.body
  }

  protected createTestElement(element: Element): TestElement {
    return new StorybookUnitTestElement(element, () => Promise.resolve())
  }

  protected createEnvironment(element: Element): HarnessEnvironment<Element> {
    return new StorybookHarnessEnvironment(element)
  }

  protected async getAllRawElements(selector: string): Promise<Element[]> {
    return Array.from(this.rawRootElement.querySelectorAll(selector))
  }
}
