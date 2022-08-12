export const STATUS_PENDING = 0
export const STATUS_RESOLVED = 1
export const STATUS_REJECTED = 2

export type PendingRecord<T> = {
  status: 0
  value: Wakeable<T>
}

export type ResolvedRecord<T> = {
  status: 1
  value: T
}

export type RejectedRecord = {
  status: 2
  value: any
}

export type Record<T> = PendingRecord<T> | ResolvedRecord<T> | RejectedRecord

// This type defines the subset of the Promise API that React uses (the .then method to add success/error callbacks).
// You can use a Promise for this, but Promises have a downside (the microtask queue).
// You can also create your own "thennable" if you want to support synchronous resolution/rejection.
export interface Thennable<T> {
  then(onFulfill: (value: T) => any, onReject: () => any): void | Thennable<T>
}

// Convenience type used by Suspense caches.
// Adds the ability to resolve or reject a pending Thennable.
export interface Wakeable<T> extends Thennable<T> {
  reject(error: any): void
  resolve(value?: T): void
}
// A "thennable" is a subset of the Promise API.
// We could use a Promise as thennable, but Promises have a downside: they use the microtask queue.
// An advantage to creating a custom thennable is synchronous resolution (or rejection).
//
// A "wakeable" is a "thennable" that has convenience resolve/reject methods.
export function createWakeable<T>(): Wakeable<T> {
  const resolveCallbacks: Set<(value: T) => void> = new Set()
  const rejectCallbacks: Set<(error: Error) => void> = new Set()

  const wakeable: Wakeable<T> = {
    then(
      resolveCallback: (value: T) => void,
      rejectCallback: (error: Error) => void
    ) {
      resolveCallbacks.add(resolveCallback)
      rejectCallbacks.add(rejectCallback)
    },
    reject(error: Error) {
      let thrown = false
      let thrownValue
      rejectCallbacks.forEach((rejectCallback) => {
        try {
          rejectCallback(error)
        } catch (error) {
          thrown = true
          thrownValue = error
        }
      })
      if (thrown) {
        throw thrownValue
      }
    },
    resolve(value: T) {
      let thrown = false
      let thrownValue
      resolveCallbacks.forEach((resolveCallback) => {
        try {
          resolveCallback(value)
        } catch (error) {
          thrown = true
          thrownValue = error
        }
      })
      if (thrown) {
        throw thrownValue
      }
    },
  }

  return wakeable
}
