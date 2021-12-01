# Storybook Harness

> Documentation and examples are still being worked on.

This is a very basic `HarnessEnvironment` for use in Storybook play functions. It uses `@storybook/instrumenter` on the `UnitTestElement` from `@angular/cdk/testing/testbed` for support in the `@storybook/addon-interactions` addon.

## Getting Started

Install: `npm i @marklb/storybook-harness`

## Example

```ts
import { Meta, Story } from '@storybook/angular'
import { expect } from '@storybook/jest'

import { StorybookHarnessEnvironment } from '@marklb/storybook-harness'

import { ExampleComponent } from './example.component'

export default {
  title: 'Example',
  component: ExampleComponent,
} as Meta

export const Example: Story<ExampleComponent & { [key: string]: any }> = (args) => ({
  props: { ...args },
})
Example.play = async ({ canvasElement }) => {
  const exampleHarness = await (new StorybookHarnessEnvironment(canvasElement))
      .getHarness(ExampleHarness)

  const btn = await exampleHarness.getButton()
  await btn.click()

  await expect(await exampleHarness.getValue()).toBe('clicked')
}

```

## Use in unit test

Storybook will be providing a tool to automate running each story test, but for now you can use `@storybook/testing-angular`.

> If you are not using Jest then you will may have some trouble using the `expect` function from `@storybook/jest`, but I have a very rough implementation for Jasmine and will add an example for that soon. Any suggestions for making it easier to use the `expect` function and expectations from libraries, other than Jest, would be appreciated.

```ts
import { composeStories } from '@storybook/testing-angular'
import { createMountableStoryComponent } from '@storybook/testing-angular'
import { render } from '@testing-library/angular'

import * as stories from './example.stories' // import all stories from the stories file

// Every component that is returned maps 1:1 with the stories, but they already
// contain all decorators from story level, meta level and global level.
const { Example } = composeStories(stories as any)

describe('Example', () => {
  it('should use play', async () => {
    const { component, ngModule } = createMountableStoryComponent(story({}, {}))
    await render(component, { imports: [ ngModule ] })
    const res = await renderStory(Example)
    // Passing the fixture, so the `TestbedHarnessEnvironment` could be used in the `play` function.
    // NOTE: The `play` function needs to be called from the non-composed Story, until `@storybook/testing-angular` is updated.
    await stories.Example.play({ canvasElement: res.container as any, fixture: res.fixture })
  })
})
```

## Enable `@storybook/addon-interactions` support for different `HarnessEnvironment`

### StorybookUnitTestElement

If your `HarnessEnvironment` works with `UnitTestElement` from `@angular/cdk/testing/testbed` then you should be able to just replace `UnitTestElement` with `StorybookUnitTestElement`.

```ts
import { StorybookUnitTestElement } from '@marklb/storybook-harness'
```

### Different TestElement

If you have your own `TestElement` then you can use `UnitTestElementInstrumented` decorator to instrument your actions. The specified methods will show up in Storybook's Interactions panel with the function name and arguments, but the element HTML element will be shown as the first argument. So, `testElement.click('center')` may display in the Interactions panel as `click(<a>text</a>, 'center')`.

```ts
// This example assumes `MyTestElement` implements `TestElement` from `@angular/cdk/testing`.

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
export class MyStorybookUnitTestElement extends MyTestElement { }
```
