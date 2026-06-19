/**
 * Live gate: Storybook parity items from FLPATH-4164 (My User Access section).
 * Requires npm run start:onprem:dev — not for CI.
 */
import { HostNavPage } from '../../support/pages/host-nav.page';
import { IamPage } from '../../support/pages/iam.page';

const VIEWPORT = { width: 1440, height: 900 };

describe('Live IAM Storybook parity (Phase 9)', { testTimeout: 240_000 }, () => {
  before(() => {
    cy.viewport(VIEWPORT.width, VIEWPORT.height);
  });

  beforeEach(() => {
    cy.setupLiveConsoleGuard();
  });

  afterEach(() => {
    cy.assertNoDepthConsoleErrors();
  });

  it('parity-users-table-chrome', () => {
    IamPage.visitUsers();
    cy.get('.pf-v6-c-toolbar', { timeout: 60_000 }).should('exist');
    cy.get('.pf-v6-c-pagination').should('exist');
    cy.captureIamScreenshot('03-users');
  });

  it('parity-roles-table-chrome', () => {
    IamPage.visitRoles();
    cy.get('.pf-v6-c-toolbar', { timeout: 60_000 }).should('exist');
    cy.get('.pf-v6-c-toolbar').find('input, button').should('have.length.at.least', 1);
    cy.contains('button, a', /Create role/i).should('be.visible');
    cy.get('body').then($body => {
      if ($body.find('.pf-v6-c-pagination').length > 0) {
        cy.get('.pf-v6-c-pagination').should('exist');
      }
    });
    cy.captureIamScreenshot('04-roles');
  });

  it('parity-groups-table-chrome', () => {
    IamPage.visitGroups();
    cy.get('.pf-v6-c-toolbar', { timeout: 60_000 }).should('exist');
    cy.contains('button, a', /Create group/i).should('be.visible');
    cy.get('body').then($body => {
      if ($body.find('.pf-v6-c-pagination').length > 0) {
        cy.get('.pf-v6-c-pagination').should('exist');
      }
    });
    cy.captureIamScreenshot('05-groups');
  });

  it('parity-overview', () => {
    HostNavPage.visitCostOverview();
    HostNavPage.clickIamNav('Overview');
    cy.contains('h1', /User Access/i, { timeout: 90_000 }).should('be.visible');
    cy.get('img.rbac-overview-icon', { timeout: 30_000 })
      .should('be.visible')
      .and(($img) => {
        expect($img[0].naturalWidth, 'overview iam.svg loaded').to.be.greaterThan(0);
      });
    cy.captureIamScreenshot('01-overview');
  });

  it('parity-mua-bundle-cards', () => {
    IamPage.visitMyUserAccess();
    cy.get('[data-testid="entitle-section"]', { timeout: 60_000 }).should('be.visible');
    cy.get('.pf-v6-u-display-none-on-lg').should('not.be.visible');
    cy.get('[data-testid="entitle-section"]').within(() => {
      cy.contains(/OpenShift/i).should('be.visible');
      cy.contains(/Settings and User Access/i).should('be.visible');
      cy.contains(/Red Hat Enterprise Linux/i).should('not.exist');
      cy.contains(/Ansible Automation Platform/i).should('not.exist');
    });
    cy.captureIamScreenshot('02-mua');
  });
});
