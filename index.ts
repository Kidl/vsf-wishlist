import { once } from '@vue-storefront/core/helpers';
import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { wishlistStore } from '@vue-storefront/core/modules/wishlist/store'
import whishListPersistPlugin from './store/plugin'
import { actions } from './store/actions'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'

export const WishlistModule: StorefrontModule = function ({ app, store }) {
  StorageManager.init('wishlist')
  store.registerModule('wishlist', {
    ...wishlistStore,
    actions
  })
  store.subscribe(whishListPersistPlugin)

  once('__VUE_WISHLIST__', () => {
    EventBus.$on('user-after-loggedin', () => {
      store.dispatch('wishlist/load', { force: true })
    })
  })
}
