import { apiStatus, apiError } from '../../../lib/util';
import { Router } from 'express';
import { multiStoreConfig } from '../../../platform/magento2/util'
const Magento2Client = require('magento2-rest-client').Magento2Client

module.exports = ({ config, db }) => {
  let mcApi = Router();

  mcApi.post('/add', (req, res) => {
    const client = Magento2Client(multiStoreConfig(config.magento2.api, req));

    /** 
     * Needed payload
     * @param {string} sku - Product's sku
     */

     /** 
     * Needed query
     * @param {string} token - Logged in user's token
     */

    if (!req.query.token) {
      apiError(res, 'You must be logged in')
    }


    if (!req.body.sku) {
      apiError(res, 'Provide SKU')
    }

    client.addMethods('wishlist', (restClient) => {
      var module = {};

      module.add = function () {
        return restClient.post('/wishlist/add', req.body, req.query.token);
      }
      return module;
    })

    client.wishlist.add().then((result) => {
      apiStatus(res, result, 200)
    }).catch(err => {
      apiError(res, err)
    })
  })

  mcApi.delete('/remove/:itemId', (req, res) => {
    const client = Magento2Client(multiStoreConfig(config.magento2.api, req));

    /** 
     * Needed params
     * @param {Number} itemId - Product's sku
     * Needed queries
     * @param {string} token - Logged in user's token
     */

    if (!req.params.itemId) {
      apiError(res, 'Provide itemId')
    }

    if (!req.query.token) {
      apiError(res, 'You must be logged in')
    }

    client.addMethods('wishlist', (restClient) => {
      var module = {};

      module.remove = function () {
        return restClient.delete(`/wishlist/remove/${req.params.itemId}`, req.query.token);
      }
      return module;
    })

    client.wishlist.remove().then((result) => {
      apiStatus(res, result, 200)
    }).catch(err => {
      apiError(res, err)
    })
  })

  mcApi.get('/', (req, res) => {
    const client = Magento2Client(multiStoreConfig(config.magento2.api, req));

    /** 
     * Needed payload
     * @param {string} token - Logged in user's token
     */

    if (!req.query.token) {
      apiError(res, 'You must be logged in')
    }

    client.addMethods('wishlist', (restClient) => {
      var module = {};

      module.get = function () {
        return restClient.get('/wishlist', req.query.token);
      }
      return module;
    })

    client.wishlist.get().then((result) => {
      apiStatus(res, result, 200)
    }).catch(err => {
      apiError(res, err)
    })
  })

  return mcApi
}
