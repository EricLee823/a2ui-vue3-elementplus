import { defineComponent, h, ref, type PropType, type VNodeChild } from 'vue';
import {
  ElButton,
  ElCard,
  ElCheckbox,
  ElDatePicker,
  ElDialog,
  ElDivider,
  ElImage,
  ElInput,
  ElSelect,
  ElOption,
  ElSlider,
  ElTabPane,
  ElTabs,
  ElTimePicker
} from 'element-plus';

const renderChildren = (children: VNodeChild): any => (Array.isArray(children) ? children : children ?? undefined);

export const A2Text = defineComponent({
  name: 'A2Text',
  props: {
    text: [String, Number, Boolean],
    variant: String
  },
  setup(props) {
    return () => {
      const tag =
        props.variant === 'h1' || props.variant === 'h2' || props.variant === 'h3' || props.variant === 'h4' || props.variant === 'h5'
          ? props.variant
          : props.variant === 'caption'
            ? 'small'
            : 'p';
      return h(tag, { class: ['a2-text', props.variant && `a2-text--${props.variant}`] }, String(props.text ?? ''));
    };
  }
});

export const A2Image = defineComponent({
  name: 'A2Image',
  props: {
    url: String,
    fit: String,
    variant: String
  },
  setup(props) {
    return () => h(ElImage, { src: props.url, fit: props.fit as any, class: ['a2-image', props.variant && `a2-image--${props.variant}`] });
  }
});

export const A2Icon = defineComponent({
  name: 'A2Icon',
  props: {
    name: String
  },
  setup(props) {
    return () => h('span', { class: 'a2-icon', 'aria-hidden': 'true' }, props.name ?? '');
  }
});

export const A2Divider = defineComponent({
  name: 'A2Divider',
  props: {
    axis: String
  },
  setup(props) {
    return () => h(ElDivider, { direction: props.axis === 'vertical' ? 'vertical' : 'horizontal' });
  }
});

export const A2Row = defineComponent({
  name: 'A2Row',
  props: {
    justify: String,
    align: String,
    children: [Array, Object, String] as PropType<VNodeChild>
  },
  setup(props) {
    return () =>
      h(
        'div',
        {
          class: 'a2-row',
          style: {
            justifyContent: props.justify === 'spaceBetween' ? 'space-between' : props.justify,
            alignItems: props.align
          }
        },
        renderChildren(props.children)
      );
  }
});

export const A2Column = defineComponent({
  name: 'A2Column',
  props: {
    justify: String,
    align: String,
    children: [Array, Object, String] as PropType<VNodeChild>
  },
  setup(props) {
    return () =>
      h(
        'div',
        {
          class: 'a2-column',
          style: {
            justifyContent: props.justify,
            alignItems: props.align
          }
        },
        renderChildren(props.children)
      );
  }
});

export const A2Card = defineComponent({
  name: 'A2Card',
  props: {
    child: [Array, Object, String] as PropType<VNodeChild>
  },
  setup(props) {
    return () => h(ElCard as any, { class: 'a2-card' }, () => renderChildren(props.child));
  }
});

export const A2Button = defineComponent({
  name: 'A2Button',
  props: {
    variant: String,
    child: [Array, Object, String] as PropType<VNodeChild>,
    text: [String, Number]
  },
  emits: ['click'],
  setup(props, { emit }) {
    return () =>
      h(
        ElButton as any,
        {
          type: props.variant === 'primary' ? 'primary' : props.variant === 'danger' ? 'danger' : undefined,
          text: props.variant === 'borderless',
          onClick: () => emit('click')
        },
        () => renderChildren(props.child) ?? String(props.text ?? '')
      );
  }
});

export const A2TextField = defineComponent({
  name: 'A2TextField',
  props: {
    label: String,
    modelValue: [String, Number],
    textFieldType: String,
    validationRegexp: String
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h('label', { class: 'a2-field' }, [
        props.label ? h('span', { class: 'a2-field__label' }, props.label) : null,
        h(ElInput as any, {
          modelValue: props.modelValue,
          type: props.textFieldType === 'longText' ? 'textarea' : props.textFieldType === 'obscured' ? 'password' : 'text',
          onInput: (value: string) => emit('update:modelValue', props.textFieldType === 'number' ? Number(value) : value)
        })
      ]);
  }
});

export const A2CheckBox = defineComponent({
  name: 'A2CheckBox',
  props: {
    label: String,
    modelValue: Boolean
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h(
        ElCheckbox as any,
        {
          modelValue: props.modelValue,
          'onUpdate:modelValue': (value: unknown) => emit('update:modelValue', Boolean(value))
        },
        () => props.label
      );
  }
});

export const A2ChoicePicker = defineComponent({
  name: 'A2ChoicePicker',
  props: {
    options: {
      type: Array as PropType<Array<{ label: string; value: unknown }>>,
      default: () => []
    },
    modelValue: [String, Number, Boolean, Array, Object] as PropType<unknown>,
    multiple: Boolean
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h(
        ElSelect as any,
        {
          modelValue: props.modelValue,
          multiple: props.multiple,
          class: 'a2-choice-picker',
          'onUpdate:modelValue': (value: unknown) => emit('update:modelValue', value)
        },
        () => props.options.map((option) => h(ElOption as any, { key: String(option.value), label: option.label, value: option.value as any }))
      );
  }
});

export const A2DateTimeInput = defineComponent({
  name: 'A2DateTimeInput',
  props: {
    modelValue: [String, Date, Array] as PropType<unknown>,
    enableDate: Boolean,
    enableTime: Boolean
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => {
      const picker = props.enableTime && !props.enableDate ? ElTimePicker : ElDatePicker;
      return h(picker as any, {
        modelValue: props.modelValue,
        type: props.enableDate && props.enableTime ? 'datetime' : 'date',
        valueFormat: 'YYYY-MM-DDTHH:mm:ss',
        'onUpdate:modelValue': (value: unknown) => emit('update:modelValue', value)
      });
    };
  }
});

export const A2Slider = defineComponent({
  name: 'A2Slider',
  props: {
    modelValue: Number,
    minValue: Number,
    maxValue: Number
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h(ElSlider as any, {
        modelValue: props.modelValue ?? 0,
        min: props.minValue ?? 0,
        max: props.maxValue ?? 100,
        'onUpdate:modelValue': (value: number | number[]) => emit('update:modelValue', Array.isArray(value) ? value[0] : value)
      });
  }
});

export const A2Modal = defineComponent({
  name: 'A2Modal',
  props: {
    entryPointChild: [Array, Object, String] as PropType<VNodeChild>,
    contentChild: [Array, Object, String] as PropType<VNodeChild>
  },
  setup(props) {
    const visible = ref(false);
    return () => [
      h('span', { class: 'a2-modal__entry', onClick: () => (visible.value = true) }, renderChildren(props.entryPointChild)),
      h(
        ElDialog as any,
        {
          modelValue: visible.value,
          'onUpdate:modelValue': (value: boolean) => (visible.value = value)
        },
        () => renderChildren(props.contentChild)
      )
    ];
  }
});

export const A2Tabs = defineComponent({
  name: 'A2Tabs',
  props: {
    tabItems: {
      type: Array as PropType<Array<{ title: string; child: VNodeChild }>>,
      default: () => []
    }
  },
  setup(props) {
    return () =>
      h(
        ElTabs as any,
        { class: 'a2-tabs' },
        () => props.tabItems.map((item, index) => h(ElTabPane as any, { key: index, label: item.title, name: String(index) }, () => renderChildren(item.child)))
      );
  }
});
