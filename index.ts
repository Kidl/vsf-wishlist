import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { wishlistStore } from '@vue-storefront/core/modules/wishlist/store'
import whishListPersistPlugin from './store/plugin'
import { actions } from './store/actions'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'

export const WishlistModule: StorefrontModule = function ({store}) {
  StorageManager.init('wishlist')
  store.registerModule('wishlist', {
    ...wishlistStore,
    actions
  })
  store.subscribe(whishListPersistPlugin)
}
