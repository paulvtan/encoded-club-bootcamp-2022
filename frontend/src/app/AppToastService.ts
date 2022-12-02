import { Injectable } from '@angular/core'

export interface ToastInfo {
  header: string
  body: string
  autohide: boolean
}

@Injectable({ providedIn: 'root' })
export class AppToastService {
  toasts: ToastInfo[] = []

  show(header: string, body: string, autohide: boolean) {
    this.toasts.push({ header, body, autohide })
  }

  remove(toast: ToastInfo) {
    this.toasts = this.toasts.filter((t) => t != toast)
  }
}
