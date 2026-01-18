import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import FavoriteButton from '../FavoriteButton.vue'

/**
 * Testsuite für die FavoriteButton-Komponente.
 * Überprüft die Sichtbarkeit des Buttons basierend auf dem Login-Status
 * und die korrekte Kommunikation mit dem Favoriten-Endpunkt des Backends.
 */
describe('FavoriteButton', () => {

  /**
   * Bereitet die Testumgebung vor jedem Testfall vor.
   * Bereinigt Mocks, leert den LocalStorage (um Auth-Zustände zurückzusetzen)
   * und initialisiert die globale fetch-Funktion als Mock.
   */
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    global.fetch = vi.fn()
  })

  /**
   * @test Test 7
   * @description Stellt sicher, dass der Favorisierungs-Button für nicht authentifizierte
   * Nutzer (kein Token im LocalStorage vorhanden) nicht im DOM gerendert wird.
   */
  it('Test 7: Ist NICHT sichtbar, wenn User ausgeloggt ist', () => {
    const wrapper = mount(FavoriteButton, {
      props: { locationName: 'Berlin', country: 'DE' }
    })
    expect(wrapper.find('button').exists()).toBe(false)
  })

  /**
   * @test Test 8
   * @description Überprüft, ob der Button korrekt angezeigt wird, wenn ein
   * gültiger Authentifizierungs-Token im LocalStorage hinterlegt ist.
   */
  it('Test 8: Ist sichtbar, wenn User eingeloggt ist', () => {
    localStorage.setItem('token', 'fake-token')
    const wrapper = mount(FavoriteButton, {
      props: { locationName: 'Berlin', country: 'DE' }
    })
    expect(wrapper.find('button').exists()).toBe(true)
  })

  /**
   * @test Test 9
   * @description Validiert die Integration mit dem Backend:
   * 1. Simuliert einen eingeloggten Nutzer.
   * 2. Triggert den Klick auf den Favoriten-Button.
   * 3. Verifiziert, dass ein POST-Request mit den Standortdaten (Name, Koordinaten)
   * an den Endpunkt /favoriteLocations gesendet wird.
   */
  it('Test 9: Sendet POST Request beim Klicken', async () => {
    localStorage.setItem('token', 'fake-token')
    const mockFetch = vi.fn().mockResolvedValue({ ok: true })
    global.fetch = mockFetch

    const wrapper = mount(FavoriteButton, {
      props: {
        locationName: 'Berlin',
        country: 'DE',
        latitude: 52,
        longitude: 13
      }
    })

    // Klick-Event auf dem Button auslösen
    await wrapper.find('button').trigger('click')

    // Überprüfung: Wurde die API mit POST und dem richtigen Pfad aufgerufen?
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/favoriteLocations'),
      expect.objectContaining({ method: 'POST' })
    )
  })
})
