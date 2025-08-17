import { useCallback, useMemo, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'

type ReactNode = import('react').ReactNode

export type UseConfirmDeleteOptions<ID = string, Ctx = unknown> = {
  /** Your controller method that actually deletes the entity */
  deleteFn: (id: ID, ctx?: Ctx) => Promise<void> | void
  /** Optional dialog pieces (can be static or derived from ctx) */
  title?: string | ((id: ID, ctx?: Ctx) => ReactNode)
  message?: string | ((id: ID, ctx?: Ctx) => ReactNode)
  confirmText?: string
  cancelText?: string
  /** Side-effects */
  onSuccess?: (id: ID, ctx?: Ctx) => void
  onError?: (error: unknown, id: ID, ctx?: Ctx) => void
}

export const useConfirmDelete = <ID = string, Ctx = unknown>(
  opts: UseConfirmDeleteOptions<ID, Ctx>
) => {
  const {
    deleteFn,
    title = 'Delete item',
    message = 'This action cannot be undone.',
    confirmText = 'Delete',
    cancelText = 'Cancel',
    onSuccess,
    onError,
  } = opts

  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [current, setCurrent] = useState<{ id: ID | null; ctx?: Ctx }>({ id: null })

  const doOpen = useCallback((id: ID, ctx?: Ctx) => {
    setCurrent({ id, ctx })
    setOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    if (busy) return
    setOpen(false)
  }, [busy])

  const handleConfirm = useCallback(async () => {
    if (current.id == null) return
    try {
      setBusy(true)
      await deleteFn(current.id, current.ctx)
      onSuccess?.(current.id, current.ctx)
      setOpen(false)
    } catch (e) {
      onError?.(e, current.id, current.ctx)
    } finally {
      setBusy(false)
    }
  }, [current, deleteFn, onSuccess, onError])

  const resolvedTitle = useMemo<ReactNode>(
    () => (typeof title === 'function' ? title(current.id as ID, current.ctx) : title),
    [title, current]
  )

  const resolvedMessage = useMemo<ReactNode>(
    () => (typeof message === 'function' ? message(current.id as ID, current.ctx) : message),
    [message, current]
  )

  // Render this element once where modals should live (e.g., in a page/layout)
  const ConfirmDialog = useMemo(
    () => (
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>{resolvedTitle}</DialogTitle>
        <DialogContent>
          {typeof resolvedMessage === 'string' ? (
            <Typography variant="body2">{resolvedMessage}</Typography>
          ) : (
            resolvedMessage
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={busy}>
            {cancelText}
          </Button>
          <Button onClick={handleConfirm} color="error" variant="contained" disabled={busy}>
            {confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    ),
    [open, handleClose, handleConfirm, resolvedTitle, resolvedMessage, busy, cancelText, confirmText]
  )

  return {
    /** Call this with the entity id (and optional context) to open the modal */
    open: doOpen,
    /** Render this once (e.g., at the end of your page) */
    ConfirmDialog,
    /** Useful flags */
    isOpen: open,
    isDeleting: busy,
  }
}
