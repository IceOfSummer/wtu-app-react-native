import { useEffect } from 'react'

function useUpdateCheck() {
  useEffect(() => {
    checkAppUpdate().then()
  }, [])
}

/**
 * 返回true表示不用更新
 */
export async function checkAppUpdate(): Promise<boolean> {
  return Promise.resolve(true)
}

export default useUpdateCheck
