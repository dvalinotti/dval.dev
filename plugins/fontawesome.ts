import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import '@fortawesome/fontawesome-svg-core/styles.css'

// Brands
import {
  faAngular,
  faAws,
  faBitbucket,
  faCss3,
  faGithub,
  faGoogle,
  faGrunt,
  faGulp,
  faHackerrank,
  faHtml5,
  faJava,
  faJsSquare,
  faLinkedin,
  faNode,
  faPhp,
  faPython,
  faReact,
  faShopify,
  faTwitter,
  faVuejs,
  faWordpressSimple,
} from '@fortawesome/free-brands-svg-icons'

// Free Regular
import { faEnvelope } from '@fortawesome/free-regular-svg-icons'

// Pro Regular
import {
  faAd,
  faEggFried,
} from '@fortawesome/pro-regular-svg-icons'

// Pro Light
import {
  faBars,
  faMoonStars,
  faRabbitFast,
  faSun,
  faTimes,
  faUniversalAccess,
  faUserShield,
} from '@fortawesome/pro-light-svg-icons'

// Pro Duotone
import {
  faChevronDoubleRight,
  faSpinnerThird,
  faDoorOpen,
  faDoorClosed,
} from '@fortawesome/pro-duotone-svg-icons'

// Prevent FA from auto-injecting CSS (Nuxt handles it)
config.autoAddCss = false

// Register all icons
library.add(
  // Brands
  faAngular, faAws, faBitbucket, faCss3, faGithub, faGoogle,
  faGrunt, faGulp, faHackerrank, faHtml5, faJava, faJsSquare,
  faLinkedin, faNode, faPhp, faPython, faReact, faShopify,
  faTwitter, faVuejs, faWordpressSimple,
  // Regular
  faEnvelope, faAd, faEggFried,
  // Light
  faBars, faMoonStars, faRabbitFast, faSun, faTimes,
  faUniversalAccess, faUserShield,
  // Duotone
  faChevronDoubleRight, faSpinnerThird, faDoorOpen, faDoorClosed,
)

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('Fa', FontAwesomeIcon)
})
