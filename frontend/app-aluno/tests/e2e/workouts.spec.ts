import { test, expect, Page } from '@playwright/test'

async function login(page: Page) {
  await page.goto('/login')
  await page.fill('[data-testid="email-input"]', 'aluno@fitness360.com')
  await page.fill('[data-testid="password-input"]', 'senha123')
  await page.click('[data-testid="login-button"]')
  await expect(page).toHaveURL('/dashboard')
}

test.describe('Fluxo de Treinos', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
    await page.goto('/workouts')
  })

  test('deve listar treinos disponíveis', async ({ page }) => {
    await expect(page.locator('[data-testid="workout-card"]')).toHaveCount(3)
    const firstWorkout = page.locator('[data-testid="workout-card"]').first()
    expect(await firstWorkout.textContent()).toContain('Treino A')
  })

  test('deve iniciar um treino', async ({ page }) => {
    await page.click('[data-testid="workout-card"]:first-child [data-testid="start-workout"]')
    await expect(page).toHaveURL(/\/workouts\/\d+\/exercise/)
    expect(await page.textContent('[data-testid="exercise-title"]')).toBeTruthy()
  })

  test('deve completar exercícios do treino', async ({ page }) => {
    // Inicia treino
    await page.click('[data-testid="workout-card"]:first-child [data-testid="start-workout"]')
    
    // Completa primeiro exercício
    await page.click('[data-testid="complete-set"]')
    await page.fill('[data-testid="weight-input"]', '20')
    await page.fill('[data-testid="reps-input"]', '12')
    await page.click('[data-testid="save-progress"]')
    
    // Avança para próximo exercício
    await page.click('[data-testid="next-exercise"]')
    expect(await page.textContent('[data-testid="progress-indicator"]')).toContain('2/')
  })

  test('deve finalizar treino com sucesso', async ({ page }) => {
    // Inicia e completa treino
    await page.click('[data-testid="workout-card"]:first-child [data-testid="start-workout"]')
    await page.click('[data-testid="complete-workout"]')
    
    // Preenche feedback
    await page.selectOption('[data-testid="difficulty-select"]', 'moderate')
    await page.fill('[data-testid="notes-input"]', 'Treino produtivo')
    await page.click('[data-testid="submit-feedback"]')
    
    // Verifica redirecionamento e mensagem
    await expect(page).toHaveURL('/workouts')
    const successMessage = await page.waitForSelector('[data-testid="success-message"]')
    expect(await successMessage.textContent()).toContain('Treino finalizado')
  })
}) 