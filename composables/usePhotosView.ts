export type PhotosView = 'albums' | 'all'

export function usePhotosView() {
  const route = useRoute()
  const router = useRouter()

  const view = computed<PhotosView>(() =>
    route.query.view === 'all' ? 'all' : 'albums'
  )

  function setView(target: PhotosView) {
    if (view.value === target) return
    router.replace({
      query: target === 'all' ? { view: 'all' } : {}
    })
  }

  return { view, setView }
}
