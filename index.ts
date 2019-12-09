import i18n from '@vue-storefront/i18n';
import rootStore from '@vue-storefront/core/store';
import { ActionTree } from 'vuex'
import * as types from '@vue-storefront/core/modules/wishlist/store/mutation-types'
import RootState from '@vue-storefront/core/types/RootState'
import WishlistState from '@vue-storefront/core/modules/wishlist/types/WishlistState'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'
import { Wishlist } from './service/WishlistService'
import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { wishlistStore } from '@vue-storefront/core/modules/wishlist/store'
import whishListPersistPlugin from '@vue-storefront/core/modules/wishlist/store/whishListPersistPlugin'

const actions: ActionTree<WishlistState, RootState> = {
  clear (context) {
    context.commit(types.WISH_DEL_ALL_ITEMS, [])
  },
  async load ({ commit, getters, dispatch }, force: boolean = false) {
    if (!force && getters.isWishlistLoaded) return
    commit(types.SET_WISHLIST_LOADED)
    const storedItems = await dispatch('loadFromCache')
    commit(types.WISH_LOAD_WISH, storedItems)
  },
  loadFromCache () {
    const wishlistStorage = StorageManager.get('wishlist')
    return wishlistStorage.getItem('current-wishlist')
  },
  async addItem ({ commit, rootGetters }, product): Promise<Boolean> {

    let item_id: Number
    if (rootGetters['user/isLoggedIn']) {
      let { resultCode, result } = await Wishlist.Add(product.sku, rootGetters['user/getToken'])
      if (resultCode !== 200) {
        rootStore.dispatch('notification/spawnNotification', {
          type: 'error',
          message: i18n.t("Couldn't add this item to the wishlist, sorry."),
          action1: { label: i18n.t('OK') }
        })
        return false
      }
      item_id = result.wishlist_item_id

    }
    commit(types.WISH_ADD_ITEM, {
      product: {
        ...product,
        ...(item_id ? { item_id } : {})
      }
    })
    return true
  },
  async removeItem ({ state, commit, rootGetters }, product): Promise<Boolean> {
    const storageProduct = state.items.find(p => p.sku === product.sku)
    if (rootGetters['user/isLoggedIn'] && storageProduct.item_id) {
      let { resultCode } = await Wishlist.Remove(storageProduct.item_id, rootGetters['user/getToken'])
      if (resultCode !== 200) {
        rootStore.dispatch('notification/spawnNotification', {
          type: 'error',
          message: i18n.t("Couldn't remove this item from the wishlist, sorry."),
          action1: { label: i18n.t('OK') }
        })
        return false
      }
    }
    commit(types.WISH_DEL_ITEM, { product: storageProduct })
  }
}

export const WishlistModule: StorefrontModule = function ({store}) {
  StorageManager.init('wishlist')
  store.registerModule('wishlist', {
    ...wishlistStore,
    actions
  })
  store.subscribe(whishListPersistPlugin)
}
