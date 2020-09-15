/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import {
  parentEntityIDSafeVersion,
  isProcessRunning,
  getAncestryAsArray,
  entityIDSafeVersion,
} from '../../../../../common/endpoint/models/event';
import {
  SafeResolverChildren,
  SafeResolverChildNode,
  SafeResolverEvent,
} from '../../../../../common/endpoint/types';
import { createChild } from './node';
import { ChildrenPaginationBuilder } from './children_pagination';

/**
 * This class helps construct the children structure when building a resolver tree.
 */
export class ChildrenNodesHelper {
  private readonly entityToNodeCache: Map<string, SafeResolverChildNode> = new Map();

  constructor(private readonly rootID: string, private readonly limit: number) {
    this.entityToNodeCache.set(rootID, createChild(rootID));
  }

  /**
   * Constructs a ResolverChildren response based on the children that were previously add.
   */
  getNodes(): SafeResolverChildren {
    const cacheCopy: Map<string, SafeResolverChildNode> = new Map(this.entityToNodeCache);
    const rootNode = cacheCopy.get(this.rootID);
    let rootNextChild = null;

    if (rootNode) {
      rootNextChild = rootNode.nextChild ?? null;
    }

    cacheCopy.delete(this.rootID);
    return {
      childNodes: Array.from(cacheCopy.values()),
      nextChild: rootNextChild,
    };
  }

  /**
   * Get the entity_ids of the nodes that are cached.
   */
  getEntityIDs(): string[] {
    const cacheCopy: Map<string, SafeResolverChildNode> = new Map(this.entityToNodeCache);
    cacheCopy.delete(this.rootID);
    return Array.from(cacheCopy.keys());
  }

  /**
   * Get the number of nodes that have been cached.
   */
  getNumNodes(): number {
    // -1 because the root node is in the cache too
    return this.entityToNodeCache.size - 1;
  }

  /**
   * Add lifecycle events (start, end, etc) to the cache.
   *
   * @param lifecycle an array of resolver lifecycle events for different process nodes returned from ES.
   */
  addLifecycleEvents(lifecycle: SafeResolverEvent[]) {
    for (const event of lifecycle) {
      const entityID = entityIDSafeVersion(event);
      if (entityID) {
        const cachedChild = this.getOrCreateChildNode(entityID);
        cachedChild.lifecycle.push(event);
      }
    }
  }

  /**
   * Add the start events for the nodes received from ES. Pagination cursors will be constructed based on the
   * request limit and results returned.
   *
   * @param queriedNodes the entity_ids of the nodes that returned these start events
   * @param startEvents an array of start events returned by ES
   */
  addStartEvents(
    queriedNodes: Set<string>,
    startEvents: SafeResolverEvent[]
  ): Set<string> | undefined {
    let largestAncestryArray = 0;
    const nodesToQueryNext: Map<number, Set<string>> = new Map();
    const nonLeafNodes: Set<SafeResolverChildNode> = new Set();

    const isDistantGrandchild = (event: SafeResolverEvent) => {
      const ancestry = getAncestryAsArray(event);
      return ancestry.length > 0 && queriedNodes.has(ancestry[ancestry.length - 1]);
    };

    for (const event of startEvents) {
      const parentID = parentEntityIDSafeVersion(event);
      const entityID = entityIDSafeVersion(event);
      if (parentID && entityID && isProcessRunning(event)) {
        // don't actually add the start event to the node, because that'll be done in
        // a different call
        const childNode = this.getOrCreateChildNode(entityID);

        const ancestry = getAncestryAsArray(event);
        // This is to handle the following unlikely but possible scenario:
        // if an alert was generated by the kernel process (parent process of all other processes) then
        // the direct children of that process would only have an ancestry array of [parent_kernel], a single value in the array.
        // The children of those children would have two values in their array [direct parent, parent_kernel]
        // we need to determine which nodes are the most distant grandchildren of the queriedNodes because those should
        // be used for the next query if more nodes should be retrieved. To generally determine the most distant grandchildren
        // we can use the last entry in the ancestry array because of its ordering. The problem with that is in the scenario above
        // the direct children of parent_kernel will also meet that criteria even though they are not actually the most
        // distant grandchildren. To get around that issue we'll bucket all the nodes by the size of their ancestry array
        // and then only return the nodes in the largest bucket because those should be the most distant grandchildren
        // from the queried nodes that were passed in.
        if (ancestry.length > largestAncestryArray) {
          largestAncestryArray = ancestry.length;
        }

        // a grandchild must have an array of > 0 and have it's last parent be in the set of previously queried nodes
        // this is one of the furthest descendants from the queried nodes
        if (isDistantGrandchild(event)) {
          let levelOfNodes = nodesToQueryNext.get(ancestry.length);
          if (!levelOfNodes) {
            levelOfNodes = new Set();
            nodesToQueryNext.set(ancestry.length, levelOfNodes);
          }
          levelOfNodes.add(entityID);
        } else {
          nonLeafNodes.add(childNode);
        }
      }
    }

    // we may not have received all the possible nodes so mark pagination for the query nodes
    // we won't know if the non leaf nodes (non query nodes) have additional children so don't mark them
    if (this.limit <= this.getNumNodes()) {
      this.setPaginationForNodes(queriedNodes, startEvents);
      return;
    }

    // the non leaf nodes have received all their children so mark them as finished
    for (const nonLeaf of nonLeafNodes.values()) {
      nonLeaf.nextChild = null;
    }

    // we've received all the descendants of the previously queried node that we can get using it's ancestry array
    // so mark those nodes as complete
    for (const nodeEntityID of queriedNodes.values()) {
      const node = this.entityToNodeCache.get(nodeEntityID);
      if (node) {
        node.nextChild = null;
      }
    }
    return nodesToQueryNext.get(largestAncestryArray);
  }

  private setPaginationForNodes(nodes: Set<string>, startEvents: SafeResolverEvent[]) {
    for (const nodeEntityID of nodes.values()) {
      const cachedNode = this.entityToNodeCache.get(nodeEntityID);
      if (cachedNode) {
        cachedNode.nextChild = ChildrenPaginationBuilder.buildCursor(startEvents);
      }
    }
  }

  private getOrCreateChildNode(entityID: string) {
    let cachedChild = this.entityToNodeCache.get(entityID);
    if (!cachedChild) {
      cachedChild = createChild(entityID);
      this.entityToNodeCache.set(entityID, cachedChild);
    }
    return cachedChild;
  }
}
