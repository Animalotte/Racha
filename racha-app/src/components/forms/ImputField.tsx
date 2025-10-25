import React from 'react'

interface InputFieldProps {
  label: string
  type?: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  error
}) => {
  return (
    <div className="flex flex-col mb-4">
      <label htmlFor={name} className="font-semibold mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  )
}
