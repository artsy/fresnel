import { FC, ReactNode, useEffect } from "react"

import { createWakeable, Wakeable } from "./suspense"

export const cache = new Map<string, Wakeable<unknown>>()

export interface SuspenderProps {
  id: string
  freeze: boolean
  children: ReactNode
}

/**
 * The task of the suspender component is to instruct the suspense boundary,
 * depending on the value of the "active" property.
 *
 * An important aspect is that the instruction is not to be executed
 * as a side effect but in the render step.
 *
 * 1. Active - true - return the child elements
 * 2. Active - false - creation and submission of a promise (Promise / Thenable)
 *
 * After the first render
 * 3. Active - false -> true - Promise fulfilment + return of the child elements
 * 4. Active - true -> false - Creation and submission of a promise
 *
 * 5. Active - false -> true -> false - Reuse and discard a promise
 *
 * Stable active
 * 6. Active - true -> true - Return of the child elements
 * 7. Active - false -> false - Reuse and submission of a promise (*1)
 *
 * Important: If a suspense boundary is suspended in the current
 * render step and this should also apply to subsequent render steps,
 * a commitment must be made repeatedly.
 */

export const Suspender: FC<SuspenderProps & { children: any }> = ({
  id,
  freeze,
  children,
}) => {
  useEffect(() => {
    return () => {
      cache.delete(id)
    }
  }, [])

  /**
   * If !freeze (the breakpoint matches) return children
   */

  if (!freeze) {
    if (!cache.has(id)) {
      // render children; skip the promise phase (case 1 & 6)
      return children
    } else if (cache.has(id)) {
      const weakable = cache.get(id)
      // resolve promise previously thrown, render children (case 3)
      weakable?.resolve()
      cache.delete(id)
      return children
    }
  }

  /**
   * If freeze (the breakpoint does not match) throw promise to suspend children / return nothing not even null
   */
  if (freeze) {
    if (!cache.has(id)) {
      // (case 2 & 4)
      const weakable = createWakeable()
      cache.set(id, weakable)
      throw weakable
    } else if (cache.has(id)) {
      // (case 5 & 7)
      const weakable = cache.get(id)
      throw weakable
    }
  }

  // do not return children
}
