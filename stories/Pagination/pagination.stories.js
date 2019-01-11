import { storiesOf } from '@storybook/vue'

import Pagination from './Pagination.vue'

storiesOf('Pagination', module).add('defaultPagination', () => ({
  components: { Pagination },
  template: `<pagination :total="50"/>`
}))
