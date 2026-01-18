import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import LoginView from '../LoginView.vue'
import { createRouter, createWebHistory } from 'vue-router'

/**
 * Mock-Router-Konfiguration für die Login-Tests.
 * Ermöglicht die Simulation der Weiterleitung zur Startseite nach erfolgreichem Login.
 */
const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: { template: '<div>Home</div>' } }]
})

/**
 * Testsuite für die LoginView-Komponente.
 * Überprüft die korrekte Darstellung der UI-Elemente sowie die Interaktion mit der Authentifizierungs-Schnittstelle.
 */
describe('LoginView', () => {

  /**
   * Setzt die Mocks vor jedem Testlauf zurück.
   * Initialisiert global.fetch als Mock-Funktion, um echte Netzwerkaufrufe zu verhindern.
   */
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })

  /**
   * @test Test 1
   * @description Prüft den initialen Zustand der Komponente.
   * Stellt sicher, dass die Überschrift, das Benutzername-Feld, das Passwort-Feld
   * und der Login-Button korrekt gerendert werden.
   */
  it('Test 1: Rendert das Login-Formular korrekt', () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.find('h1').text()).toBe('Login')
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    expect(wrapper.find('button').text()).toBe('Einloggen')
  })

  /**
   * @test Test 2
   * @description Validiert den Login-Prozess:
   * 1. Simuliert die Eingabe von Benutzername und Passwort.
   * 2. Triggert das Submit-Event des Formulars.
   * 3. Verifiziert, dass ein POST-Request an den korrekten Endpunkt (/login) gesendet wurde.
   */
  it('Test 2: Führt einen Login-Request durch bei Formular-Submit', async () => {
    // Vorbereiten des erfolgreichen API-Antwort-Mocks
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ username: 'TestUser' })
    })
    global.fetch = mockFetch

    const wrapper = mount(LoginView, {
      global: {
        plugins: [router]
      }
    })

    // Eingabefelder befüllen
    await wrapper.find('input[type="text"]').setValue('TestUser')
    await wrapper.find('input[type="password"]').setValue('password123')

    // Formular absenden
    await wrapper.find('form').trigger('submit')

    // Überprüfung: Wurde fetch mit dem richtigen Pfad und der POST-Methode aufgerufen?
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/login'),
      expect.objectContaining({
        method: 'POST'
      })
    )
  })
})
