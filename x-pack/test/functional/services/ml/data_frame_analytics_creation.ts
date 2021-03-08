/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import expect from '@kbn/expect';
import { DataFrameAnalyticsConfig } from '../../../../plugins/ml/public/application/data_frame_analytics/common';

import { FtrProviderContext } from '../../ftr_provider_context';
import { MlCommonUI } from './common_ui';
import { MlApi } from './api';
import {
  isRegressionAnalysis,
  isClassificationAnalysis,
} from '../../../../plugins/ml/common/util/analytics_utils';

export function MachineLearningDataFrameAnalyticsCreationProvider(
  { getService }: FtrProviderContext,
  mlCommonUI: MlCommonUI,
  mlApi: MlApi
) {
  const testSubjects = getService('testSubjects');
  const comboBox = getService('comboBox');
  const retry = getService('retry');

  return {
    async assertJobTypeSelectExists() {
      await testSubjects.existOrFail('mlAnalyticsCreateJobWizardJobTypeSelect');
    },

    async assertJobTypeSelection(jobTypeAttribute: string) {
      await retry.tryForTime(5000, async () => {
        await testSubjects.existOrFail(`${jobTypeAttribute} selectedJobType`);
      });
    },

    async selectJobType(jobType: string) {
      const jobTypeAttribute = `mlAnalyticsCreation-${jobType}-option`;
      await testSubjects.click(jobTypeAttribute);
      await this.assertJobTypeSelection(jobTypeAttribute);
    },

    async assertAdvancedEditorSwitchExists() {
      await testSubjects.existOrFail(`mlAnalyticsCreateJobWizardAdvancedEditorSwitch`, {
        allowHidden: true,
      });
    },

    async assertAdvancedEditorSwitchCheckState(expectedCheckState: boolean) {
      const actualCheckState =
        (await testSubjects.getAttribute(
          'mlAnalyticsCreateJobWizardAdvancedEditorSwitch',
          'aria-checked'
        )) === 'true';
      expect(actualCheckState).to.eql(
        expectedCheckState,
        `Advanced editor switch check state should be '${expectedCheckState}' (got '${actualCheckState}')`
      );
    },

    async assertJobIdInputExists() {
      await testSubjects.existOrFail('mlAnalyticsCreateJobFlyoutJobIdInput');
    },

    async assertJobDescriptionInputExists() {
      await testSubjects.existOrFail('mlDFAnalyticsJobCreationJobDescription');
    },

    async assertJobIdValue(expectedValue: string) {
      const actualJobId = await testSubjects.getAttribute(
        'mlAnalyticsCreateJobFlyoutJobIdInput',
        'value'
      );
      expect(actualJobId).to.eql(
        expectedValue,
        `Job id should be '${expectedValue}' (got '${actualJobId}')`
      );
    },

    async assertJobDescriptionValue(expectedValue: string) {
      const actualJobDescription = await testSubjects.getAttribute(
        'mlDFAnalyticsJobCreationJobDescription',
        'value'
      );
      expect(actualJobDescription).to.eql(
        expectedValue,
        `Job description should be '${expectedValue}' (got '${actualJobDescription}')`
      );
    },

    async setJobId(jobId: string) {
      await mlCommonUI.setValueWithChecks('mlAnalyticsCreateJobFlyoutJobIdInput', jobId, {
        clearWithKeyboard: true,
      });
      await this.assertJobIdValue(jobId);
    },

    async setJobDescription(jobDescription: string) {
      await mlCommonUI.setValueWithChecks(
        'mlDFAnalyticsJobCreationJobDescription',
        jobDescription,
        {
          clearWithKeyboard: true,
        }
      );
      await this.assertJobDescriptionValue(jobDescription);
    },

    async assertSourceDataPreviewExists() {
      await testSubjects.existOrFail('mlAnalyticsCreationDataGrid loaded', { timeout: 5000 });
    },

    async assertIndexPreviewHistogramChartButtonExists() {
      await testSubjects.existOrFail('mlAnalyticsCreationDataGridHistogramButton');
    },

    async enableSourceDataPreviewHistogramCharts(expectedDefaultButtonState: boolean) {
      await this.assertSourceDataPreviewHistogramChartButtonCheckState(expectedDefaultButtonState);
      if (expectedDefaultButtonState === false) {
        await testSubjects.click('mlAnalyticsCreationDataGridHistogramButton');
        await this.assertSourceDataPreviewHistogramChartButtonCheckState(true);
      }
    },

    async assertSourceDataPreviewHistogramChartButtonCheckState(expectedCheckState: boolean) {
      const actualCheckState =
        (await testSubjects.getAttribute(
          'mlAnalyticsCreationDataGridHistogramButton',
          'aria-pressed'
        )) === 'true';
      expect(actualCheckState).to.eql(
        expectedCheckState,
        `Chart histogram button check state should be '${expectedCheckState}' (got '${actualCheckState}')`
      );
    },

    async assertSourceDataPreviewHistogramCharts(
      expectedHistogramCharts: Array<{ chartAvailable: boolean; id: string; legend: string }>
    ) {
      // For each chart, get the content of each header cell and assert
      // the legend text and column id and if the chart should be present or not.
      await retry.tryForTime(5000, async () => {
        for (const [index, expected] of expectedHistogramCharts.entries()) {
          await testSubjects.existOrFail(`mlDataGridChart-${index}`);

          if (expected.chartAvailable) {
            await testSubjects.existOrFail(`mlDataGridChart-${index}-histogram`);
          } else {
            await testSubjects.missingOrFail(`mlDataGridChart-${index}-histogram`);
          }

          const actualLegend = await testSubjects.getVisibleText(`mlDataGridChart-${index}-legend`);
          expect(actualLegend).to.eql(
            expected.legend,
            `Legend text for column '${index}' should be '${expected.legend}' (got '${actualLegend}')`
          );

          const actualId = await testSubjects.getVisibleText(`mlDataGridChart-${index}-id`);
          expect(actualId).to.eql(
            expected.id,
            `Id text for column '${index}' should be '${expected.id}' (got '${actualId}')`
          );
        }
      });
    },

    async assertIncludeFieldsSelectionExists() {
      await testSubjects.existOrFail('mlAnalyticsCreateJobWizardIncludesTable', { timeout: 8000 });

      await retry.tryForTime(8000, async () => {
        await testSubjects.existOrFail('mlAnalyticsCreateJobWizardIncludesSelect');
      });
    },

    // async assertIncludedFieldsSelection(expectedSelection: string[]) {
    //   const includesTable = await testSubjects.find('mlAnalyticsCreateJobWizardIncludesSelect');
    //   const actualSelection = await includesTable.findByClassName('euiTableRow-isSelected');

    //   expect(actualSelection).to.eql(
    //     expectedSelection,
    //     `Included fields should be '${expectedSelection}' (got '${actualSelection}')`
    //   );
    // },

    async assertDestIndexInputExists() {
      await retry.tryForTime(4000, async () => {
        await testSubjects.existOrFail('mlAnalyticsCreateJobFlyoutDestinationIndexInput');
      });
    },

    async assertDestIndexValue(expectedValue: string) {
      const actualDestIndex = await testSubjects.getAttribute(
        'mlAnalyticsCreateJobFlyoutDestinationIndexInput',
        'value'
      );
      expect(actualDestIndex).to.eql(
        expectedValue,
        `Destination index should be '${expectedValue}' (got '${actualDestIndex}')`
      );
    },

    async setDestIndex(destIndex: string) {
      await mlCommonUI.setValueWithChecks(
        'mlAnalyticsCreateJobFlyoutDestinationIndexInput',
        destIndex,
        {
          clearWithKeyboard: true,
        }
      );
      await this.assertDestIndexValue(destIndex);
    },

    async waitForDependentVariableInputLoaded() {
      await testSubjects.existOrFail('~mlAnalyticsCreateJobWizardDependentVariableSelect', {
        timeout: 5 * 1000,
      });
      await testSubjects.existOrFail('mlAnalyticsCreateJobWizardDependentVariableSelect loaded', {
        timeout: 30 * 1000,
      });
    },

    async assertDependentVariableInputExists() {
      await retry.tryForTime(8000, async () => {
        await testSubjects.existOrFail(
          '~mlAnalyticsCreateJobWizardDependentVariableSelect > comboBoxInput'
        );
      });
    },

    async assertDependentVariableInputMissing() {
      await testSubjects.missingOrFail(
        '~mlAnalyticsCreateJobWizardDependentVariableSelect > comboBoxInput'
      );
    },

    async assertDependentVariableSelection(expectedSelection: string[]) {
      await this.waitForDependentVariableInputLoaded();
      const actualSelection = await comboBox.getComboBoxSelectedOptions(
        '~mlAnalyticsCreateJobWizardDependentVariableSelect > comboBoxInput'
      );
      expect(actualSelection).to.eql(
        expectedSelection,
        `Dependent variable should be '${expectedSelection}' (got '${actualSelection}')`
      );
    },

    async selectDependentVariable(dependentVariable: string) {
      await this.waitForDependentVariableInputLoaded();
      await comboBox.set(
        '~mlAnalyticsCreateJobWizardDependentVariableSelect > comboBoxInput',
        dependentVariable
      );
      await this.assertDependentVariableSelection([dependentVariable]);
    },

    async assertTrainingPercentInputExists() {
      await testSubjects.existOrFail('mlAnalyticsCreateJobWizardTrainingPercentSlider');
    },

    async assertTrainingPercentInputMissing() {
      await testSubjects.missingOrFail('mlAnalyticsCreateJobWizardTrainingPercentSlider');
    },

    async assertTrainingPercentValue(expectedValue: string) {
      const actualTrainingPercent = await testSubjects.getAttribute(
        'mlAnalyticsCreateJobWizardTrainingPercentSlider',
        'value'
      );
      expect(actualTrainingPercent).to.eql(
        expectedValue,
        `Training percent should be '${expectedValue}' (got '${actualTrainingPercent}')`
      );
    },

    async setTrainingPercent(trainingPercent: number) {
      await mlCommonUI.setSliderValue(
        'mlAnalyticsCreateJobWizardTrainingPercentSlider',
        trainingPercent
      );
    },

    async assertConfigurationStepActive() {
      await testSubjects.existOrFail('mlAnalyticsCreateJobWizardConfigurationStep active');
    },

    async assertAdditionalOptionsStepActive() {
      await testSubjects.existOrFail('mlAnalyticsCreateJobWizardAdvancedStep active');
    },

    async assertDetailsStepActive() {
      await testSubjects.existOrFail('mlAnalyticsCreateJobWizardDetailsStep active');
    },

    async assertCreateStepActive() {
      await testSubjects.existOrFail('mlAnalyticsCreateJobWizardCreateStep active');
    },

    async assertValidationStepActive() {
      await testSubjects.existOrFail('mlAnalyticsCreateJobWizardValidationStepWrapper active');
    },

    async continueToAdditionalOptionsStep() {
      await retry.tryForTime(5000, async () => {
        await testSubjects.clickWhenNotDisabled('mlAnalyticsCreateJobWizardContinueButton');
        await this.assertAdditionalOptionsStepActive();
      });
    },

    async continueToDetailsStep() {
      await retry.tryForTime(5000, async () => {
        await testSubjects.clickWhenNotDisabled('mlAnalyticsCreateJobWizardContinueButton');
        await this.assertDetailsStepActive();
      });
    },

    async continueToValidationStep() {
      await retry.tryForTime(5000, async () => {
        await testSubjects.clickWhenNotDisabled('mlAnalyticsCreateJobWizardContinueButton');
        await this.assertValidationStepActive();
      });
    },

    async assertValidationCalloutsExists() {
      await retry.tryForTime(4000, async () => {
        await testSubjects.existOrFail('mlValidationCallout');
      });
    },

    async assertAllValidationCalloutsPresent(expectedNumCallouts: number) {
      const validationCallouts = await testSubjects.findAll('mlValidationCallout');
      expect(validationCallouts.length).to.eql(expectedNumCallouts);
    },

    async continueToCreateStep() {
      await retry.tryForTime(5000, async () => {
        await testSubjects.clickWhenNotDisabled('mlAnalyticsCreateJobWizardContinueButton');
        await this.assertCreateStepActive();
      });
    },

    async assertModelMemoryInputExists() {
      await testSubjects.existOrFail('mlAnalyticsCreateJobWizardModelMemoryInput');
    },

    async assertModelMemoryValue(expectedValue: string) {
      const actualModelMemory = await testSubjects.getAttribute(
        'mlAnalyticsCreateJobWizardModelMemoryInput',
        'value'
      );
      expect(actualModelMemory).to.eql(
        expectedValue,
        `Model memory limit should be '${expectedValue}' (got '${actualModelMemory}')`
      );
    },

    async assertModelMemoryInputPopulated() {
      const actualModelMemory = await testSubjects.getAttribute(
        'mlAnalyticsCreateJobWizardModelMemoryInput',
        'value'
      );

      expect(actualModelMemory).not.to.be('');
    },

    async assertPredictionFieldNameValue(expectedValue: string) {
      const actualPredictedFieldName = await testSubjects.getAttribute(
        'mlAnalyticsCreateJobWizardPredictionFieldNameInput',
        'value'
      );
      expect(actualPredictedFieldName).to.eql(
        expectedValue,
        `Prediction field name should be '${expectedValue}' (got '${actualPredictedFieldName}')`
      );
    },

    async setModelMemory(modelMemory: string) {
      await retry.tryForTime(15 * 1000, async () => {
        await mlCommonUI.setValueWithChecks(
          'mlAnalyticsCreateJobWizardModelMemoryInput',
          modelMemory,
          {
            clearWithKeyboard: true,
          }
        );
        await this.assertModelMemoryValue(modelMemory);
      });
    },

    async assertCreateIndexPatternSwitchExists() {
      await testSubjects.existOrFail(`mlAnalyticsCreateJobWizardCreateIndexPatternSwitch`, {
        allowHidden: true,
      });
    },

    async getCreateIndexPatternSwitchCheckState(): Promise<boolean> {
      const state = await testSubjects.getAttribute(
        'mlAnalyticsCreateJobWizardCreateIndexPatternSwitch',
        'aria-checked'
      );
      return state === 'true';
    },

    async assertCreateIndexPatternSwitchCheckState(expectedCheckState: boolean) {
      const actualCheckState = await this.getCreateIndexPatternSwitchCheckState();
      expect(actualCheckState).to.eql(
        expectedCheckState,
        `Create index pattern switch check state should be '${expectedCheckState}' (got '${actualCheckState}')`
      );
    },

    async getDestIndexSameAsIdSwitchCheckState(): Promise<boolean> {
      const state = await testSubjects.getAttribute(
        'mlAnalyticsCreateJobWizardDestIndexSameAsIdSwitch',
        'aria-checked'
      );
      return state === 'true';
    },

    async assertDestIndexSameAsIdCheckState(expectedCheckState: boolean) {
      const actualCheckState = await this.getDestIndexSameAsIdSwitchCheckState();
      expect(actualCheckState).to.eql(
        expectedCheckState,
        `Destination index same as job id check state should be '${expectedCheckState}' (got '${actualCheckState}')`
      );
    },

    async assertDestIndexSameAsIdSwitchExists() {
      await testSubjects.existOrFail(`mlAnalyticsCreateJobWizardDestIndexSameAsIdSwitch`, {
        allowHidden: true,
      });
    },

    async setDestIndexSameAsIdCheckState(checkState: boolean) {
      if ((await this.getDestIndexSameAsIdSwitchCheckState()) !== checkState) {
        await testSubjects.click('mlAnalyticsCreateJobWizardDestIndexSameAsIdSwitch');
      }
      await this.assertDestIndexSameAsIdCheckState(checkState);
    },

    async setCreateIndexPatternSwitchState(checkState: boolean) {
      if ((await this.getCreateIndexPatternSwitchCheckState()) !== checkState) {
        await testSubjects.click('mlAnalyticsCreateJobWizardCreateIndexPatternSwitch');
      }
      await this.assertCreateIndexPatternSwitchCheckState(checkState);
    },

    async assertStartJobCheckboxExists() {
      await testSubjects.existOrFail('mlAnalyticsCreateJobWizardStartJobCheckbox');
    },

    async assertStartJobCheckboxCheckState(expectedCheckState: boolean) {
      const actualCheckState =
        (await testSubjects.getAttribute(
          'mlAnalyticsCreateJobWizardStartJobCheckbox',
          'checked'
        )) === 'true';
      expect(actualCheckState).to.eql(
        expectedCheckState,
        `Start job check state should be ${expectedCheckState} (got ${actualCheckState})`
      );
    },

    async assertCreateButtonExists() {
      await testSubjects.existOrFail('mlAnalyticsCreateJobWizardCreateButton');
    },

    async isCreateButtonDisabled() {
      const isEnabled = await testSubjects.isEnabled('mlAnalyticsCreateJobWizardCreateButton');
      return !isEnabled;
    },

    async createAnalyticsJob(analyticsId: string) {
      await testSubjects.click('mlAnalyticsCreateJobWizardCreateButton');
      await retry.tryForTime(5000, async () => {
        await this.assertBackToManagementCardExists();
      });
      await mlApi.waitForDataFrameAnalyticsJobToExist(analyticsId);
    },

    async assertBackToManagementCardExists() {
      await testSubjects.existOrFail('analyticsWizardCardManagement');
    },

    async getHeaderText() {
      return await testSubjects.getVisibleText('mlDataFrameAnalyticsWizardHeaderTitle');
    },

    async assertInitialCloneJobConfigStep(job: DataFrameAnalyticsConfig) {
      const jobType = Object.keys(job.analysis)[0];
      const jobTypeAttribute = `mlAnalyticsCreation-${jobType}-option`;
      await this.assertJobTypeSelection(jobTypeAttribute);
      if (isClassificationAnalysis(job.analysis) || isRegressionAnalysis(job.analysis)) {
        await this.assertDependentVariableSelection([job.analysis[jobType].dependent_variable]);
        await this.assertTrainingPercentValue(String(job.analysis[jobType].training_percent));
      }
      await this.assertSourceDataPreviewExists();
      await this.assertIncludeFieldsSelectionExists();
      // await this.assertIncludedFieldsSelection(job.analyzed_fields.includes);
    },

    async assertInitialCloneJobAdditionalOptionsStep(
      analysis: DataFrameAnalyticsConfig['analysis']
    ) {
      const jobType = Object.keys(analysis)[0];
      if (isClassificationAnalysis(analysis) || isRegressionAnalysis(analysis)) {
        // @ts-ignore
        await this.assertPredictionFieldNameValue(analysis[jobType].prediction_field_name);
      }
    },

    async assertInitialCloneJobDetailsStep(job: DataFrameAnalyticsConfig) {
      await this.assertJobIdValue(''); // id should be empty
      await this.assertJobDescriptionValue(String(job.description));
      await this.assertDestIndexValue(''); // destination index should be empty
    },

    async assertCreationCalloutMessagesExist() {
      await testSubjects.existOrFail('analyticsWizardCreationCallout_0');
      await testSubjects.existOrFail('analyticsWizardCreationCallout_1');
      await testSubjects.existOrFail('analyticsWizardCreationCallout_2');
    },

    async navigateToJobManagementPage() {
      await retry.tryForTime(5000, async () => {
        await this.assertCreationCalloutMessagesExist();
      });
      await testSubjects.click('analyticsWizardCardManagement');
      await testSubjects.existOrFail('mlPageDataFrameAnalytics');
    },
  };
}
