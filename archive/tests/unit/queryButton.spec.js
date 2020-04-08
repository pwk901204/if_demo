import Vue from 'vue'
import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import QueryButton from '@/components/QueryButton/QueryButton.vue'

describe('Query Button', () => {
  it('展示 clicked', async () => {
    const wrapper = shallowMount(QueryButton)
    wrapper.find('a').trigger('click')
    await Vue.nextTick()
    expect(wrapper.find('a').text()).toMatch('收起')
  })
})
