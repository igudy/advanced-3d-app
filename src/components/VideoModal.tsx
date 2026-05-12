import { Modal, ModalHeader } from './Modal'
import { useApp } from '../store/app'

export function VideoModal() {
  const { videoOpen, closeVideo } = useApp()

  return (
    <Modal
      open={videoOpen}
      onClose={closeVideo}
      labelledBy="video-modal-title"
      panelClassName="w-full max-w-2xl"
    >
      <ModalHeader
        title="Promotion · 0:42"
        onClose={closeVideo}
        id="video-modal-title"
      />
      <div className="relative w-full aspect-video bg-ink">
        {videoOpen && (
          <iframe
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&modestbranding=1"
            title="Promotion video"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    </Modal>
  )
}
