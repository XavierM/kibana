"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const saved_objects_table_test_mocks_1 = require("./saved_objects_table.test.mocks");
const react_1 = tslib_1.__importDefault(require("react"));
const eui_1 = require("@elastic/eui");
const enzyme_helpers_1 = require("test_utils/enzyme_helpers");
const mocks_1 = require("../../../../../core/public/mocks");
const mocks_2 = require("../../../../data/public/mocks");
const service_registry_mock_1 = require("../../services/service_registry.mock");
const action_service_mock_1 = require("../../services/action_service.mock");
const saved_objects_table_1 = require("./saved_objects_table");
const components_1 = require("./components");
const allowedTypes = ['index-pattern', 'visualization', 'dashboard', 'search'];
const allSavedObjects = [
    {
        id: '1',
        type: 'index-pattern',
        attributes: {
            title: `MyIndexPattern*`,
        },
    },
    {
        id: '2',
        type: 'search',
        attributes: {
            title: `MySearch`,
        },
    },
    {
        id: '3',
        type: 'dashboard',
        attributes: {
            title: `MyDashboard`,
        },
    },
    {
        id: '4',
        type: 'visualization',
        attributes: {
            title: `MyViz`,
        },
    },
];
describe('SavedObjectsTable', () => {
    let defaultProps;
    let http;
    let overlays;
    let notifications;
    let savedObjects;
    let search;
    const shallowRender = (overrides = {}) => {
        return enzyme_helpers_1.shallowWithI18nProvider(react_1.default.createElement(saved_objects_table_1.SavedObjectsTable, Object.assign({}, defaultProps, overrides)));
    };
    beforeEach(() => {
        saved_objects_table_test_mocks_1.extractExportDetailsMock.mockReset();
        http = mocks_1.httpServiceMock.createStartContract();
        overlays = mocks_1.overlayServiceMock.createStartContract();
        notifications = mocks_1.notificationServiceMock.createStartContract();
        savedObjects = mocks_1.savedObjectsServiceMock.createStartContract();
        search = mocks_2.dataPluginMock.createStartContract().search;
        const applications = mocks_1.applicationServiceMock.createStartContract();
        applications.capabilities = {
            navLinks: {},
            management: {},
            catalogue: {},
            savedObjectsManagement: {
                read: true,
                edit: false,
                delete: false,
            },
        };
        http.post.mockResolvedValue([]);
        saved_objects_table_test_mocks_1.getSavedObjectCountsMock.mockReturnValue({
            'index-pattern': 0,
            visualization: 0,
            dashboard: 0,
            search: 0,
        });
        defaultProps = {
            allowedTypes,
            serviceRegistry: service_registry_mock_1.serviceRegistryMock.create(),
            actionRegistry: action_service_mock_1.actionServiceMock.createStart(),
            savedObjectsClient: savedObjects.client,
            indexPatterns: mocks_2.dataPluginMock.createStartContract().indexPatterns,
            http,
            overlays,
            notifications,
            applications,
            perPageConfig: 15,
            goInspectObject: () => { },
            canGoInApp: () => true,
            search,
        };
        saved_objects_table_test_mocks_1.findObjectsMock.mockImplementation(() => ({
            total: 4,
            savedObjects: [
                {
                    id: '1',
                    type: 'index-pattern',
                    meta: {
                        title: `MyIndexPattern*`,
                        icon: 'indexPatternApp',
                        editUrl: '#/management/kibana/index_patterns/1',
                        inAppUrl: {
                            path: '/management/kibana/index_patterns/1',
                            uiCapabilitiesPath: 'management.kibana.index_patterns',
                        },
                    },
                },
                {
                    id: '2',
                    type: 'search',
                    meta: {
                        title: `MySearch`,
                        icon: 'search',
                        editUrl: '#/management/kibana/objects/savedSearches/2',
                        inAppUrl: {
                            path: '/discover/2',
                            uiCapabilitiesPath: 'discover.show',
                        },
                    },
                },
                {
                    id: '3',
                    type: 'dashboard',
                    meta: {
                        title: `MyDashboard`,
                        icon: 'dashboardApp',
                        editUrl: '#/management/kibana/objects/savedDashboards/3',
                        inAppUrl: {
                            path: '/dashboard/3',
                            uiCapabilitiesPath: 'dashboard.show',
                        },
                    },
                },
                {
                    id: '4',
                    type: 'visualization',
                    meta: {
                        title: `MyViz`,
                        icon: 'visualizeApp',
                        editUrl: '#/management/kibana/objects/savedVisualizations/4',
                        inAppUrl: {
                            path: '/visualize/edit/4',
                            uiCapabilitiesPath: 'visualize.show',
                        },
                    },
                },
            ],
        }));
    });
    it('should render normally', async () => {
        const component = shallowRender({ perPageConfig: 15 });
        // Ensure all promises resolve
        await new Promise(resolve => process.nextTick(resolve));
        // Ensure the state changes are reflected
        component.update();
        expect(component).toMatchSnapshot();
    });
    it('should add danger toast when find fails', async () => {
        saved_objects_table_test_mocks_1.findObjectsMock.mockImplementation(() => {
            throw new Error('Simulated find error');
        });
        const component = shallowRender({ perPageConfig: 15 });
        // Ensure all promises resolve
        await new Promise(resolve => process.nextTick(resolve));
        // Ensure the state changes are reflected
        component.update();
        expect(notifications.toasts.addDanger).toHaveBeenCalled();
    });
    describe('export', () => {
        it('should export selected objects', async () => {
            const mockSelectedSavedObjects = [
                { id: '1', type: 'index-pattern' },
                { id: '3', type: 'dashboard' },
            ];
            const mockSavedObjects = mockSelectedSavedObjects.map(obj => ({
                _id: obj.id,
                _source: {},
            }));
            const mockSavedObjectsClient = {
                ...defaultProps.savedObjectsClient,
                bulkGet: jest.fn().mockImplementation(() => ({
                    savedObjects: mockSavedObjects,
                })),
            };
            const component = shallowRender({ savedObjectsClient: mockSavedObjectsClient });
            // Ensure all promises resolve
            await new Promise(resolve => process.nextTick(resolve));
            // Ensure the state changes are reflected
            component.update();
            // Set some as selected
            component.instance().onSelectionChanged(mockSelectedSavedObjects);
            await component.instance().onExport(true);
            expect(saved_objects_table_test_mocks_1.fetchExportObjectsMock).toHaveBeenCalledWith(http, mockSelectedSavedObjects, true);
            expect(notifications.toasts.addSuccess).toHaveBeenCalledWith({
                title: 'Your file is downloading in the background',
            });
        });
        it('should display a warning is export contains missing references', async () => {
            const mockSelectedSavedObjects = [
                { id: '1', type: 'index-pattern' },
                { id: '3', type: 'dashboard' },
            ];
            const mockSavedObjects = mockSelectedSavedObjects.map(obj => ({
                _id: obj.id,
                _source: {},
            }));
            const mockSavedObjectsClient = {
                ...defaultProps.savedObjectsClient,
                bulkGet: jest.fn().mockImplementation(() => ({
                    savedObjects: mockSavedObjects,
                })),
            };
            saved_objects_table_test_mocks_1.extractExportDetailsMock.mockImplementation(() => ({
                exportedCount: 2,
                missingRefCount: 1,
                missingReferences: [{ id: '7', type: 'visualisation' }],
            }));
            const component = shallowRender({ savedObjectsClient: mockSavedObjectsClient });
            // Ensure all promises resolve
            await new Promise(resolve => process.nextTick(resolve));
            // Ensure the state changes are reflected
            component.update();
            // Set some as selected
            component.instance().onSelectionChanged(mockSelectedSavedObjects);
            await component.instance().onExport(true);
            expect(saved_objects_table_test_mocks_1.fetchExportObjectsMock).toHaveBeenCalledWith(http, mockSelectedSavedObjects, true);
            expect(notifications.toasts.addWarning).toHaveBeenCalledWith({
                title: 'Your file is downloading in the background. ' +
                    'Some related objects could not be found. ' +
                    'Please see the last line in the exported file for a list of missing objects.',
            });
        });
        it('should allow the user to choose when exporting all', async () => {
            const component = shallowRender();
            // Ensure all promises resolve
            await new Promise(resolve => process.nextTick(resolve));
            // Ensure the state changes are reflected
            component.update();
            component.find('Header').prop('onExportAll')();
            component.update();
            expect(component.find('EuiModal')).toMatchSnapshot();
        });
        it('should export all', async () => {
            const component = shallowRender();
            // Ensure all promises resolve
            await new Promise(resolve => process.nextTick(resolve));
            // Ensure the state changes are reflected
            component.update();
            // Set up mocks
            const blob = new Blob([JSON.stringify(allSavedObjects)], { type: 'application/ndjson' });
            saved_objects_table_test_mocks_1.fetchExportByTypeAndSearchMock.mockImplementation(() => blob);
            await component.instance().onExportAll();
            expect(saved_objects_table_test_mocks_1.fetchExportByTypeAndSearchMock).toHaveBeenCalledWith(http, allowedTypes, undefined, true);
            expect(saved_objects_table_test_mocks_1.saveAsMock).toHaveBeenCalledWith(blob, 'export.ndjson');
            expect(notifications.toasts.addSuccess).toHaveBeenCalledWith({
                title: 'Your file is downloading in the background',
            });
        });
        it('should export all, accounting for the current search criteria', async () => {
            const component = shallowRender();
            component.instance().onQueryChange({
                query: eui_1.Query.parse('test'),
            });
            // Ensure all promises resolve
            await new Promise(resolve => process.nextTick(resolve));
            // Ensure the state changes are reflected
            component.update();
            // Set up mocks
            const blob = new Blob([JSON.stringify(allSavedObjects)], { type: 'application/ndjson' });
            saved_objects_table_test_mocks_1.fetchExportByTypeAndSearchMock.mockImplementation(() => blob);
            await component.instance().onExportAll();
            expect(saved_objects_table_test_mocks_1.fetchExportByTypeAndSearchMock).toHaveBeenCalledWith(http, allowedTypes, 'test*', true);
            expect(saved_objects_table_test_mocks_1.saveAsMock).toHaveBeenCalledWith(blob, 'export.ndjson');
            expect(notifications.toasts.addSuccess).toHaveBeenCalledWith({
                title: 'Your file is downloading in the background',
            });
        });
    });
    describe('import', () => {
        it('should show the flyout', async () => {
            const component = shallowRender();
            // Ensure all promises resolve
            await new Promise(resolve => process.nextTick(resolve));
            // Ensure the state changes are reflected
            component.update();
            component.instance().showImportFlyout();
            component.update();
            expect(component.find(components_1.Flyout)).toMatchSnapshot();
        });
        it('should hide the flyout', async () => {
            const component = shallowRender();
            // Ensure all promises resolve
            await new Promise(resolve => process.nextTick(resolve));
            // Ensure the state changes are reflected
            component.update();
            component.instance().hideImportFlyout();
            component.update();
            expect(component.find(components_1.Flyout).length).toBe(0);
        });
    });
    describe('relationships', () => {
        it('should fetch relationships', async () => {
            const component = shallowRender();
            // Ensure all promises resolve
            await new Promise(resolve => process.nextTick(resolve));
            // Ensure the state changes are reflected
            component.update();
            await component.instance().getRelationships('search', '1');
            const savedObjectTypes = ['index-pattern', 'visualization', 'dashboard', 'search'];
            expect(saved_objects_table_test_mocks_1.getRelationshipsMock).toHaveBeenCalledWith(http, 'search', '1', savedObjectTypes);
        });
        it('should show the flyout', async () => {
            const component = shallowRender();
            // Ensure all promises resolve
            await new Promise(resolve => process.nextTick(resolve));
            // Ensure the state changes are reflected
            component.update();
            component.instance().onShowRelationships({
                id: '2',
                type: 'search',
                meta: {
                    title: `MySearch`,
                    icon: 'search',
                    editUrl: '#/management/kibana/objects/savedSearches/2',
                    inAppUrl: {
                        path: '/discover/2',
                        uiCapabilitiesPath: 'discover.show',
                    },
                },
            });
            component.update();
            expect(component.find(components_1.Relationships)).toMatchSnapshot();
            expect(component.state('relationshipObject')).toEqual({
                id: '2',
                type: 'search',
                meta: {
                    title: 'MySearch',
                    editUrl: '#/management/kibana/objects/savedSearches/2',
                    icon: 'search',
                    inAppUrl: {
                        path: '/discover/2',
                        uiCapabilitiesPath: 'discover.show',
                    },
                },
            });
        });
        it('should hide the flyout', async () => {
            const component = shallowRender();
            // Ensure all promises resolve
            await new Promise(resolve => process.nextTick(resolve));
            // Ensure the state changes are reflected
            component.update();
            component.instance().onHideRelationships();
            component.update();
            expect(component.find(components_1.Relationships).length).toBe(0);
            expect(component.state('relationshipId')).toBe(undefined);
            expect(component.state('relationshipType')).toBe(undefined);
            expect(component.state('relationshipTitle')).toBe(undefined);
        });
    });
    describe('delete', () => {
        it('should show a confirm modal', async () => {
            const component = shallowRender();
            const mockSelectedSavedObjects = [
                { id: '1', type: 'index-pattern' },
                { id: '3', type: 'dashboard' },
            ];
            // Ensure all promises resolve
            await new Promise(resolve => process.nextTick(resolve));
            // Ensure the state changes are reflected
            component.update();
            // Set some as selected
            component.instance().onSelectionChanged(mockSelectedSavedObjects);
            await component.instance().onDelete();
            component.update();
            expect(component.find('EuiConfirmModal')).toMatchSnapshot();
        });
        it('should delete selected objects', async () => {
            const mockSelectedSavedObjects = [
                { id: '1', type: 'index-pattern' },
                { id: '3', type: 'dashboard' },
            ];
            const mockSavedObjects = mockSelectedSavedObjects.map(obj => ({
                id: obj.id,
                type: obj.type,
                source: {},
            }));
            const mockSavedObjectsClient = {
                ...defaultProps.savedObjectsClient,
                bulkGet: jest.fn().mockImplementation(() => ({
                    savedObjects: mockSavedObjects,
                })),
                delete: jest.fn(),
            };
            const component = shallowRender({ savedObjectsClient: mockSavedObjectsClient });
            // Ensure all promises resolve
            await new Promise(resolve => process.nextTick(resolve));
            // Ensure the state changes are reflected
            component.update();
            // Set some as selected
            component.instance().onSelectionChanged(mockSelectedSavedObjects);
            await component.instance().delete();
            expect(defaultProps.indexPatterns.clearCache).toHaveBeenCalled();
            expect(mockSavedObjectsClient.bulkGet).toHaveBeenCalledWith(mockSelectedSavedObjects);
            expect(mockSavedObjectsClient.delete).toHaveBeenCalledWith(mockSavedObjects[0].type, mockSavedObjects[0].id);
            expect(mockSavedObjectsClient.delete).toHaveBeenCalledWith(mockSavedObjects[1].type, mockSavedObjects[1].id);
            expect(component.state('selectedSavedObjects').length).toBe(0);
        });
    });
});
