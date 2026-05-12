import { useState } from 'react'
import { Modal, ModalHeader } from './Modal'
import { useApp } from '../store/app'

export function AccountModal() {
  const { accountOpen, closeAccount } = useApp()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    alert(
      mode === 'signin'
        ? `Signed in as ${email} (stub).`
        : `Account created for ${email} (stub).`,
    )
    closeAccount()
  }

  return (
    <Modal
      open={accountOpen}
      onClose={closeAccount}
      labelledBy="account-modal-title"
    >
      <ModalHeader
        title={mode === 'signin' ? 'Sign In' : 'Sign Up'}
        onClose={closeAccount}
        id="account-modal-title"
      />

      <form onSubmit={onSubmit} className="p-5 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="font-display text-[11px] tracking-[0.2em] uppercase text-ink">
            Email
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@team.com"
            className="engrave-input normal-case! tracking-[0.04em]!"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-display text-[11px] tracking-[0.2em] uppercase text-ink">
            Password
          </span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="engrave-input normal-case! tracking-[0.04em]!"
          />
        </label>

        <button
          type="submit"
          className="brutal-lift bg-ink text-accent font-display text-[13px] sm:text-[15px] tracking-[0.18em] uppercase border-4 border-ink shadow-brutal-lg hover:shadow-brutal-xl hover:bg-accent hover:text-ink flex items-center justify-center w-full h-14 mt-1"
        >
          {mode === 'signin' ? 'Sign In →' : 'Create Account →'}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="font-display text-[11px] tracking-[0.18em] uppercase text-ink underline decoration-[2px] underline-offset-4 hover:text-bg transition-colors"
          >
            {mode === 'signin'
              ? "No account? Sign up"
              : 'Have an account? Sign in'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
