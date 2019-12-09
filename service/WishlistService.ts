import { TaskQueue } from '@vue-storefront/core/lib/sync'
import { processLocalizedURLAddress } from '@vue-storefront/core/helpers'
import config from 'config'
import Task from '@vue-storefront/core/lib/sync/types/Task'

export namespace Wishlist {
  export const Add = (sku: string, token: string): Promise<Task> => 
    TaskQueue.execute({
      url: processLocalizedURLAddress(`${config.wishlist.endpoint}/add?token=${token}`),
      payload: {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        body: JSON.stringify({
          sku
        })
      },
      silent: true
    });

  export const Remove = (itemId: Number, token: string): Promise<Task> => 
    TaskQueue.execute({
      url: processLocalizedURLAddress(`${config.wishlist.endpoint}/remove/${itemId}/?token=${token}`),
      payload: {
        method: 'DELETE',
        mode: 'cors'
      },
      silent: true
    });

  export const Load = (token: string): Promise<Task> => 
    TaskQueue.execute({
      url: processLocalizedURLAddress(`${config.wishlist.endpoint}?token=${token}`),
      silent: true
    });
}