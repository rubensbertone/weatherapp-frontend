import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import RegisterView from '../RegisterView.vue'
import { createRouter, createWebHistory } from 'vue-router'

/**
 * Router-Konfiguration für die Registrierungs-Tests.
 * Ermöglicht die Simulation der Navigation zur Login-Seite nach einer erfolgreichen Registrierung.
 */
const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/login', component: { template: '<div>Login</div>' } }]
})

/**
 * Testsuite für die RegisterView-Komponente.
 * Beinhaltet Tests zur Überprüfung der Formular-Darstellung und des Registrierungs-Ablaufs.
 */
describe('RegisterView', () => {

  /**
   * Bereitet die Testumgebung vor jedem Testfall vor.
   * Bereinigt bestehende Mocks und initialisiert die globale fetch-Funktion als Mock.
   */
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })

  /**
   * @test Test 3
   * @description Verifiziert, dass die Registrierungskomponente korrekt gerendert wird.
   * Es wird geprüft, ob die Hauptüberschrift und der Bestätigungs-Button vorhanden sind.
   */
  it('Test 3: Rendert das Registrierungs-Formular', () => {
    const wrapper = mount(RegisterView, {
      global: { plugins: [router] }
    })
    expect(wrapper.find('h1').text()).toBe('Registrierung')
    expect(wrapper.find('button').text()).toBe('Account erstellen')
  })

  /**
   * @test Test 4
   * @description Überprüft den erfolgreichen Registrierungs-Workflow:
   * 1. Simuliert die Eingabe eines neuen Benutzernamens und Passworts.
   * 2. Triggert das Absenden des Formulars.
   * 3. Mockt eine erfolgreiche Server-Antwort.
   * 4. Bestätigt, dass die entsprechende Erfolgsmeldung im DOM angezeigt wird.
   */
  it('Test 4: Zeigt Erfolgsmeldung nach erfolgreicher Registrierung', async () => {
    // Erstellen eines erfolgreichen Fetch-Mocks
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({})
    })

    const wrapper = mount(RegisterView, {
      global: { plugins: [router] }
    })

    // Benutzerdaten in die Felder eintragen
    await wrapper.find('input[type="text"]').setValue('NewUser')
    await wrapper.find('input[type="password"]').setValue('securePass')

    // Formular-Submit auslösen
    await wrapper.find('form').trigger('submit')

    // Auf Vue DOM-Updates und asynchrone Prozesse warten
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 10))

    // Validierung der Erfolgsmeldung in der Benutzeroberfläche
    expect(wrapper.text()).toContain('Erfolg! Du bist registriert.')
  })
})
