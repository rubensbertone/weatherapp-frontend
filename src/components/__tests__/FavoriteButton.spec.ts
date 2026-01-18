import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import FavoriteButton from '../FavoriteButton.vue'

describe('FavoriteButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    global.fetch = vi.fn()
  })

  it('Test 7: Ist NICHT sichtbar, wenn User ausgeloggt ist', () => {
    const wrapper = mount(FavoriteButton, {
      props: { locationName: 'Berlin', country: 'DE' }
    })
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('Test 8: Ist sichtbar, wenn User eingeloggt ist', () => {
    localStorage.setItem('token', 'fake-token')
    const wrapper = mount(FavoriteButton, {
      props: { locationName: 'Berlin', country: 'DE' }
    })
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('Test 9: Sendet POST Request beim Klicken', async () => {
    localStorage.setItem('token', 'fake-token')
    const mockFetch = vi.fn().mockResolvedValue({ ok: true })
    global.fetch = mockFetch

    const wrapper = mount(FavoriteButton, {
      props: { locationName: 'Berlin', country: 'DE', latitude: 52, longitude: 13 }
    })

    await wrapper.find('button').trigger('click')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/favoriteLocations'),
      expect.objectContaining({ method: 'POST' })
    )
  })
})
