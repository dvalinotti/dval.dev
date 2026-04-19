import PhotoSwipeLightbox from 'photoswipe/lightbox'
import type { Ref } from 'vue'
import 'photoswipe/style.css'

export interface LightboxPhoto {
  src: string
  width: number
  height: number
  alt: string
  caption?: string
}

export function useLightbox(photos: Ref<LightboxPhoto[]>) {
  let lightbox: PhotoSwipeLightbox | null = null

  onMounted(() => {
    lightbox = new PhotoSwipeLightbox({
      dataSource: [],
      pswpModule: () => import('photoswipe')
    })

    lightbox.on('uiRegister', () => {
      lightbox?.pswp?.ui?.registerElement({
        name: 'photo-caption',
        order: 9,
        isButton: false,
        appendTo: 'root',
        html: '',
        onInit: (el, pswp) => {
          el.style.position = 'absolute'
          el.style.bottom = '20px'
          el.style.left = '0'
          el.style.right = '0'
          el.style.textAlign = 'center'
          el.style.color = 'rgba(255,255,255,0.85)'
          el.style.fontSize = '14px'
          el.style.padding = '0 16px'
          el.style.pointerEvents = 'none'
          pswp.on('change', () => {
            el.innerHTML = photos.value[pswp.currIndex]?.caption || ''
          })
        }
      })
    })

    lightbox.init()
  })

  onBeforeUnmount(() => {
    lightbox?.destroy()
    lightbox = null
  })

  function open(index: number) {
    if (!lightbox) return
    lightbox.options.dataSource = photos.value.map(p => ({
      src: p.src,
      width: p.width,
      height: p.height,
      alt: p.alt
    }))
    lightbox.loadAndOpen(index)
  }

  return { open }
}
