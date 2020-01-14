import * as types from './mutation-types'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'

const mutationToWatch = [types.WISH_ADD_ITEM, types.WISH_DEL_ITEM, types.WISH_DEL_ALL_ITEMS, types.WISH_LOAD_WISH]
  .map(m => `wishlist/${m}`)

const whishListPersistPlugin = (mutation, state) => {
  const whishListStorage = StorageManager.get('wishlist')

  if (mutationToWatch.includes(mutation.type) && mutation.type !== types.WISH_LOAD_WISH) {
    whishListStorage.setItem('current-wishlist', state.wishlist.items)
  } else if (types.WISH_LOAD_WISH === mutation.type) {
    const fromServer = state.wishlist.items.some(item => !!item.fromServer)
    if (fromServer) {
      whishListStorage.setItem('current-wishlist', state.wishlist.items)
    }
  }

}

export default whishListPersistPlugin
