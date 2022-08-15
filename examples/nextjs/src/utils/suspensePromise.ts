/**
 * Promise wrapper to support React 18's suspense
 */
export const suspensePromise = (promise) => {
  let status = "pending"
  let result
  const suspend = promise().then(
    (res) => {
      status = "success"
      result = res
    },
    (err) => {
      status = "error"
      result = err
    }
  )
  return {
    read: () => {
      if (status === "pending") {
        throw suspend
      } else if (status === "error") {
        throw result
      } else if (status === "success") {
        return result
      }
    },
  }
}
