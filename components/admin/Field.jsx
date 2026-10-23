'use client';

/** Campo de formulário reutilizável (controlado pelo componente pai). */
export default function Field({
  label,
  value,
  onChange,
  textarea = false,
  type = 'text',
  wide = false,
  placeholder = '',
  ...inputProps
}) {
  const className = wide ? 'admin-field wide' : 'admin-field';
  const sharedProps = {
    ...inputProps,
    value: value ?? '',
    placeholder,
    onChange: (event) => onChange(event.target.value),
  };

  return (
    <label className={className}>
      {label}
      {textarea ? (
        <textarea {...sharedProps} />
      ) : (
        <input {...sharedProps} type={type} />
      )}
    </label>
  );
}
