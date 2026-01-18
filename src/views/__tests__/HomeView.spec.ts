import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeView from '../HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { flushPromises } from '@vue/test-utils'

/**
 * Router-Konfiguration für die Tests.
 * Definiert die Zielroute für die Wetter-Detailansicht.
 */
const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/weather/:city', name: 'weather', component: { template: '<div>Weather</div>' } }]
})

/**
 * Testsuite für die HomeView-Komponente.
 * Enthält Tests für die Benutzeroberfläche und die Integration der Standortsuche.
 */
describe('HomeView', () => {

  /**
   * Setzt die Testumgebung vor jedem Testfall zurück.
   * Bereinigt Mocks, initialisiert den globalen Fetch-Mock und aktiviert Fake-Timer für Debounce-Logik.
   */
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
    vi.useFakeTimers()
  })

  /**
   * @test Test 5
   * @description Prüft, ob das Suchfeld initial ausgeblendet ist und erst nach Klicken
   * auf den "Stadt suchen"-Button im DOM erscheint.
   */
  it('Test 5: Zeigt die Suchleiste an, wenn der Button geklickt wird', async () => {
    const wrapper = mount(HomeView, {
      global: { plugins: [router] }
    })

    // Button klicken, um showSearch auf true zu setzen
    await wrapper.find('.btn.outline').trigger('click')

    expect(wrapper.find('input.search-input').exists()).toBe(true)
  })

  /**
   * @test Test 6
   * @description Validiert den kompletten Such-Workflow:
   * 1. Eingabe von Suchbegriffen.
   * 2. Einhaltung des Debounce-Delays (1000ms).
   * 3. Korrekter API-Aufruf an den Backend-Proxy.
   * 4. Korrekte Anzeige der vom Backend zurückgegebenen Ergebnisse im Dropdown.
   */
  it('Test 6: Löst API-Suche zum Backend aus und zeigt Ergebnisse', async () => {
    // Vorbereiten des API-Mocks
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([{ name: 'Berlin', country: 'DE', lat: 52, lon: 13 }])
    })
    global.fetch = mockFetch

    vi.useFakeTimers()

    const wrapper = mount(HomeView, {
      global: { plugins: [router] }
    })

    // Suchmodus aktivieren
    await wrapper.find('.btn.outline').trigger('click')

    // Suchbegriff eingeben
    const input = wrapper.find('input.search-input')
    await input.setValue('Ber')

    // Debounce-Timer manuell vorspulen (SEARCH_DELAY = 1000ms)
    vi.advanceTimersByTime(1000)

    // Warten, bis alle asynchronen Promises (fetch & DOM updates) aufgelöst sind
    await flushPromises()

    // Verifizierung des API-Aufrufs an das Backend
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/weather/places/search?query=Ber')
    )

    // Verifizierung der UI-Aktualisierung
    expect(wrapper.text()).toContain('Berlin')

    // Timer für nachfolgende Tests zurücksetzen
    vi.useRealTimers()
  })
})
