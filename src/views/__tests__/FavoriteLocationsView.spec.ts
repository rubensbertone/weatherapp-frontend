import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import FavoriteLocationsView from '../FavoriteLocationsView.vue'
import { createRouter, createWebHistory } from 'vue-router'

/**
 * Router-Konfiguration für die Tests der Favoritenansicht.
 * Ermöglicht die Navigation innerhalb der Testumgebung.
 */
const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: { template: '<div>Home</div>' } }]
})

/**
 * Testsuite für die FavoriteLocationsView-Komponente.
 * Überprüft das Laden und Darstellen der gespeicherten Wetter-Favoriten eines Nutzers.
 */
describe('FavoriteLocationsView', () => {

  /**
   * Bereitet die Testumgebung vor jedem Testfall vor.
   * Bereinigt Mocks, leert den LocalStorage (um Auth-States zu isolieren)
   * und initialisiert die globale fetch-Funktion als Mock.
   */
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    global.fetch = vi.fn()
  })

  /**
   * @test Test 10
   * @description Validiert die Anzeige der Favoritenliste:
   * 1. Setzt einen fiktiven Authentifizierungs-Token im LocalStorage.
   * 2. Mockt eine erfolgreiche API-Antwort mit einer Liste von zwei Orten (München, Hamburg).
   * 3. Mountet die Komponente und wartet auf den asynchronen Lebenszyklus (onMounted).
   * 4. Verifiziert, dass die Namen der Orte korrekt in der Benutzeroberfläche gerendert werden.
   */
  it('Test 10: Zeigt Liste der Favoriten an', async () => {
    // Authentifizierung simulieren
    localStorage.setItem('token', 'fake-token')

    // Beispieldaten für den API-Mock definieren
    const mockData = [
      { locationName: 'München', country: 'DE', latitude: 48, longitude: 11 },
      { locationName: 'Hamburg', country: 'DE', latitude: 53, longitude: 10 }
    ]

    // Fetch-Mock für den Endpunkt der Favoriten konfigurieren
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockData)
    })

    const wrapper = mount(FavoriteLocationsView, {
      global: { plugins: [router] }
    })

    // Warten auf die Auflösung von onMounted und den internen fetch-Aufruf
    await new Promise(resolve => setTimeout(resolve, 10))
    await wrapper.vm.$nextTick()

    // Überprüfung: Werden die Namen der gemockten Orte im Text der Komponente gefunden?
    expect(wrapper.text()).toContain('München')
    expect(wrapper.text()).toContain('Hamburg')
  })
})
