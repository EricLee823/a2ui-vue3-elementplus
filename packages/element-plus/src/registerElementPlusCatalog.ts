import type { A2CustomComponents } from '@a2ui/vue-renderer';
import {
  A2Button,
  A2Card,
  A2CheckBox,
  A2ChoicePicker,
  A2Column,
  A2DateTimeInput,
  A2Divider,
  A2Icon,
  A2Image,
  A2Modal,
  A2Row,
  A2Slider,
  A2Tabs,
  A2Text,
  A2TextField
} from './components';

function bindingPath(input: unknown): string | undefined {
  return input && typeof input === 'object' && 'path' in (input as Record<string, unknown>)
    ? String((input as Record<string, unknown>).path)
    : undefined;
}

export function createElementPlusCatalog(): A2CustomComponents {
  return {
    Text: {
      component: A2Text,
      propsMapper: (node, ctx) => ({
        text: ctx.resolveValue(node.text),
        variant: node.variant
      })
    },
    Image: {
      component: A2Image,
      propsMapper: (node, ctx) => ({
        url: ctx.resolveValue(node.url),
        fit: node.fit,
        variant: node.variant
      })
    },
    Icon: {
      component: A2Icon,
      propsMapper: (node, ctx) => ({
        name: ctx.resolveValue(node.name)
      })
    },
    Divider: {
      component: A2Divider,
      propsMapper: (node) => ({
        axis: node.axis
      })
    },
    Row: {
      component: A2Row,
      propsMapper: (node, ctx) => ({
        justify: node.justify,
        align: node.align,
        children: ctx.renderChildren(node.children as string[])
      })
    },
    Column: {
      component: A2Column,
      propsMapper: (node, ctx) => ({
        justify: node.justify,
        align: node.align,
        children: ctx.renderChildren(node.children as string[])
      })
    },
    Card: {
      component: A2Card,
      propsMapper: (node, ctx) => ({
        child: ctx.renderChild(node.child as string)
      })
    },
    Button: {
      component: A2Button,
      propsMapper: (node, ctx) => ({
        variant: node.variant,
        child: ctx.renderChild(node.child as string),
        text: node.text
      }),
      eventsMapper: (node, ctx) => ({
        onClick: () => {
          const action = node.action as Record<string, any> | undefined;
          const event = action?.event;
          if (event?.name) {
            ctx.emitAction(String(event.name), event.context);
          }
        }
      })
    },
    TextField: {
      component: A2TextField,
      dependencies: (node) => [bindingPath(node.value)],
      propsMapper: (node, ctx) => {
        const path = bindingPath(node.value);
        return {
          label: node.label,
          modelValue: path ? ctx.getValue(path) : ctx.resolveValue(node.value),
          textFieldType: node.textFieldType,
          validationRegexp: node.validationRegexp
        };
      },
      eventsMapper: (node, ctx) => ({
        'onUpdate:modelValue': (value: unknown) => ctx.setValue(bindingPath(node.value), value)
      })
    },
    CheckBox: {
      component: A2CheckBox,
      dependencies: (node) => [bindingPath(node.value)],
      propsMapper: (node, ctx) => {
        const path = bindingPath(node.value);
        return {
          label: node.label,
          modelValue: path ? Boolean(ctx.getValue(path)) : Boolean(ctx.resolveValue(node.value))
        };
      },
      eventsMapper: (node, ctx) => ({
        'onUpdate:modelValue': (value: boolean) => ctx.setValue(bindingPath(node.value), value)
      })
    },
    ChoicePicker: {
      component: A2ChoicePicker,
      dependencies: (node) => [bindingPath(node.selections)],
      propsMapper: (node, ctx) => {
        const path = bindingPath(node.selections);
        const maxAllowedSelections = Number(node.maxAllowedSelections ?? 1);
        const raw = path ? ctx.getValue(path) : ctx.resolveValue(node.selections);
        return {
          options: node.options,
          modelValue: maxAllowedSelections === 1 && Array.isArray(raw) ? raw[0] : raw,
          multiple: maxAllowedSelections !== 1
        };
      },
      eventsMapper: (node, ctx) => ({
        'onUpdate:modelValue': (value: unknown) => {
          const maxAllowedSelections = Number(node.maxAllowedSelections ?? 1);
          ctx.setValue(bindingPath(node.selections), maxAllowedSelections === 1 ? [value] : value);
        }
      })
    },
    DateTimeInput: {
      component: A2DateTimeInput,
      dependencies: (node) => [bindingPath(node.value)],
      propsMapper: (node, ctx) => {
        const path = bindingPath(node.value);
        return {
          modelValue: path ? ctx.getValue(path) : ctx.resolveValue(node.value),
          enableDate: node.enableDate !== false,
          enableTime: Boolean(node.enableTime)
        };
      },
      eventsMapper: (node, ctx) => ({
        'onUpdate:modelValue': (value: unknown) => ctx.setValue(bindingPath(node.value), value)
      })
    },
    Slider: {
      component: A2Slider,
      dependencies: (node) => [bindingPath(node.value)],
      propsMapper: (node, ctx) => {
        const path = bindingPath(node.value);
        return {
          modelValue: path ? ctx.getValue(path) : ctx.resolveValue(node.value),
          minValue: node.minValue,
          maxValue: node.maxValue
        };
      },
      eventsMapper: (node, ctx) => ({
        'onUpdate:modelValue': (value: number) => ctx.setValue(bindingPath(node.value), value)
      })
    },
    Modal: {
      component: A2Modal,
      propsMapper: (node, ctx) => ({
        entryPointChild: ctx.renderChild(node.entryPointChild as string),
        contentChild: ctx.renderChild(node.contentChild as string)
      })
    },
    Tabs: {
      component: A2Tabs,
      propsMapper: (node, ctx) => ({
        tabItems: Array.isArray(node.tabItems)
          ? node.tabItems.map((item: any) => ({
              title: ctx.resolveValue(item.title),
              child: ctx.renderChild(item.child)
            }))
          : []
      })
    }
  };
}
