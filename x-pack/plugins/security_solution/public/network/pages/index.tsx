/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { useMemo } from 'react';
import { Redirect, Route, Switch, RouteComponentProps } from 'react-router-dom';

import { useMlCapabilities } from '../../common/components/ml_popover/hooks/use_ml_capabilities';
import { hasMlUserPermissions } from '../../../common/machine_learning/has_ml_user_permissions';
import { FlowTarget } from '../../graphql/types';

import { IPDetails } from './ip_details';
import { Network } from './network';
import { GlobalTime } from '../../common/containers/global_time';
import { SecurityPageName } from '../../app/types';
import { getNetworkRoutePath } from './navigation';
import { NetworkRouteType } from './navigation/types';

type Props = Partial<RouteComponentProps<{}>> & { url: string };

const networkPagePath = `/:pageName(${SecurityPageName.network})`;
const ipDetailsPageBasePath = `${networkPagePath}/ip/:detailName`;

const NetworkContainerComponent: React.FC<Props> = () => {
  const capabilities = useMlCapabilities();
  const capabilitiesFetched = capabilities.capabilitiesFetched;
  const userHasMlUserPermissions = useMemo(() => hasMlUserPermissions(capabilities), [
    capabilities,
  ]);
  const networkRoutePath = useMemo(
    () => getNetworkRoutePath(networkPagePath, capabilitiesFetched, userHasMlUserPermissions),
    [capabilitiesFetched, userHasMlUserPermissions]
  );

  return (
    <GlobalTime>
      {({ to, from, setQuery, deleteQuery, isInitializing }) => (
        <Switch>
          <Route
            strict
            path={networkRoutePath}
            render={() => (
              <Network
                networkPagePath={networkPagePath}
                to={to}
                from={from}
                setQuery={setQuery}
                deleteQuery={deleteQuery}
                isInitializing={isInitializing}
                capabilitiesFetched={capabilities.capabilitiesFetched}
                hasMlUserPermissions={userHasMlUserPermissions}
              />
            )}
          />
          <Route
            path={`${ipDetailsPageBasePath}/:flowTarget`}
            render={({
              match: {
                params: { detailName, flowTarget },
              },
            }) => (
              <IPDetails
                detailName={detailName}
                flowTarget={flowTarget}
                to={to}
                from={from}
                setQuery={setQuery}
                deleteQuery={deleteQuery}
                isInitializing={isInitializing}
              />
            )}
          />
          <Route
            path={ipDetailsPageBasePath}
            render={({
              location: { search = '' },
              match: {
                params: { detailName },
              },
            }) => (
              <Redirect
                to={`/${SecurityPageName.network}/ip/${detailName}/${FlowTarget.source}${search}`}
              />
            )}
          />
          <Route
            path={`/${SecurityPageName.network}/`}
            render={({ location: { search = '' } }) => (
              <Redirect to={`/${SecurityPageName.network}/${NetworkRouteType.flows}${search}`} />
            )}
          />
        </Switch>
      )}
    </GlobalTime>
  );
};

export const NetworkContainer = React.memo(NetworkContainerComponent);
