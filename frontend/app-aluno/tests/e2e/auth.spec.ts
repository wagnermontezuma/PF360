import { test, expect } from '@playwright/test'

test.describe('Fluxo de Autenticação', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('deve exibir erro com credenciais inválidas', async ({ page }) => {
    await page.fill('[data-testid="email-input"]', 'usuario@invalido.com')
    await page.fill('[data-testid="password-input"]', 'senha123')
    await page.click('[data-testid="login-button"]')
    
    const errorMessage = await page.waitForSelector('[data-testid="error-message"]')
    expect(await errorMessage.textContent()).toContain('Credenciais inválidas')
  })

  test('deve fazer login com sucesso', async ({ page }) => {
    await page.fill('[data-testid="email-input"]', 'aluno@fitness360.com')
    await page.fill('[data-testid="password-input"]', 'senha123')
    await page.click('[data-testid="login-button"]')
    
    await expect(page).toHaveURL('/dashboard')
    expect(await page.textContent('[data-testid="welcome-message"]')).toContain('Bem-vindo')
  })

  test('deve fazer logout corretamente', async ({ page }) => {
    // Login primeiro
    await page.fill('[data-testid="email-input"]', 'aluno@fitness360.com')
    await page.fill('[data-testid="password-input"]', 'senha123')
    await page.click('[data-testid="login-button"]')
    
    // Logout
    await page.click('[data-testid="user-menu"]')
    await page.click('[data-testid="logout-button"]')
    
    await expect(page).toHaveURL('/login')
  })
}) 