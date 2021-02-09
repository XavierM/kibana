/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import expect from '@kbn/expect';
import { FtrProviderContext } from '../../ftr_provider_context';

export default function ({ getPageObjects, getService }: FtrProviderContext) {
  const PageObjects = getPageObjects(['common', 'dashboard', 'visualize', 'lens']);

  const find = getService('find');
  const esArchiver = getService('esArchiver');
  const dashboardPanelActions = getService('dashboardPanelActions');
  const dashboardVisualizations = getService('dashboardVisualizations');

  describe('dashboard lens by value', function () {
    before(async () => {
      await esArchiver.loadIfNeeded('logstash_functional');
      await esArchiver.loadIfNeeded('lens/basic');
      await PageObjects.common.navigateToApp('dashboard');
      await PageObjects.dashboard.preserveCrossAppState();
      await PageObjects.dashboard.clickNewDashboard();
    });

    it('can add a lens panel by value', async () => {
      await dashboardVisualizations.ensureNewVisualizationDialogIsShowing();
      await PageObjects.lens.createAndAddLensFromDashboard({});
      const newPanelCount = await PageObjects.dashboard.getPanelCount();
      expect(newPanelCount).to.eql(1);
    });

    it('edits to a by value lens panel are properly applied', async () => {
      await PageObjects.dashboard.waitForRenderComplete();
      await dashboardPanelActions.openContextMenu();
      await dashboardPanelActions.clickEdit();
      await PageObjects.lens.switchToVisualization('donut');
      await PageObjects.lens.saveAndReturn();
      await PageObjects.dashboard.waitForRenderComplete();

      const pieExists = await find.existsByCssSelector('.lnsPieExpression__container');
      expect(pieExists).to.be(true);
    });

    it('editing and saving a lens by value panel retains number of panels', async () => {
      const originalPanelCount = await PageObjects.dashboard.getPanelCount();
      await PageObjects.dashboard.waitForRenderComplete();
      await dashboardPanelActions.openContextMenu();
      await dashboardPanelActions.clickEdit();
      await PageObjects.lens.switchToVisualization('treemap');
      await PageObjects.lens.saveAndReturn();
      await PageObjects.dashboard.waitForRenderComplete();
      const newPanelCount = await PageObjects.dashboard.getPanelCount();
      expect(newPanelCount).to.eql(originalPanelCount);
    });

    it('updates panel on dashboard when a by value panel is saved to library', async () => {
      const newTitle = 'look out library, here I come!';
      const originalPanelCount = await PageObjects.dashboard.getPanelCount();
      await PageObjects.dashboard.waitForRenderComplete();
      await dashboardPanelActions.openContextMenu();
      await dashboardPanelActions.clickEdit();
      await PageObjects.lens.save(newTitle, false, true);
      await PageObjects.dashboard.waitForRenderComplete();
      const newPanelCount = await PageObjects.dashboard.getPanelCount();
      expect(newPanelCount).to.eql(originalPanelCount);
      const titles = await PageObjects.dashboard.getPanelTitles();
      expect(titles.indexOf(newTitle)).to.not.be(-1);
    });
  });
}
