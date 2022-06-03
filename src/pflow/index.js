/**
 * Load Petri-net declaration as an executable model.
 * @param collection - name of collection
 * @param schema - name of this model
 * @param modelDef - function making use of DSL or pre-indexed model
 */
import {Model} from './Model';

export function domodel(collection, schema, modelDef) {
  if (!pflowModels[collection]) {
    pflowModels[collection] = {};
  }
  pflowModels[collection][schema] = new Model(schema, modelDef);
  return pflowModels[collection][schema];
}

// REVIEW: refactor thinking of this file as an interface
// when deployed with storage, these functions should be the hooks that let us interact w/ backend
const pflowModels = {};

export function getDeclaration(collection, schema) {
  return pflowModels[collection][schema];
}

export function listCollections(collection) {
  return Object.keys(pflowModels);
}

export function listModels(collection) {
  if (!pflowModels[collection]) {
    return [];
  }
  return Object.keys(pflowModels[collection]).filter(t => t != 'blank')
}

export function renameModel(collection, currentName, newName) {
  pflowModels[collection][newName] = pflowModels[collection][currentName]
  pflowModels[collection][newName].schema = newName
  delete pflowModels[collection][currentName]
}

export function renameCollection(currentName, newName) {
  pflowModels[newName] = pflowModels[currentName]
  delete pflowModels[currentName]
}

export function getStorageJson() {
  const storage = {};
  for (const col in pflowModels) {
    storage[col] = Object.keys(pflowModels[col]).map((schema) =>{
      return pflowModels[col][schema].toIndexedModel();
    });
  }
  return JSON.stringify(storage);
}

const STORAGE_KEY = 'pflow.dev';

export function writeLocalStorage() {
  localStorage.setItem(STORAGE_KEY, getStorageJson());
}

/**
 * Loads model definitions from local storage
 */
export function readLocalStorage() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!!data) {
    const modelStore = JSON.parse(data);
    for (const col in modelStore) {
      if (!pflowModels[col]) {
        pflowModels[col] = {};
      }
      for (const net of modelStore[col]) {
        pflowModels[col][net.schema] = new Model(net.schema, net);
      }
    }
  }
}