import { WishlistModule } from '../'
import wishlistMountedMixin from '@vue-storefront/core/modules/wishlist/mixins/wishlistMountedMixin'
import { registerModule } from '@vue-storefront/core/lib/modules';

export const IsOnWishlist = {
  name: 'isOnWishlist',
  mixins: [wishlistMountedMixin],
  props: {
    product: {
      required: true,
      type: Object
    }
  },
  created () {
    registerModule(WishlistModule)
  },
  computed: {
    isOnWishlist () {
      return this.$store.state['wishlist'].items
        && this.$store.state['wishlist'].items
        .some(product => product.parentSku === this.product.parentSku.replace(new RegExp(`-${product.clone_color_id}$`), ''))
    }
  }
}
