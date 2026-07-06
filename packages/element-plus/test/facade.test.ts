// @vitest-environment jsdom

import { mount } from '@vue/test-utils';
import { defineComponent, nextTick } from 'vue';
import { describe, expect, it } from 'vitest';
import { A2Surface, useA2UI } from '../src';

describe('@a2ui-vue3-elementplus/element-plus facade', () => {
  it('renders the default Element Plus catalog without passing runtime or registry props', () => {
    const Harness = defineComponent({
      components: { A2Surface },
      setup() {
        const { pushJson } = useA2UI();
        pushJson({
          version: 'v0.9',
          createSurface: {
            surfaceId: 'main'
          }
        });
        pushJson({
          version: 'v0.9',
          updateComponents: {
            surfaceId: 'main',
            components: [
              { id: 'root', component: 'Card', child: 'title' },
              { id: 'title', component: 'Text', text: 'Profile Form', variant: 'h2' }
            ]
          }
        });
      },
      template: '<A2Surface surface-id="main" />'
    });

    const wrapper = mount(Harness);

    expect(wrapper.text()).toContain('Profile Form');
    expect(wrapper.text()).not.toContain('Unknown A2UI component');
  });

  it('shares custom components registered through useA2UI with A2Surface', () => {
    const MetricCard = defineComponent({
      props: {
        value: [String, Number]
      },
      template: '<strong class="metric-card">{{ value }}</strong>'
    });
    const Harness = defineComponent({
      components: { A2Surface },
      setup() {
        const { pushJson } = useA2UI({
          components: {
            MetricCard: {
              component: MetricCard,
              propsMapper: (node, ctx) => ({
                value: ctx.resolveValue(node.value)
              })
            }
          }
        });
        pushJson({
          version: 'v0.9',
          createSurface: {
            surfaceId: 'main'
          }
        });
        pushJson({
          version: 'v0.9',
          updateDataModel: {
            surfaceId: 'main',
            path: '/',
            value: {
              metrics: {
                revenue: 128000
              }
            }
          }
        });
        pushJson({
          version: 'v0.9',
          updateComponents: {
            surfaceId: 'main',
            components: [{ id: 'root', component: 'MetricCard', value: { path: '/metrics/revenue' } }]
          }
        });
      },
      template: '<A2Surface surface-id="main" />'
    });

    const wrapper = mount(Harness);

    expect(wrapper.find('.metric-card').text()).toBe('128000');
    expect(wrapper.text()).not.toContain('Unknown A2UI component');
  });

  it('renders field labels and writes user input back to bound data paths', async () => {
    let a2ui: ReturnType<typeof useA2UI>;

    const Harness = defineComponent({
      components: { A2Surface },
      setup() {
        a2ui = useA2UI();
        a2ui.pushJson({
          version: 'v0.9',
          createSurface: {
            surfaceId: 'main'
          }
        });
        a2ui.pushJson({
          version: 'v0.9',
          updateComponents: {
            surfaceId: 'main',
            components: [
              { id: 'root', component: 'Column', children: ['name', 'guest', 'time', 'echo'] },
              { id: 'name', component: 'TextField', label: 'Name', value: { path: '/name' } },
              {
                id: 'guest',
                component: 'ChoicePicker',
                label: 'Guests',
                variant: 'mutuallyExclusive',
                options: [
                  { label: '1 person', value: '1' },
                  { label: '2 people', value: '2' }
                ],
                value: { path: '/guestCount' }
              },
              { id: 'time', component: 'DateTimeInput', label: 'Time', value: { path: '/reservationTime' }, enableDate: true },
              { id: 'echo', component: 'Text', text: { path: '/name' } }
            ]
          }
        });
      },
      template: '<A2Surface surface-id="main" />'
    });

    const wrapper = mount(Harness);

    expect(wrapper.text()).toContain('Name');
    expect(wrapper.text()).toContain('Guests');
    expect(wrapper.text()).toContain('Time');

    await wrapper.find('input').setValue('Ada');
    await nextTick();

    expect(a2ui!.runtime.getData('main', '/name')).toBe('Ada');
    expect(wrapper.text()).toContain('Ada');

    wrapper.findComponent({ name: 'A2ChoicePicker' }).vm.$emit('update:modelValue', '2');
    await nextTick();

    expect(a2ui!.runtime.getData('main', '/guestCount')).toBe('2');
  });
});
