import { storiesOf } from '@storybook/vue'

import Carousel from './src/Carousel.vue'

storiesOf('Carousel', module)
  .add('default', () => ({
    components: { Carousel },
    template: '<carousel></carousel>'
  }))