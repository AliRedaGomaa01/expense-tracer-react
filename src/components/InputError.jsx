import { useEffect, useState } from "react"

export default function InputError({ errors = [] }) {
  
  const [isShow , setIsShow ] = useState(true);

  useEffect(() => {
    if (errors?.length > 0) {
      setIsShow(true);
      setTimeout(() => setIsShow(false), 3000);
    }
  }, [errors]);

  return (
    <>
      {errors?.length > 0  && isShow && (
        <div className="mt-4 p-3 text-red-700 bg-red-100 border border-red-300 rounded">
          <ul className="list-disc list-inside">
            {errors?.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}