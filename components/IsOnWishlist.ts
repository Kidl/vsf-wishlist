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
        .some(product => {
          if (this.product.type_id == 'configurable') {
            const parentSku = this.product.parentSku && this.product.parentSku.replace(new RegExp(`-${this.product.clone_color_id}$`), '')
            const sku = this.product.sku && this.product.sku.replace(new RegExp(`-${this.product.clone_color_id}$`), '')

            const options = []
            if (parentSku) {
              options.push(parentSku)
            }
            if (sku) {
              options.push(sku)
            }

            return options.includes(product.parentSku)
          }
          return product.sku === this.product.sku
        })
    }
  }
}
