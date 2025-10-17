import { test, expect } from '@playwright/test';

test.describe('City Configuration Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'admin@example.com');
    await page.fill('[data-testid="password"]', 'adminpass');
    await page.click('button[type="submit"]');
    
    // Navigate to city configuration
    await page.click('text=Manage Cities');
  });

  test('should create a new city configuration', async ({ page }) => {
    await page.click('text=Add New City');
    
    // Fill in the form
    await page.fill('[name="cityId"]', 'CMB01');
    await page.fill('[name="cityName"]', 'Colombo Central');
    
    // Select waste types
    await page.click('text=Waste Types');
    await page.click('text=general');
    await page.click('text=recyclable');
    
    // Set pricing
    await page.fill('[name="baseRate"]', '1000');
    await page.fill('[name="recyclingCredit"]', '200');
    
    // Add a zone
    await page.fill('[name="newZone"]', 'Zone A');
    await page.click('text=Add Zone');
    
    // Submit the form
    await page.click('text=Create Configuration');
    
    // Verify success
    await expect(page.locator('text=City configuration created successfully')).toBeVisible();
  });

  test('should edit existing configuration', async ({ page }) => {
    await page.click('text=Colombo Central >> button[aria-label="edit"]');
    
    // Update values
    await page.fill('[name="cityName"]', 'Colombo Central Updated');
    await page.fill('[name="baseRate"]', '1200');
    
    // Submit changes
    await page.click('text=Update Configuration');
    
    // Verify success
    await expect(page.locator('text=City configuration updated successfully')).toBeVisible();
  });

  test('should toggle active status', async ({ page }) => {
    const initialStatus = await page.isChecked('text=Colombo Central >> input[type="checkbox"]');
    
    // Toggle status
    await page.click('text=Colombo Central >> input[type="checkbox"]');
    
    // Verify status changed
    await expect(page.locator('text=City configuration status updated successfully')).toBeVisible();
    const newStatus = await page.isChecked('text=Colombo Central >> input[type="checkbox"]');
    expect(newStatus).not.toBe(initialStatus);
  });

  test('should delete configuration', async ({ page }) => {
    // Delete configuration
    await page.click('text=Colombo Central >> button[aria-label="delete"]');
    
    // Confirm deletion
    await page.click('text=OK');
    
    // Verify success
    await expect(page.locator('text=City configuration deleted successfully')).toBeVisible();
    await expect(page.locator('text=Colombo Central')).not.toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.click('text=Add New City');
    
    // Try to submit empty form
    await page.click('text=Create Configuration');
    
    // Verify validation messages
    await expect(page.locator('text=City name is required')).toBeVisible();
    await expect(page.locator('text=City ID is required')).toBeVisible();
    await expect(page.locator('text=At least one waste type is required')).toBeVisible();
    await expect(page.locator('text=At least one zone is required')).toBeVisible();
  });
});