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
jest.mock('ui/capabilities', () => ({
    capabilities: {
        get: () => ({
            uiCapability1: true,
            uiCapability2: {
                nestedProp: 'nestedValue',
            },
        }),
    },
}));
const enzyme_1 = require("enzyme");
const react_1 = tslib_1.__importDefault(require("react"));
const inject_ui_capabilities_1 = require("./inject_ui_capabilities");
const ui_capabilities_provider_1 = require("./ui_capabilities_provider");
describe('injectUICapabilities', () => {
    it('provides UICapabilities to FCs', () => {
        const MyFC = inject_ui_capabilities_1.injectUICapabilities(({ uiCapabilities }) => {
            return react_1.default.createElement("span", null, uiCapabilities.uiCapability2.nestedProp);
        });
        const wrapper = enzyme_1.mount(react_1.default.createElement(ui_capabilities_provider_1.UICapabilitiesProvider, null,
            react_1.default.createElement(MyFC, null)));
        expect(wrapper).toMatchInlineSnapshot(`
<UICapabilitiesProvider>
  <InjectUICapabilities(Component)>
    <Component
      uiCapabilities={
        Object {
          "uiCapability1": true,
          "uiCapability2": Object {
            "nestedProp": "nestedValue",
          },
        }
      }
    >
      <span>
        nestedValue
      </span>
    </Component>
  </InjectUICapabilities(Component)>
</UICapabilitiesProvider>
`);
    });
    it('provides UICapabilities to class components', () => {
        // eslint-disable-next-line react/prefer-stateless-function
        class MyClassComponent extends react_1.default.Component {
            render() {
                return react_1.default.createElement("span", null, this.props.uiCapabilities.uiCapability2.nestedProp);
            }
        }
        const WrappedComponent = inject_ui_capabilities_1.injectUICapabilities(MyClassComponent);
        const wrapper = enzyme_1.mount(react_1.default.createElement(ui_capabilities_provider_1.UICapabilitiesProvider, null,
            react_1.default.createElement(WrappedComponent, null)));
        expect(wrapper).toMatchInlineSnapshot(`
<UICapabilitiesProvider>
  <InjectUICapabilities(MyClassComponent)>
    <MyClassComponent
      uiCapabilities={
        Object {
          "uiCapability1": true,
          "uiCapability2": Object {
            "nestedProp": "nestedValue",
          },
        }
      }
    >
      <span>
        nestedValue
      </span>
    </MyClassComponent>
  </InjectUICapabilities(MyClassComponent)>
</UICapabilitiesProvider>
`);
    });
});
